-- 기존 테이블과 트리거 정리
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Users 테이블 생성 (존재하지 않는 경우에만)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  UNIQUE(email)
);

-- RLS (Row Level Security) 정책 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 기존 정책들 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update user approval" ON public.users;
DROP POLICY IF EXISTS "Only approved users can access dashboard" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- 새로운 정책들 생성
-- 정책 1: 모든 사용자는 자신의 정보를 볼 수 있음
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- 정책 2: 관리자는 모든 사용자 정보를 볼 수 있음
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 정책 3: 관리자만 사용자 승인 상태를 업데이트할 수 있음
CREATE POLICY "Admins can update user approval" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 정책 4: 사용자는 자신의 프로필을 삽입할 수 있음 (회원가입 시)
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 사용자 생성 시 자동으로 users 테이블에 추가하는 함수 (개선된 버전)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, is_approved, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    FALSE,
    'member'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성: auth.users에 새 사용자가 추가될 때 실행
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 관리자 계정 생성 (테스트용)
-- 실제 관리자 이메일로 변경하세요
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data, is_super_admin, role)
VALUES (
  gen_random_uuid(),
  'admin@inhaventureclub.com',
  crypt('admin123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"name": "관리자"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- 관리자 사용자를 users 테이블에도 추가
INSERT INTO public.users (id, email, name, is_approved, role, approved_at)
SELECT 
  id,
  'admin@inhaventureclub.com',
  '관리자',
  true,
  'admin',
  NOW()
FROM auth.users 
WHERE email = 'admin@inhaventureclub.com'
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin', 
  is_approved = true,
  approved_at = NOW();
