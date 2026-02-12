/**
 * Renders JSON-LD structured data for SEO.
 * Server component for Almas Enraizadas wellness blog.
 */

interface RichSchemaProps {
  data: Record<string, unknown>;
}

const RichSchema = ({ data }: RichSchemaProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export default RichSchema;
