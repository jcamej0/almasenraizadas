'use client'

/**
 * Custom Sanity input for the title field.
 * Adds a "Suggest SEO titles" button that generates
 * optimized title variants via the AI API.
 */
import { useCallback } from 'react'
import { type StringInputProps, useFormValue, set } from 'sanity'
import { AiFieldWrapper } from './AiFieldWrapper'
import { fetchAiResult } from './ai-utils'

export function AiSeoTitleInput(props: StringInputProps) {
  const title = useFormValue(['title']) as string | undefined

  const handleGenerate = useCallback(async () => {
    if (!title) throw new Error('Escribe un título primero')
    return fetchAiResult('seoTitle', title, '')
  }, [title])

  const handleAccept = useCallback(
    (value: string) => {
      // The result contains numbered options (1. ... 2. ... 3. ...)
      // Extract the first option as default, user can edit
      const firstOption = value
        .split('\n')
        .map((line) => line.replace(/^\d+\.\s*/, '').trim())
        .find((line) => line.length > 0)

      if (firstOption) {
        props.onChange(set(firstOption))
      }
    },
    [props]
  )

  return (
    <AiFieldWrapper
      label="Sugerir títulos SEO"
      onGenerate={handleGenerate}
      onAccept={handleAccept}
    >
      {props.renderDefault(props)}
    </AiFieldWrapper>
  )
}
