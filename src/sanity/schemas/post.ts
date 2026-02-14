import { defineType, defineField, defineArrayMember } from 'sanity'
import { AiSummaryInput } from '../components/AiSummaryInput'
import { AiExcerptInput } from '../components/AiExcerptInput'
import { AiSeoTitleInput } from '../components/AiSeoTitleInput'
import { AiReadingTimeInput } from '../components/AiReadingTimeInput'
import { AiImageGenerator } from '../components/AiImageGenerator'
import { AiBodyInput } from '../components/AiBodyInput'

const EXCERPT_MAX_LENGTH = 200
const RATING_MIN = 0
const RATING_MAX = 5

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'metadata', title: 'Metadata' },
    { name: 'seo', title: 'SEO & AI' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
      components: {
        input: AiSeoTitleInput,
      },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'content',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for the image for accessibility.',
        }),
      ],
      components: {
        input: AiImageGenerator,
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'metadata',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: (rule) => rule.max(EXCERPT_MAX_LENGTH),
      components: {
        input: AiExcerptInput,
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Alternative text for the image.',
            }),
          ],
        }),
      ],
      components: {
        input: AiBodyInput,
      },
    }),
    defineField({
      name: 'section',
      title: 'Section',
      type: 'reference',
      group: 'metadata',
      to: [{ type: 'section' }],
    }),
    defineField({
      name: 'subcategory',
      title: 'Subcategory',
      type: 'reference',
      group: 'metadata',
      to: [{ type: 'subcategory' }],
      description: 'Optional subcategory within the section (e.g. Guías, Noticias).',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'metadata',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'tag' }],
        }),
      ],
    }),
    defineField({
      name: 'aiSummary',
      title: 'AI Summary',
      type: 'text',
      group: 'seo',
      rows: 4,
      description: 'Resumen generado con IA para buscadores y lectores rápidos.',
      components: {
        input: AiSummaryInput,
      },
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      group: 'metadata',
      validation: (rule) => rule.min(RATING_MIN).max(RATING_MAX),
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      group: 'metadata',
      components: {
        input: AiReadingTimeInput,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      authorName: 'author.name',
      media: 'mainImage',
    },
    prepare({ title, authorName, media }) {
      return {
        title,
        subtitle: authorName ?? undefined,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published At, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
