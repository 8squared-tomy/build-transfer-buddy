import { supabase } from '@/lib/supabase';

export async function signInAdmin(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  if (error) throw error;
}

export async function signOutAdmin(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const session = await getCurrentSession();
  if (!session?.user.email) return false;
  const { error } = await supabase.auth.signInWithPassword({ email: session.user.email, password });
  return !error;
}

export async function updateAdminCredentials(attributes: { email?: string; password?: string; current_password?: string }): Promise<void> {
  const { error } = await supabase.auth.updateUser(attributes);
  if (error) throw error;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('can_read_admin');
  if (error) throw error;
  return data === true;
}
