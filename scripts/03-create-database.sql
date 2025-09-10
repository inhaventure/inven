-- Create users table with proper structure
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  university TEXT,
  major TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content table for managing page content
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT NOT NULL CHECK (page_type IN ('learning', 'galleries', 'media')),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  content_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR is_admin = true);

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND is_admin = true
    )
  );

-- Create policies for content table
CREATE POLICY "Anyone can view content" ON content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage content" ON content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND is_admin = true
    )
  );

-- Insert admin user
INSERT INTO users (email, password_hash, full_name, status, is_admin)
VALUES ('admin', '$2a$10$dummy.hash.for.admin.user', 'Administrator', 'approved', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample content
INSERT INTO content (page_type, title, description, image_url, link_url) VALUES
('learning', '창업 기초 과정', '창업의 기본기를 배우는 과정입니다', '/placeholder.svg?height=200&width=300', '#'),
('learning', '비즈니스 모델 설계', '성공적인 비즈니스 모델을 만드는 방법', '/placeholder.svg?height=200&width=300', '#'),
('galleries', '2024 데모데이', '학생들의 창업 아이디어 발표회', '/placeholder.svg?height=200&width=300', '#'),
('galleries', '창업 경진대회', '혁신적인 아이디어 경쟁', '/placeholder.svg?height=200&width=300', '#'),
('media', 'IVC 창립 소식', '인하 벤처 클럽이 새롭게 시작됩니다', '/placeholder.svg?height=200&width=300', '#'),
('media', '첫 번째 워크샵 개최', '창업 기초 워크샵이 성공적으로 진행되었습니다', '/placeholder.svg?height=200&width=300', '#')
ON CONFLICT DO NOTHING;
