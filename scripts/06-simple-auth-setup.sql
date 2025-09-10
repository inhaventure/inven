-- Enable RLS
alter table if exists public.profiles enable row level security;

-- Create profiles table for additional user info
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  university text,
  major text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for all using (
  exists (
    select 1 from profiles 
    where id = auth.uid() and is_admin = true
  )
);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create admin user (you'll need to sign up with this email first)
-- Then run: update profiles set is_admin = true where id = (select id from auth.users where email = 'admin@example.com');
