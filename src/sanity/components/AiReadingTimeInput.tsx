'use client'

/**
 * Custom Sanity input for the readingTime field.
 * Adds a "Calculate" button that estimates reading time
 * based on the post body word count (no API call needed).
 */
import { useCallback } from 'react'
import { type NumberInputProps, useFormValue, set } from 'sanity'
import { Button, Flex, Stack } from '@sanity/ui'
import { ClockIcon } from '@sanity/icons'
import { extractPlainText } from './ai-utils'

const WORDS_PER_MINUTE = 200

export function AiReadingTimeInput(props: NumberInputProps) {
  const body = useFormValue(['body']) as unknown

  const handleCalculate = useCallback(() => {
    const plainText = extractPlainText(body)
    if (!plainText) return

    const wordCount = plainText.split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
    props.onChange(set(minutes))
  }, [body, props])

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Flex>
        <Button
          icon={ClockIcon}
          text="Calcular tiempo de lectura"
          tone="primary"
          mode="ghost"
          fontSize={1}
          padding={2}
          onClick={handleCalculate}
        />
      </Flex>
    </Stack>
  )
}
