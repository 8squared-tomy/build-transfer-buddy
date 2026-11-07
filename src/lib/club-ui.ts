import { supabase } from '@/lib/supabase';
export type ClubMember={id:string;name:string;club_role:string;photo_url:string|null;sort_order:number;is_active:boolean};
export type SocialLink={id:string;platform:string|null;url:string;is_active:boolean};
export async function resolveMemberPhoto(member:ClubMember):Promise<ClubMember> {if(!member.photo_url||member.photo_url.startsWith('https://'))return member;const {data,error}=await supabase.storage.from('member-portraits').createSignedUrl(member.photo_url,3600);return {...member,photo_url:error?null:data?.signedUrl??null};}
export async function fetchMembers():Promise<ClubMember[]> {const {data,error}=await supabase.from('club_members').select('*').eq('is_active',true).order('sort_order');if(error)throw error;return Promise.all((data??[]).map(resolveMemberPhoto));}
export async function fetchSocialLinks():Promise<SocialLink[]> {const {data,error}=await supabase.from('external_links').select('id,platform,url,is_active').in('platform',['linkedin','instagram','telegram']).eq('is_active',true);if(error)throw error;return data??[];}
export const EDITOR_EMAILS=['ivan07.hcj@gmail.com','mohammed.yahiaoui@nhsm.edu.dz'] as const;
export function allowedEditor(email:string){return EDITOR_EMAILS.some(e=>e===email.trim().toLowerCase());}
