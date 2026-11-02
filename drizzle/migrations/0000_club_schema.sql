CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_users_select_self" ON public.admin_users FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid());
$$;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL CHECK (char_length(title_en) BETWEEN 2 AND 150),
  title_ar text CHECK (title_ar IS NULL OR char_length(title_ar) <= 150),
  description_en text CHECK (description_en IS NULL OR char_length(description_en) <= 4000),
  description_ar text CHECK (description_ar IS NULL OR char_length(description_ar) <= 4000),
  location_en text CHECK (location_en IS NULL OR char_length(location_en) <= 200),
  location_ar text CHECK (location_ar IS NULL OR char_length(location_ar) <= 200),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  capacity integer CHECK (capacity IS NULL OR capacity BETWEEN 1 AND 5000),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  registration_open boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR ends_at >= starts_at)
);
CREATE INDEX events_status_starts_idx ON public.events (status, starts_at);

CREATE TABLE public.sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  description_en text CHECK (description_en IS NULL OR char_length(description_en) <= 500),
  description_ar text CHECK (description_ar IS NULL OR char_length(description_ar) <= 500),
  logo_url text CHECK (logo_url IS NULL OR logo_url ~* '^https://[^\s]+$'),
  website_url text CHECK (website_url IS NULL OR website_url ~* '^https://[^\s]+$'),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE public.event_sponsors (
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  sponsor_id uuid NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, sponsor_id)
);

CREATE TABLE public.external_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label_en text NOT NULL CHECK (char_length(label_en) BETWEEN 1 AND 100),
  label_ar text CHECK (label_ar IS NULL OR char_length(label_ar) <= 100),
  url text NOT NULL CHECK (url ~* '^https://[^\s]+$'),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE public.site_content (
  key text PRIMARY KEY CHECK (key ~ '^[a-z_]{2,60}$'),
  value_en text NOT NULL DEFAULT '' CHECK (char_length(value_en) <= 4000),
  value_ar text NOT NULL DEFAULT '' CHECK (char_length(value_ar) <= 4000),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.membership_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254 AND email = lower(email) AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  university text NOT NULL CHECK (char_length(university) BETWEEN 2 AND 120),
  phone text CHECK (phone IS NULL OR phone ~ '^\+?[0-9 ()-]{6,25}$'),
  level text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_playing text CHECK (years_playing IS NULL OR years_playing IN ('under_1', '1_3', '3_5', 'over_5')),
  fide_rating integer CHECK (fide_rating IS NULL OR fide_rating BETWEEN 0 AND 3000),
  interests text CHECK (interests IS NULL OR char_length(interests) <= 300),
  message text CHECK (message IS NULL OR char_length(message) <= 1000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'accepted', 'rejected', 'waitlisted')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX membership_requests_created_idx ON public.membership_requests (created_at DESC);

CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE RESTRICT,
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254 AND email = lower(email) AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  university text NOT NULL CHECK (char_length(university) BETWEEN 2 AND 120),
  phone text CHECK (phone IS NULL OR phone ~ '^\+?[0-9 ()-]{6,25}$'),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlisted', 'cancelled')),
  notes text CHECK (notes IS NULL OR char_length(notes) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, email)
);
CREATE INDEX event_registrations_event_status_idx ON public.event_registrations (event_id, status);

CREATE TABLE public.rate_limits (
  bucket_key text PRIMARY KEY,
  window_start timestamptz NOT NULL,
  hits integer NOT NULL DEFAULT 0
);

-- Least-privilege grants
GRANT SELECT ON public.events, public.sponsors, public.event_sponsors, public.external_links, public.site_content TO anon;
GRANT SELECT ON public.events, public.sponsors, public.event_sponsors, public.external_links, public.site_content, public.membership_requests, public.event_registrations, public.admin_users TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events, public.sponsors, public.external_links, public.site_content TO authenticated;
GRANT INSERT, DELETE ON public.event_sponsors TO authenticated;
GRANT UPDATE (status) ON public.membership_requests TO authenticated;
GRANT DELETE ON public.membership_requests TO authenticated;
GRANT UPDATE (status, notes) ON public.event_registrations TO authenticated;
GRANT DELETE ON public.event_registrations TO authenticated;
GRANT ALL ON public.admin_users, public.events, public.sponsors, public.event_sponsors, public.external_links, public.site_content, public.membership_requests, public.event_registrations, public.rate_limits TO service_role;

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_public_read" ON public.events FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "events_admin_read" ON public.events FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "events_admin_insert" ON public.events FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "events_admin_update" ON public.events FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "events_admin_delete" ON public.events FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "sponsors_public_read" ON public.sponsors FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "sponsors_admin_read" ON public.sponsors FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "sponsors_admin_insert" ON public.sponsors FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "sponsors_admin_update" ON public.sponsors FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "sponsors_admin_delete" ON public.sponsors FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "event_sponsors_public_read" ON public.event_sponsors FOR SELECT TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_sponsors.event_id AND e.status = 'published'));
CREATE POLICY "event_sponsors_admin_read" ON public.event_sponsors FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "event_sponsors_admin_insert" ON public.event_sponsors FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "event_sponsors_admin_delete" ON public.event_sponsors FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "external_links_public_read" ON public.external_links FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "external_links_admin_read" ON public.external_links FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "external_links_admin_insert" ON public.external_links FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "external_links_admin_update" ON public.external_links FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "external_links_admin_delete" ON public.external_links FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "site_content_public_read" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "site_content_admin_insert" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "site_content_admin_update" ON public.site_content FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "site_content_admin_delete" ON public.site_content FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "membership_requests_admin_read" ON public.membership_requests FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "membership_requests_admin_update" ON public.membership_requests FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "membership_requests_admin_delete" ON public.membership_requests FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "event_registrations_admin_read" ON public.event_registrations FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "event_registrations_admin_update" ON public.event_registrations FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "event_registrations_admin_delete" ON public.event_registrations FOR DELETE TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.check_rate_limit(p_bucket text, p_max integer, p_window interval)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_ip text; v_hits integer;
BEGIN
  v_ip := COALESCE(btrim(split_part(NULLIF(current_setting('request.headers', true), '')::json->>'x-forwarded-for', ',', 1)), 'unknown');
  INSERT INTO rate_limits AS r (bucket_key, window_start, hits) VALUES (p_bucket || ':' || v_ip, now(), 1)
  ON CONFLICT (bucket_key) DO UPDATE SET
    window_start = CASE WHEN r.window_start < now() - p_window THEN now() ELSE r.window_start END,
    hits = CASE WHEN r.window_start < now() - p_window THEN 1 ELSE r.hits + 1 END
  RETURNING hits INTO v_hits;
  IF v_hits > p_max THEN RAISE EXCEPTION 'RATE_LIMITED'; END IF;
