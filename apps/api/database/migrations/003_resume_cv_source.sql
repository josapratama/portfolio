-- 003_resume_cv_source.sql
-- Add cv_source column to resume_settings to track which source is active

ALTER TABLE resume_settings
  ADD COLUMN IF NOT EXISTS cv_source VARCHAR(20) DEFAULT 'url';
