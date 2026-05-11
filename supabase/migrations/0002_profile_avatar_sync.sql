-- 0002_profile_avatar_sync.sql
-- Estratégia "Opção C": NUNCA copiar o avatar do Google.
-- O usuário começa com o fallback de iniciais e troca a foto pelo
-- upload em /perfil (que grava no Supabase Storage).
--
-- Por quê: URLs lh3.googleusercontent.com às vezes são hotlink-restricted
-- ou expiram, então salvar a URL externa no banco gera imagens quebradas.
-- Melhor manter o controle: foto vive na Supabase Storage do projeto.
--
-- O trigger ainda copia display_name e full_name do raw_user_meta_data,
-- mas NÃO popula avatar_url. Backfill: limpa avatar_url null/quebrados
-- e sincroniza display_name onde estiver vazio.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      ''
    ),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      ''
    )
  );
  -- avatar_url propositalmente null. O usuário faz upload via /perfil.
  return new;
end;
$$;

-- Limpa avatares do Google que estão salvos e quebrando.
-- Mantém uploads próprios (que ficam no domínio supabase.co).
update public.profiles
set avatar_url = null
where avatar_url is not null
  and (
    avatar_url like '%googleusercontent.com%'
    or avatar_url like '%lh3.google%'
    or avatar_url like '%lh4.google%'
    or avatar_url like '%lh5.google%'
    or avatar_url like '%lh6.google%'
  );

-- Backfill de display_name e full_name onde estiverem vazios.
update public.profiles p
set
  display_name = coalesce(
    nullif(p.display_name, ''),
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name'
  ),
  full_name = coalesce(
    nullif(p.full_name, ''),
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    p.full_name
  )
from auth.users u
where p.id = u.id
  and (
    p.display_name is null
    or p.display_name = ''
    or p.full_name is null
    or p.full_name = ''
  );
