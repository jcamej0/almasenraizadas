import { defineType, defineField } from 'sanity'
import { AiImageGenerator } from '../components/AiImageGenerator'

export default defineType({
  name: 'subcategory',
  title: 'Subcategory',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'section',
      title: 'Parent Section',
      type: 'reference',
      to: [{ type: 'section' }],
      validation: (rule) => rule.required(),
      description: 'The section this subcategory belongs to.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      components: { input: AiImageGenerator },
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Sort order within the section (lower numbers first).',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      sectionTitle: 'section.title',
      order: 'order',
      media: 'image',
    },
    prepare({ title, sectionTitle, order, media }) {
      return {
        title,
        subtitle: [sectionTitle, order != null ? `Order: ${order}` : null]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
