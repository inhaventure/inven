-- Users 테이블 생성 (Supabase Auth와 연동)
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

-- 정책 4: 승인된 사용자만 대시보드 접근 가능
CREATE POLICY "Only approved users can access dashboard" ON public.users
  FOR SELECT USING (is_approved = true);

-- 사용자 생성 시 자동으로 users 테이블에 추가하는 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성: auth.users에 새 사용자가 추가될 때 실행
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 첫 번째 관리자 계정 설정 (이메일을 실제 관리자 이메일로 변경하세요)
-- INSERT INTO public.users (id, email, name, is_approved, role, approved_at)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'admin@inhaventureclub.com' LIMIT 1),
--   'admin@inhaventureclub.com',
--   'Admin',
--   true,
--   'admin',
--   NOW()
-- ) ON CONFLICT (id) DO UPDATE SET role = 'admin', is_approved = true;
