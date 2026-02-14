'use client'

/**
 * AiBodyInput — Custom Sanity input for the body (Portable Text) field.
 * Generates a full article from the post title via AI, then parses
 * markdown into rich Portable Text blocks (h2, h3, blockquote, bold,
 * italic, bullet lists, numbered lists).
 */
import { useCallback, useState } from 'react'
import { type ArrayOfObjectsInputProps, useFormValue, set } from 'sanity'
import { Button, Card, Flex, Stack, Text, Spinner } from '@sanity/ui'
import { SparklesIcon, DocumentTextIcon } from '@sanity/icons'
import { fetchAiResult } from './ai-utils'

/** Generate a short random key for Portable Text blocks */
const randomKey = (): string =>
  Math.random().toString(36).slice(2, 10)

// =========================================================================
// Inline markdown parser (bold + italic)
// =========================================================================

interface PtSpan {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

interface MarkDef {
  _key: string
  _type: string
}

/** Token types for inline parsing */
type InlineToken =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string }
  | { kind: 'italic'; value: string }

/** Tokenize inline markdown: **bold** and *italic* */
const tokenizeInline = (text: string): InlineToken[] => {
  const tokens: InlineToken[] = []
  const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null = null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ kind: 'text', value: text.slice(lastIndex, match.index) })
    }

    if (match[2]) {
      tokens.push({ kind: 'bold', value: match[2] })
    } else if (match[3]) {
      tokens.push({ kind: 'italic', value: match[3] })
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    tokens.push({ kind: 'text', value: text.slice(lastIndex) })
  }

  if (tokens.length === 0 && text.length > 0) {
    tokens.push({ kind: 'text', value: text })
  }

  return tokens
}

/** Convert inline tokens into Portable Text spans + markDefs */
const buildSpansAndMarkDefs = (
  text: string
): { children: PtSpan[]; markDefs: MarkDef[] } => {
  const tokens = tokenizeInline(text)
  const children: PtSpan[] = []
  const markDefs: MarkDef[] = []

  for (const token of tokens) {
    if (token.kind === 'text') {
      children.push({ _type: 'span', _key: randomKey(), text: token.value, marks: [] })
    } else {
      const markKey = randomKey()
      const markType = token.kind === 'bold' ? 'strong' : 'em'
      markDefs.push({ _key: markKey, _type: markType })
      children.push({ _type: 'span', _key: randomKey(), text: token.value, marks: [markKey] })
    }
  }

  if (children.length === 0) {
    children.push({ _type: 'span', _key: randomKey(), text: '', marks: [] })
  }

  return { children, markDefs }
}

// =========================================================================
// Block-level markdown parser
// =========================================================================

interface PtBlock {
  _type: 'block'
  _key: string
  style: string
  listItem?: 'bullet' | 'number'
  level?: number
  markDefs: MarkDef[]
  children: PtSpan[]
}

/** Create a Portable Text block from text + style */
const createBlock = (
  text: string,
  style: string,
  listItem?: 'bullet' | 'number'
): PtBlock => {
  const { children, markDefs } = buildSpansAndMarkDefs(text)
  const block: PtBlock = {
    _type: 'block',
    _key: randomKey(),
    style,
    markDefs,
    children,
  }
  if (listItem) {
    block.listItem = listItem
    block.level = 1
  }
  return block
}

/**
 * Parse full markdown-like AI output into Portable Text blocks.
 * Supports: ## h2, ### h3, > blockquote, **bold**, *italic*,
 * - bullet list, 1. numbered list, normal paragraphs.
 */
const parseToPortableText = (markdown: string): PtBlock[] => {
  const lines = markdown.split('\n')
  const blocks: PtBlock[] = []

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const trimmed = line.trim()
    if (trimmed.length === 0) continue

    /** H2 heading */
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      blocks.push(createBlock(trimmed.slice(3).trim(), 'h2'))
      continue
    }

    /** H3 heading */
    if (trimmed.startsWith('### ')) {
      blocks.push(createBlock(trimmed.slice(4).trim(), 'h3'))
      continue
    }

    /** Blockquote */
    if (trimmed.startsWith('> ')) {
      blocks.push(createBlock(trimmed.slice(2).trim(), 'blockquote'))
      continue
    }

    /** Bullet list item */
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      blocks.push(createBlock(trimmed.slice(2).trim(), 'normal', 'bullet'))
      continue
    }

    /** Numbered list item (1. 2. 3. etc) */
    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/)
    if (numberedMatch) {
      blocks.push(createBlock(numberedMatch[1].trim(), 'normal', 'number'))
      continue
    }

    /** Normal paragraph */
    blocks.push(createBlock(trimmed, 'normal'))
  }

  return blocks
}

// =========================================================================
// Component
// =========================================================================

export function AiBodyInput(props: ArrayOfObjectsInputProps) {
  const title = useFormValue(['title']) as string | undefined
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  /** Generate article content */
  const handleGenerate = useCallback(async () => {
    if (!title?.trim()) {
      setError('Escribe un título primero para generar el contenido')
      return
    }

    setLoading(true)
    setError(null)
    setPreview(null)

    try {
      const result = await fetchAiResult('bodyContent', title, '')
      setPreview(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar contenido')
    } finally {
      setLoading(false)
    }
  }, [title])

  /** Accept the generated content — parse and set */
  const handleAccept = useCallback(() => {
    if (!preview) return
    const blocks = parseToPortableText(preview)
    props.onChange(set(blocks))
    setPreview(null)
  }, [preview, props])

  /** Discard the preview */
  const handleDiscard = useCallback(() => {
    setPreview(null)
    setError(null)
  }, [])

  return (
    <Stack space={3}>
      {/* Default Sanity Portable Text editor */}
      {props.renderDefault(props)}

      {/* AI generate button */}
      <Flex gap={2} align="center">
        <Button
          icon={loading ? Spinner : SparklesIcon}
          text={loading ? 'Generando artículo...' : 'Generar artículo con IA'}
          tone="primary"
          mode="ghost"
          fontSize={1}
          padding={2}
          onClick={handleGenerate}
          disabled={loading}
        />
      </Flex>

      {/* Error */}
      {error && (
        <Card tone="critical" padding={3} radius={2}>
          <Text size={1}>{error}</Text>
        </Card>
      )}

      {/* Preview of generated content */}
      {preview && (
        <Card tone="positive" padding={4} radius={2} border>
          <Stack space={4}>
            <Flex align="center" gap={2}>
              <DocumentTextIcon />
              <Text size={1} weight="semibold">
                Vista previa del artículo generado:
              </Text>
            </Flex>

            <Card
              padding={4}
              radius={2}
              tone="default"
              style={{
                maxHeight: '400px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            >
              <Text size={1} style={{ whiteSpace: 'pre-wrap' }}>
                {preview}
              </Text>
            </Card>

            <Flex gap={2}>
              <Button
                text="Usar este contenido"
                tone="positive"
                fontSize={1}
                padding={2}
                onClick={handleAccept}
              />
              <Button
                text="Descartar"
                tone="default"
                mode="ghost"
                fontSize={1}
                padding={2}
                onClick={handleDiscard}
              />
            </Flex>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
