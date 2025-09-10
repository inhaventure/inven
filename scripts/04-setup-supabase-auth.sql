-- Enable RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table to store additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  university TEXT,
  major TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Create content table for managing page content
CREATE TABLE IF NOT EXISTS public.content (
  id SERIAL PRIMARY KEY,
  page_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on content table
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Create policies for content table
CREATE POLICY "Anyone can view content" ON public.content
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage content" ON public.content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Create admin user profile (this will be linked to a Supabase auth user)
-- Note: The actual auth user needs to be created through Supabase auth
INSERT INTO public.profiles (id, full_name, email, status, is_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000'::UUID, -- Placeholder UUID, will be updated
  'Admin User',
  'admin@ivc.com',
  'approved',
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- Insert sample content
INSERT INTO public.content (page_type, title, description, image_url, link_url) VALUES
('learning', 'React 기초', 'React의 기본 개념과 컴포넌트 작성법을 배워보세요', '/placeholder.svg?height=200&width=300', 'https://reactjs.org'),
('learning', 'Next.js 시작하기', 'Next.js로 풀스택 웹 애플리케이션을 만들어보세요', '/placeholder.svg?height=200&width=300', 'https://nextjs.org'),
('galleries', '2024 해커톤', '2024년 해커톤 우승작품들을 확인해보세요', '/placeholder.svg?height=200&width=300', '#'),
('galleries', '스타트업 피칭', '벤처클럽 멤버들의 스타트업 피칭 현장', '/placeholder.svg?height=200&width=300', '#'),
('media', 'IVC 창립 소식', '인하벤처클럽이 새롭게 출범했습니다', '/placeholder.svg?height=200&width=300', '#'),
('media', '해커톤 대회 개최', '제1회 IVC 해커톤 대회가 성황리에 마무리되었습니다', '/placeholder.svg?height=200&width=300', '#')
ON CONFLICT DO NOTHING;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, status, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    'pending',
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
