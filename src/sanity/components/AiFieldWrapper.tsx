'use client'

/**
 * Reusable wrapper that adds an AI generate button to any Sanity text field.
 * Renders the default field input + a button that calls the AI API.
 */
import { useCallback, useState, type ReactNode } from 'react'
import { Button, Card, Flex, Stack, Text, Spinner } from '@sanity/ui'
import { SparklesIcon } from '@sanity/icons'

interface AiFieldWrapperProps {
  /** The default rendered Sanity input */
  children: ReactNode
  /** Button label */
  label: string
  /** Async function that performs the AI generation */
  onGenerate: () => Promise<string>
  /** Callback to write the result into the field */
  onAccept: (value: string) => void
}

export function AiFieldWrapper({
  children,
  label,
  onGenerate,
  onAccept,
}: AiFieldWrapperProps) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = useCallback(async () => {
    setLoading(true)
    setError(null)
    setPreview(null)

    try {
      const result = await onGenerate()
      setPreview(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar')
    } finally {
      setLoading(false)
    }
  }, [onGenerate])

  const handleAccept = useCallback(() => {
    if (preview) {
      onAccept(preview)
      setPreview(null)
    }
  }, [preview, onAccept])

  const handleDiscard = useCallback(() => {
    setPreview(null)
    setError(null)
  }, [])

  return (
    <Stack space={3}>
      {children}

      <Flex gap={2} align="center">
        <Button
          icon={loading ? Spinner : SparklesIcon}
          text={loading ? 'Generando...' : label}
          tone="primary"
          mode="ghost"
          fontSize={1}
          padding={2}
          onClick={handleGenerate}
          disabled={loading}
        />
      </Flex>

      {error && (
        <Card tone="critical" padding={3} radius={2}>
          <Text size={1}>{error}</Text>
        </Card>
      )}

      {preview && (
        <Card tone="positive" padding={3} radius={2} border>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Sugerencia de IA:
            </Text>
            <Text size={1} style={{ whiteSpace: 'pre-wrap' }}>
              {preview}
            </Text>
            <Flex gap={2}>
              <Button
                text="Usar este texto"
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
