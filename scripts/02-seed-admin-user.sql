-- Insert admin user (this will be linked to Supabase auth)
-- Note: The admin user will be created through Supabase auth, this is just for reference
INSERT INTO users (email, name, role, status) 
VALUES ('admin@inhavclub.com', 'Admin User', 'admin', 'approved')
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  status = 'approved';

-- Insert sample content for each page type
INSERT INTO content (page_type, title, description, image_url, content_data) VALUES
('learning', 'Startup Fundamentals', 'Learn the basics of starting a business', '/placeholder.svg?height=200&width=300', '{"category": "business", "duration": "2 hours"}'),
('learning', 'Market Research', 'How to research your target market', '/placeholder.svg?height=200&width=300', '{"category": "research", "duration": "1.5 hours"}'),
('galleries', 'Demo Day 2024', 'Our annual startup showcase event', '/placeholder.svg?height=200&width=300', '{"event_date": "2024-12-15", "location": "Inha University"}'),
('galleries', 'Workshop Series', 'Monthly entrepreneurship workshops', '/placeholder.svg?height=200&width=300', '{"frequency": "monthly", "participants": 50}'),
('media', 'Inha Venture Club Launches New Program', 'We are excited to announce our new startup incubation program for students.', '/placeholder.svg?height=200&width=300', '{"publish_date": "2024-01-15", "author": "IVC Team"}'),
('media', 'Student Startup Wins National Competition', 'One of our member startups has won the national entrepreneurship competition.', '/placeholder.svg?height=200&width=300', '{"publish_date": "2024-02-20", "author": "IVC Team"}')
ON CONFLICT DO NOTHING;
