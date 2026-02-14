/**
 * AI generation API route.
 * Proxies requests to OpenAI for the Sanity Studio AI assistant.
 * Supports: summary, excerpt, seoTitle, readingTime actions.
 */
import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';
const MAX_INPUT_LENGTH = 15_000;

type AiAction = 'summary' | 'excerpt' | 'seoTitle' | 'readingTime' | 'bodyContent';

interface AiRequestBody {
  action: AiAction;
  title?: string;
  body?: string;
}

/** System prompts for each action */
const SYSTEM_PROMPTS: Record<AiAction, string> = {
  summary: [
    'Eres un asistente editorial para un blog de bienestar, yoga y aromaterapia en español.',
    'Genera un resumen claro y conciso del artículo proporcionado.',
    'El resumen debe tener entre 2 y 4 oraciones.',
    'Usa un tono cálido, natural y profesional.',
    'Responde SOLO con el resumen, sin encabezados ni explicaciones adicionales.',
  ].join(' '),

  excerpt: [
    'Eres un asistente editorial para un blog de bienestar en español.',
    'Genera un extracto atractivo del artículo proporcionado.',
    'El extracto debe tener máximo 180 caracteres.',
    'Debe enganchar al lector y resumir la idea principal.',
    'Responde SOLO con el extracto, sin comillas ni explicaciones.',
  ].join(' '),

  seoTitle: [
    'Eres un experto SEO para un blog de bienestar, yoga y aromaterapia en español.',
    'Dado el título actual de un artículo, genera 3 variantes optimizadas para SEO.',
    'Cada variante debe ser atractiva, contener palabras clave relevantes y tener máximo 60 caracteres.',
    'Responde con las 3 opciones numeradas (1. 2. 3.), sin explicaciones.',
  ].join(' '),

  readingTime: [
    'Calcula el tiempo de lectura aproximado del siguiente texto.',
    'Usa una velocidad de 200 palabras por minuto.',
    'Responde SOLO con el número entero de minutos, nada más.',
  ].join(' '),

  bodyContent: [
    'Eres un redactor editorial experto para "Almas Enraizadas", un blog premium de bienestar, yoga, aromaterapia, mindfulness y crecimiento personal en español.',
    '',
    'MISIÓN: Escribe un artículo completo, profundo y bien investigado basado en el título proporcionado.',
    '',
    'ESTRUCTURA OBLIGATORIA (1000-1500 palabras):',
    '1. Párrafo de apertura enganchador que conecte emocionalmente con el lector.',
    '2. Entre 4 y 6 secciones con subtítulos ## (H2).',
    '3. Dentro de las secciones, usa subsecciones ### (H3) cuando el tema lo requiera.',
    '4. Un cierre inspirador con llamada a la acción suave.',
    '',
    'FORMATO MARKDOWN QUE DEBES USAR:',
    '- ## para títulos de sección (H2)',
    '- ### para subsecciones (H3)',
    '- **texto** para negritas (conceptos clave, datos importantes)',
    '- *texto* para cursivas (términos en otros idiomas, énfasis sutil, nombres científicos)',
    '- > para citas textuales, frases inspiradoras o reflexiones destacadas (úsalas 2-3 veces)',
    '- Líneas que empiezan con - son listas con viñetas (usa para tips, beneficios, ingredientes)',
    '- Líneas que empiezan con 1. 2. 3. son listas numeradas (usa para pasos o rutinas)',
    '- Separa cada párrafo con una línea en blanco.',
    '- NO uses # (H1), solo ## y ###.',
    '',
    'ELEMENTOS QUE ENRIQUECEN EL ARTÍCULO:',
    '- Incluye al menos una cita inspiradora de un filósofo, maestro espiritual o experto en bienestar entre comillas con > (blockquote).',
    '- Usa datos concretos, porcentajes o referencias a estudios cuando sea posible (ej: "Según un estudio de la Universidad de Harvard...").',
    '- Incluye al menos una lista de tips prácticos que el lector pueda aplicar hoy.',
    '- Si el tema lo permite, incluye una mini-rutina o paso a paso con lista numerada.',
    '- Usa **negritas** para destacar los 3-5 conceptos más importantes del artículo.',
    '- Usa *cursivas* para nombres en sánscrito, latín o inglés, y para énfasis emocional.',
    '',
    'TONO Y VOZ:',
    '- Cálido, cercano pero profesional. Como hablar con un amigo que sabe del tema.',
    '- Empoderador: el lector debe sentirse capaz de aplicar lo aprendido.',
    '- Sensorial: usa descripciones que evoquen aromas, texturas, sensaciones.',
    '- Inclusivo: habla en segunda persona (tú) o primera persona plural (nosotros).',
    '',
    'Responde SOLO con el artículo. Sin comentarios meta, sin "aquí tienes", sin explicaciones.',
  ].join('\n'),
};

/** Build user message for each action */
const buildUserMessage = (action: AiAction, title: string, body: string): string => {
  const truncatedBody = body.slice(0, MAX_INPUT_LENGTH);

  const messages: Record<AiAction, string> = {
    summary: `Título: ${title}\n\nContenido:\n${truncatedBody}`,
    excerpt: `Título: ${title}\n\nContenido:\n${truncatedBody}`,
    seoTitle: `Título actual: ${title}`,
    readingTime: truncatedBody,
    bodyContent: `Título del artículo: ${title}`,
  };

  return messages[action];
};

/** Actions that only require a title (no body content) */
const TITLE_ONLY_ACTIONS: AiAction[] = ['seoTitle', 'bodyContent'];

/** Validate request body */
const validateRequest = (body: AiRequestBody): string | null => {
  const validActions: AiAction[] = ['summary', 'excerpt', 'seoTitle', 'readingTime', 'bodyContent'];

  if (!validActions.includes(body.action)) {
    return `Invalid action. Must be one of: ${validActions.join(', ')}`;
  }

  if (TITLE_ONLY_ACTIONS.includes(body.action) && !body.title) {
    return 'Title is required for this action';
  }

  if (!TITLE_ONLY_ACTIONS.includes(body.action) && !body.body) {
    return 'Body content is required for this action';
  }

  return null;
};

/** Call OpenAI API using native fetch */
const callOpenAI = async (systemPrompt: string, userMessage: string): Promise<string> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `OpenAI API error (${response.status}): ${errorData?.error?.message ?? 'Unknown error'}`
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
};

export async function POST(request: NextRequest) {
  try {
    const body: AiRequestBody = await request.json();
    const validationError = validateRequest(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const systemPrompt = SYSTEM_PROMPTS[body.action];
    const userMessage = buildUserMessage(body.action, body.title ?? '', body.body ?? '');
    const result = await callOpenAI(systemPrompt, userMessage);

    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('not configured') ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
