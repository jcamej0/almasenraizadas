'use client'

/**
 * Custom Sanity input for the aiSummary field.
 * Adds a "Generate summary" button that reads the post body
 * and generates a summary via the AI API.
 */
import { useCallback } from 'react'
import { type TextInputProps, useFormValue, set } from 'sanity'
import { AiFieldWrapper } from './AiFieldWrapper'
import { extractPlainText, fetchAiResult } from './ai-utils'

export function AiSummaryInput(props: TextInputProps) {
  const title = useFormValue(['title']) as string | undefined
  const body = useFormValue(['body']) as unknown

  const handleGenerate = useCallback(async () => {
    const plainText = extractPlainText(body)
    if (!plainText) throw new Error('Escribe contenido en el body antes de generar el resumen')
    return fetchAiResult('summary', title ?? '', plainText)
  }, [title, body])

  const handleAccept = useCallback(
    (value: string) => {
      props.onChange(set(value))
    },
    [props]
  )

  return (
    <AiFieldWrapper
      label="Generar resumen con IA"
      onGenerate={handleGenerate}
      onAccept={handleAccept}
    >
      {props.renderDefault(props)}
    </AiFieldWrapper>
  )
}
