import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
export const unlockEditor = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({email:z.string().email(),password:z.string().min(1).max(256)})).handler(async({data,context})=>{
 const {data:eligible,error}=await context.supabase.rpc('is_editor_identity');
 if(error||!eligible||data.email.trim().toLowerCase()!==String(context.claims['email']??'').toLowerCase())return {ok:false};
 const url=process.env['SUPABASE_URL'];const key=process.env['SUPABASE_PUBLISHABLE_KEY'];if(!url||!key)throw Error('Auth unavailable');
 const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(key.startsWith('sb_')&&h.get('Authorization')===`Bearer ${key}`)h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
 const {data:verified,error:failed}=await client.auth.signInWithPassword(data);
 if(failed||verified.user?.id!==context.userId)return {ok:false};
 if(verified.session)await client.auth.signOut({scope:'local'});
 const sessionId=context.claims['session_id'];if(typeof sessionId!=='string'||!z.string().uuid().safeParse(sessionId).success)return {ok:false};
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {error:writeError}=await supabaseAdmin.from('editor_sessions').upsert({session_id:sessionId,user_id:context.userId,expires_at:new Date(Date.now()+30*60*1000).toISOString()});
 if(writeError)throw Error('Unable to unlock');return {ok:true};
});
export const lockEditor=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{const {data:eligible}=await context.supabase.rpc('is_editor_identity');if(!eligible)return {ok:true};const id=context.claims['session_id'];if(typeof id!=='string')return {ok:true};const {supabaseAdmin}=await import('@/integrations/supabase/client.server');const {error}=await supabaseAdmin.from('editor_sessions').delete().eq('session_id',id).eq('user_id',context.userId);if(error)throw Error('Unable to lock');return {ok:true};});
