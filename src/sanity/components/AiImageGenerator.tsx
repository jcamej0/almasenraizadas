'use client'

/**
 * AiImageGenerator — Sanity Studio component for AI image generation.
 *
 * Features:
 * - Source selector: generate from Title, Excerpt, Body content, or custom prompt
 * - Generates 2 images in parallel
 * - Preview grid to compare and choose
 * - Selected image is uploaded to Sanity assets and set as field value
 */
import { useCallback, useState } from 'react'
import { type ObjectInputProps, useFormValue, useClient, set } from 'sanity'
import {
  Button, Card, Flex, Stack, Text, Spinner,
  Select, TextArea, Grid, Box,
} from '@sanity/ui'
import { ImageIcon, SparklesIcon } from '@sanity/icons'
import { extractPlainText } from './ai-utils'

const IMAGE_API_ENDPOINT = '/api/ai/image'
const IMAGE_PROXY_ENDPOINT = '/api/ai/image/proxy'
const IMAGE_COUNT = 2

type PromptSource = 'title' | 'description' | 'excerpt' | 'body' | 'custom'

interface GeneratedImage {
  url: string
  revisedPrompt: string
}

/** Detect which prompt sources are available in the current document */
const useAvailableSources = () => {
  const title = (useFormValue(['title']) as string | undefined) ?? ''
  const name = (useFormValue(['name']) as string | undefined) ?? ''
  const description = (useFormValue(['description']) as string | undefined) ?? ''
  const excerpt = (useFormValue(['excerpt']) as string | undefined) ?? ''
  const body = useFormValue(['body']) as unknown
  const bodyText = extractPlainText(body)

  /** Use title or name (for author schema) */
  const docTitle = title || name

  const sources: { value: PromptSource; label: string }[] = [
    { value: 'title', label: `Desde el título: "${docTitle.slice(0, 40)}${docTitle.length > 40 ? '…' : ''}"` },
  ]

  if (description) sources.push({ value: 'description', label: 'Desde la descripción' })
  if (excerpt) sources.push({ value: 'excerpt', label: 'Desde el extracto' })
  if (bodyText) sources.push({ value: 'body', label: 'Desde el contenido' })
  sources.push({ value: 'custom', label: 'Prompt personalizado' })

  return { docTitle, description, excerpt, bodyText, sources }
}

/** Build the prompt text from the selected source */
const buildPromptFromSource = (
  source: PromptSource,
  title: string,
  description: string,
  excerpt: string,
  bodyText: string,
  customPrompt: string
): string => {
  const prompts: Record<PromptSource, string> = {
    title: title,
    description: description,
    excerpt: excerpt,
    body: bodyText.slice(0, 500),
    custom: customPrompt,
  }
  return prompts[source]
}

export function AiImageGenerator(props: ObjectInputProps) {
  const client = useClient({ apiVersion: '2024-01-01' })

  const { docTitle, description, excerpt, bodyText, sources } = useAvailableSources()

  const [source, setSource] = useState<PromptSource>('title')
  const [customPrompt, setCustomPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [error, setError] = useState<string | null>(null)

  /** Generate images from the API */
  const handleGenerate = useCallback(async () => {
    const prompt = buildPromptFromSource(source, docTitle, description, excerpt, bodyText, customPrompt)
    if (!prompt.trim()) {
      setError('No hay contenido para generar. Escribe algo primero.')
      return
    }

    setLoading(true)
    setError(null)
    setImages([])

    try {
      const response = await fetch(IMAGE_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, count: IMAGE_COUNT }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error ?? `Error ${response.status}`)
      }

      setImages(data.images ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar imágenes')
    } finally {
      setLoading(false)
    }
  }, [source, docTitle, description, excerpt, bodyText, customPrompt])

  /** Upload selected image to Sanity and set it as the field value */
  const handleSelectImage = useCallback(async (imageUrl: string) => {
    setUploading(true)
    setError(null)

    try {
      /** Fetch via our proxy to bypass CORS */
      const proxyUrl = `${IMAGE_PROXY_ENDPOINT}?url=${encodeURIComponent(imageUrl)}`
      const imageResponse = await fetch(proxyUrl)
      if (!imageResponse.ok) throw new Error('No se pudo descargar la imagen')

      const blob = await imageResponse.blob()
      const fileName = `ai-generated-${Date.now()}.png`

      /** Upload to Sanity assets */
      const asset = await client.assets.upload('image', blob, {
        filename: fileName,
        contentType: 'image/png',
      })

      /** Set the image field value with asset reference */
      props.onChange(
        set({
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        })
      )

      setImages([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }, [client, props])

  /** Discard generated images */
  const handleDiscard = useCallback(() => {
    setImages([])
    setError(null)
  }, [])

  return (
    <Stack space={4}>
      {/* Default Sanity image input */}
      {props.renderDefault(props)}

      {/* AI generation panel */}
      <Card tone="transparent" padding={4} radius={2} border>
        <Stack space={4}>
          <Flex align="center" gap={2}>
            <SparklesIcon />
            <Text size={1} weight="semibold">
              Generar imagen con IA
            </Text>
          </Flex>

          {/* Source selector */}
          <Select
            fontSize={1}
            value={source}
            onChange={(e) => setSource(e.currentTarget.value as PromptSource)}
          >
            {sources.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          {/* Custom prompt textarea (only when source is 'custom') */}
          {source === 'custom' && (
            <TextArea
              fontSize={1}
              rows={3}
              placeholder="Describe la imagen que quieres generar... (ej: mujer meditando en un jardín al atardecer)"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.currentTarget.value)}
            />
          )}

          {/* Generate button */}
          <Button
            icon={loading ? Spinner : ImageIcon}
            text={loading ? `Generando ${IMAGE_COUNT} imágenes...` : `Generar ${IMAGE_COUNT} imágenes`}
            tone="primary"
            mode="ghost"
            fontSize={1}
            padding={3}
            onClick={handleGenerate}
            disabled={loading || uploading}
          />

          {/* Error message */}
          {error && (
            <Card tone="critical" padding={3} radius={2}>
              <Text size={1}>{error}</Text>
            </Card>
          )}

          {/* Image preview grid */}
          {images.length > 0 && (
            <Stack space={3}>
              <Text size={1} weight="semibold">
                Elige la imagen que prefieras:
              </Text>

              <Grid columns={images.length} gap={3}>
                {images.map((img, index) => (
                  <Card
                    key={index}
                    radius={2}
                    overflow="hidden"
                    border
                    style={{ cursor: uploading ? 'wait' : 'pointer' }}
                  >
                    <Stack space={2}>
                      <Box
                        style={{
                          position: 'relative',
                          paddingBottom: '56.25%',
                          overflow: 'hidden',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={`Opción ${index + 1}`}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                      <Box padding={2}>
                        <Stack space={2}>
                          <Text size={0} muted style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}>
                            {img.revisedPrompt}
                          </Text>
                          <Button
                            text={uploading ? 'Subiendo...' : `Usar opción ${index + 1}`}
                            tone="positive"
                            fontSize={1}
                            padding={2}
                            onClick={() => handleSelectImage(img.url)}
                            disabled={uploading}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </Card>
                ))}
              </Grid>

              <Button
                text="Descartar todas"
                tone="default"
                mode="ghost"
                fontSize={1}
                padding={2}
                onClick={handleDiscard}
                disabled={uploading}
              />
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}
