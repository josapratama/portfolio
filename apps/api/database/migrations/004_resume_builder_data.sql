-- 004_resume_builder_data.sql
-- Store CV Builder configuration in resume_settings

ALTER TABLE resume_settings
  ADD COLUMN IF NOT EXISTS cv_template VARCHAR(50) DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS cv_page_size VARCHAR(10) DEFAULT 'A4',
  ADD COLUMN IF NOT EXISTS cv_builder_data JSONB DEFAULT '{}'::jsonb;
