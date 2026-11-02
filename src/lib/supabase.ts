import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as cloudClient } from '@/integrations/supabase/client';

// Club code was written against an untyped client; keep its own row types in @/types/club.
export const supabase = cloudClient as unknown as SupabaseClient;
