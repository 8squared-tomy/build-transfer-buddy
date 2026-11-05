import { supabase } from '@/lib/supabase';
export type ClubMember={id:string;name:string;club_role:string;photo_url:string|null;sort_order:number;is_active:boolean};
export type SocialLink={id:string;platform:string|null;url:string;is_active:boolean};
export async function fetchMembers():Promise<ClubMember[]> {const {data,error}=await supabase.from('club_members').select('*').eq('is_active',true).order('sort_order');if(error)throw error;return data??[];}
export async function fetchSocialLinks():Promise<SocialLink[]> {const {data,error}=await supabase.from('external_links').select('id,platform,url,is_active').in('platform',['linkedin','instagram','telegram']).eq('is_active',true);if(error)throw error;return data??[];}
export const EDITOR_EMAILS=['ivan07.hcj@gmail.com','mohammed.yahiaoui@nhsm.edu.dz'] as const;
export function allowedEditor(email:string){return EDITOR_EMAILS.some(e=>e===email.trim().toLowerCase());}
