'use client'

/**
 * Custom Sanity input for the excerpt field.
 * Adds a "Generate excerpt" button that reads the post body
 * and generates a short, engaging excerpt via the AI API.
 */
import { useCallback } from 'react'
import { type TextInputProps, useFormValue, set } from 'sanity'
import { AiFieldWrapper } from './AiFieldWrapper'
import { extractPlainText, fetchAiResult } from './ai-utils'

export function AiExcerptInput(props: TextInputProps) {
  const title = useFormValue(['title']) as string | undefined
  const body = useFormValue(['body']) as unknown

  const handleGenerate = useCallback(async () => {
    const plainText = extractPlainText(body)
    if (!plainText) throw new Error('Escribe contenido en el body antes de generar el extracto')
    return fetchAiResult('excerpt', title ?? '', plainText)
  }, [title, body])

  const handleAccept = useCallback(
    (value: string) => {
      props.onChange(set(value))
    },
    [props]
  )

  return (
    <AiFieldWrapper
      label="Generar extracto con IA"
      onGenerate={handleGenerate}
      onAccept={handleAccept}
    >
      {props.renderDefault(props)}
    </AiFieldWrapper>
  )
}
