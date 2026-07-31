-- Create indexes to optimize queries and count counts
CREATE INDEX IF NOT EXISTS idx_gm_submitted_by ON jks_3nf.grievance_master(submitted_by_user_id);
CREATE INDEX IF NOT EXISTS idx_gm_category_id ON jks_3nf.grievance_master(category_id);
CREATE INDEX IF NOT EXISTS idx_gm_created_at ON jks_3nf.grievance_master(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_au_assigned_by ON jks_3nf.assigned_users(assigned_by_user_id);
