ALTER TABLE public.event_registrations ADD COLUMN needs_accommodation boolean NOT NULL DEFAULT false, ADD COLUMN residence text, ADD COLUMN bac_registration_number text;

CREATE OR REPLACE FUNCTION public.validate_event_accommodation() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.needs_accommodation THEN
    NEW.residence := btrim(NEW.residence);
    NEW.bac_registration_number := btrim(NEW.bac_registration_number);
    NEW.phone := btrim(NEW.phone);
    IF NEW.residence IS NULL OR length(NEW.residence) NOT BETWEEN 2 AND 120 THEN RAISE EXCEPTION 'INVALID_RESIDENCE'; END IF;
    IF NEW.bac_registration_number IS NULL OR NEW.bac_registration_number !~ '^[0-9]{1,30}$' THEN RAISE EXCEPTION 'INVALID_BAC_NUMBER'; END IF;
    IF NEW.phone IS NULL OR NEW.phone !~ '^\+?[0-9 ()-]{6,25}$' THEN RAISE EXCEPTION 'INVALID_ACCOMMODATION_PHONE'; END IF;
  ELSE
    NEW.residence := NULL;
    NEW.bac_registration_number := NULL;
    NEW.phone := NULL;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER event_accommodation_validation BEFORE INSERT OR UPDATE OF needs_accommodation, residence, bac_registration_number, phone ON public.event_registrations FOR EACH ROW EXECUTE FUNCTION public.validate_event_accommodation();

CREATE OR REPLACE FUNCTION public.register_for_event(p_event_id uuid, p_full_name text, p_email text, p_university text, p_phone text, p_needs_accommodation boolean, p_residence text, p_bac_registration_number text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_capacity integer; v_taken integer; v_status text;
BEGIN
  IF p_full_name IS NULL OR length(btrim(p_full_name)) NOT BETWEEN 2 AND 100 OR p_university IS NULL OR length(btrim(p_university)) NOT BETWEEN 2 AND 120 OR p_email IS NULL OR length(btrim(p_email)) NOT BETWEEN 5 AND 254 OR btrim(p_email) !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR p_needs_accommodation IS NULL THEN RAISE EXCEPTION 'INVALID_REGISTRATION'; END IF;
  PERFORM check_rate_limit('event_register', 20, interval '10 minutes');
  SELECT capacity INTO v_capacity FROM events WHERE id = p_event_id AND status = 'published' AND registration_open FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'EVENT_UNAVAILABLE'; END IF;
  SELECT count(*) INTO v_taken FROM event_registrations WHERE event_id = p_event_id AND status = 'confirmed';
  v_status := CASE WHEN v_capacity IS NULL OR v_taken < v_capacity THEN 'confirmed' ELSE 'waitlisted' END;
  BEGIN
    INSERT INTO event_registrations (event_id, full_name, email, university, phone, status, needs_accommodation, residence, bac_registration_number)
    VALUES (p_event_id, btrim(p_full_name), lower(btrim(p_email)), btrim(p_university), p_phone, v_status, p_needs_accommodation, p_residence, p_bac_registration_number);
  EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'ALREADY_REGISTERED';
  END;
  RETURN v_status;
END;
$$;
REVOKE ALL ON FUNCTION public.register_for_event(uuid,text,text,text,text,boolean,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_for_event(uuid,text,text,text,text,boolean,text,text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.register_for_event(p_event_id uuid, p_full_name text, p_email text, p_university text, p_phone text)
RETURNS text LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT public.register_for_event(p_event_id,p_full_name,p_email,p_university,p_phone,false,NULL::text,NULL::text);
$$;