END; $$;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, integer, interval) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_membership_request(
  p_full_name text, p_email text, p_university text, p_phone text, p_level text,
  p_years_playing text, p_fide_rating integer, p_interests text, p_message text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM check_rate_limit('membership', 10, interval '10 minutes');
  INSERT INTO membership_requests (full_name, email, university, phone, level, years_playing, fide_rating, interests, message)
  VALUES (btrim(p_full_name), lower(btrim(p_email)), btrim(p_university),
    NULLIF(btrim(COALESCE(p_phone, '')), ''), p_level, NULLIF(btrim(COALESCE(p_years_playing, '')), ''),
    p_fide_rating, NULLIF(btrim(COALESCE(p_interests, '')), ''), NULLIF(btrim(COALESCE(p_message, '')), ''));
END; $$;

CREATE OR REPLACE FUNCTION public.register_for_event(p_event_id uuid, p_full_name text, p_email text, p_university text, p_phone text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_capacity integer; v_taken integer; v_status text;
BEGIN
  PERFORM check_rate_limit('event_register', 20, interval '10 minutes');
  SELECT capacity INTO v_capacity FROM events WHERE id = p_event_id AND status = 'published' AND registration_open FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'EVENT_UNAVAILABLE'; END IF;
  SELECT count(*) INTO v_taken FROM event_registrations WHERE event_id = p_event_id AND status = 'confirmed';
  v_status := CASE WHEN v_capacity IS NULL OR v_taken < v_capacity THEN 'confirmed' ELSE 'waitlisted' END;
  BEGIN
    INSERT INTO event_registrations (event_id, full_name, email, university, phone, status)
    VALUES (p_event_id, btrim(p_full_name), lower(btrim(p_email)), btrim(p_university), NULLIF(btrim(COALESCE(p_phone, '')), ''), v_status);
  EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'ALREADY_REGISTERED';
  END;
  RETURN v_status;
END; $$;

REVOKE EXECUTE ON FUNCTION public.submit_membership_request(text, text, text, text, text, text, integer, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_membership_request(text, text, text, text, text, text, integer, text, text) TO anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.register_for_event(uuid, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_for_event(uuid, text, text, text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_event_seat_counts()
RETURNS TABLE (event_id uuid, confirmed_count integer) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT e.id, COUNT(r.id)::integer FROM events e
  LEFT JOIN event_registrations r ON r.event_id = e.id AND r.status = 'confirmed'
  WHERE e.status = 'published' GROUP BY e.id;
$$;
REVOKE EXECUTE ON FUNCTION public.get_event_seat_counts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_event_seat_counts() TO anon, authenticated;

INSERT INTO public.site_content (key, value_en, value_ar) VALUES
  ('hero_title', '8squared Chess Club', 'نادي 8squared للشطرنج'),
  ('hero_subtitle', 'A home for chess players at every level. Learn, train, compete and grow with us.', 'بيت لعشاق الشطرنج من كل المستويات. تعلّم وتدرّب وتنافس واكبر معنا.'),
  ('about_body', 'Our club brings together students and chess lovers to train, play tournaments and build a strong community. We organise regular training sessions, weekend events and friendly matches for beginners and experts alike.', 'يجمع نادينا الطلاب وعشاق الشطرنج للتدريب والمشاركة في البطولات وبناء مجتمع قوي. ننظم جلسات تدريبية منتظمة وفعاليات نهاية الأسبوع ومباريات ودية للمبتدئين والخبراء.'),
  ('site_logo', '', '')
ON CONFLICT (key) DO NOTHING;