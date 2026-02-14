/**
 * Sanity Studio configuration for Almas Enraizadas.
 * This file is used when running the Sanity Studio embedded in Next.js
 * or as a standalone studio.
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import type { StructureBuilder } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from '@/sanity/schema';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

/** IDs of types handled manually in the desk structure */
const CUSTOM_TYPES = ['siteSettings', 'post', 'section', 'subcategory'];

/**
 * Build a hierarchical desk structure:
 *   Secciones
 *     └─ Aceites Esenciales
 *         ├─ Todos los posts (de la sección)
 *         └─ Subcategorías
 *             └─ Guías
 *                 └─ posts de esa subcategoría
 */
const buildStructure = (S: StructureBuilder) =>
  S.list()
    .title('Contenido')
    .items([
      // ── Singleton: Site Settings ──
      S.listItem()
        .title('Configuración del Sitio')
        .icon(() => '⚙️')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      S.divider(),

      // ── Posts organizados por Sección → Subcategoría ──
      S.listItem()
        .title('Posts por Sección')
        .icon(() => '📂')
        .child(
          S.documentTypeList('section')
            .title('Secciones')
            .child((sectionId) =>
              S.list()
                .title('Contenido de la sección')
                .items([
                  // All posts that belong to this section (no subcategory)
                  S.listItem()
                    .title('Posts directos')
                    .icon(() => '📝')
                    .child(
                      S.documentList()
                        .title('Posts sin subcategoría')
                        .filter(
                          '_type == "post" && section._ref == $sectionId && !defined(subcategory)'
                        )
                        .params({ sectionId })
                    ),

                  // All posts that belong to this section (any subcategory)
                  S.listItem()
                    .title('Todos los posts')
                    .icon(() => '📄')
                    .child(
                      S.documentList()
                        .title('Todos los posts de la sección')
                        .filter(
                          '_type == "post" && section._ref == $sectionId'
                        )
                        .params({ sectionId })
                    ),

                  S.divider(),

                  // Subcategories of this section, each with its posts
                  S.listItem()
                    .title('Subcategorías')
                    .icon(() => '🏷️')
                    .child(
                      S.documentList()
                        .title('Subcategorías')
                        .filter(
                          '_type == "subcategory" && section._ref == $sectionId'
                        )
                        .params({ sectionId })
                        .child((subcategoryId) =>
                          S.documentList()
                            .title('Posts de la subcategoría')
                            .filter(
                              '_type == "post" && subcategory._ref == $subcategoryId'
                            )
                            .params({ subcategoryId })
                        )
                    ),
                ])
            )
        ),

      S.divider(),

      // ── All posts (flat, for quick search) ──
      S.listItem()
        .title('Todos los Posts')
        .icon(() => '📋')
        .child(
          S.documentTypeList('post').title('Todos los Posts')
        ),

      S.divider(),

      // ── Remaining types handled automatically ──
      ...S.documentTypeListItems().filter(
        (item) => !CUSTOM_TYPES.includes(item.getId() ?? '')
      ),
    ]);

export default defineConfig({
  name: 'almas-enraizadas',
  title: 'Almas Enraizadas',

  projectId: PROJECT_ID,
  dataset: DATASET,
  basePath: '/studio',

  plugins: [
    structureTool({ structure: buildStructure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
