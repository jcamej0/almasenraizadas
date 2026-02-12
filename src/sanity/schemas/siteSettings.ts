import { defineType, defineField, defineArrayMember } from 'sanity'

const SOCIAL_PLATFORMS = ['instagram', 'twitter', 'linkedin', 'facebook', 'youtube', 'tiktok'] as const

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton pattern: enforce via Sanity Studio structure, not options
  groups: [
    { name: 'general', title: 'General' },
    { name: 'social', title: 'Social' },
    { name: 'navigation', title: 'Navigation' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      group: 'general',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'general',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'ogImage',
      title: 'Default OG Image',
      type: 'image',
      group: 'general',
      description: 'Default Open Graph image for social sharing.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'social',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: SOCIAL_PLATFORMS.map((p) => ({ title: p.charAt(0).toUpperCase() + p.slice(1), value: p })),
              },
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
          preview: {
            select: { platform: 'platform' },
            prepare({ platform }) {
              return {
                title: platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Social link',
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
      group: 'navigation',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
            }),
          ],
          preview: {
            select: { label: 'label' },
            prepare({ label }) {
              return {
                title: label ?? 'Nav item',
              }
            },
          },
        }),
      ],
    }),
  ],
})
