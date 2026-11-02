<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Pages live in `src/pages` and are mounted by thin TanStack route files in `src/routes`; why: the app was migrated from a Bolt hash-router SPA and this keeps page code unchanged.
- Internal links are plain `<a href="/...">`; the root route intercepts same-site clicks for client-side navigation; why: avoids rewriting every link and dynamic nav array.
- Club data code imports `@/lib/supabase` (an untyped view of the Cloud client) and uses its own types in `@/types/club`; why: source was written for an untyped client.
- tsconfig keeps `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature` off; why: migrated code was written without them.
- Admin access = row in `public.admin_users` checked by `public.is_admin()` in RLS; visitor writes go only through SECURITY DEFINER RPCs (`submit_membership_request`, `register_for_event`).
- Theme colors are `--c-*` RGB triplets in `src/styles.css`, toggled via `data-theme`/`data-contrast`/`data-font` on `<html>`.
