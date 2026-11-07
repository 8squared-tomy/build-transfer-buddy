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
- Admin reads use protected `user_roles`; `is_admin()` requires editor eligibility plus a short-lived server-created grant bound to the Auth session ID, so read-only sessions cannot write even through direct API calls. Legacy admin_users is retained for compatibility, not authorization.
- Theme colors are `--c-*` RGB triplets in `src/styles.css`, toggled via `data-theme`/`data-contrast`/`data-font` on `<html>`.
- Fonts are served through bundled Fontsource CSS and the homepage cover through a project asset pointer preloaded only on the home route; why: avoid external render-blocking font services and make the first image discoverable early.
- Event accommodation is validated by a shared registration schema and a database trigger; the extended registration RPC retains a legacy wrapper so older clients keep working.
- Configurable forms use validated field definitions and revision snapshots on submissions; public writes use the rate-limited submit_club_form RPC, preserving legacy intake records for exports.
- Member portraits live in a private Storage bucket with public read policies and fresh signed URLs, so workspace public-bucket restrictions do not prevent intended public portraits from rendering.
- Navigation and accessibility share a Radix side sheet; the root layout owns the only page frame, including not-found rendering, to prevent duplicate headers.
