
DROP FUNCTION IF EXISTS public.admin_list_fans() CASCADE;
DROP FUNCTION IF EXISTS public.admin_sync_missing_fans() CASCADE;
DROP FUNCTION IF EXISTS public.register_fan(text, text, uuid, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.bootstrap_admin_if_empty() CASCADE;
DROP FUNCTION IF EXISTS public.sync_auth_user_membership(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.sync_current_user_membership() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DROP TABLE IF EXISTS public.fan_registrations CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role) CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;
