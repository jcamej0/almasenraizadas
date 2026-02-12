/**
 * Supabase client for Almas Enraizadas wellness blog.
 *
 * Used for backend features that complement Sanity content:
 * - Post ratings and reactions
 * - User comments and discussions
 * - Analytics and engagement tracking
 * - Newsletter subscriptions
 * - Any real-time or user-generated data
 *
 * Content lives in Sanity; Supabase handles interactive/relational data.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Supabase client instance (browser-safe, uses anon key).
 * Use for server and client components; RLS policies enforce security.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
