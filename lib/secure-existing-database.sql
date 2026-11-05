-- Run ONCE in the Supabase SQL Editor, after creating your single login under
-- Authentication → Users. It moves the existing rows to that login and removes
-- public access. The whole script rolls back if anything fails.

begin;

do $$
declare
  owner_id uuid;
  user_count int;
  old_id constant text := 'user_eck7nqfzk5v';
  t text;
  p record;
begin
  select count(*) into user_count from auth.users;
  if user_count <> 1 then
    raise exception 'Expected exactly 1 user in Authentication, found %', user_count;
  end if;
  select id into owner_id from auth.users;

  foreach t in array array['habit_logs','sleep_logs','weight_logs','meal_logs','user_profile'] loop
    execute format('update %I set user_id = $1 where user_id = $2', t) using owner_id::text, old_id;

    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on %I', p.policyname, t);
    end loop;

    execute format('alter table %I enable row level security', t);
    execute format('revoke all on table %I from anon', t);
    execute format(
      'create policy "owner only" on %I for all to authenticated
         using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text)', t);
  end loop;
end $$;

commit;
