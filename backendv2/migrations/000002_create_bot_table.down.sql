DROP TRIGGER IF EXISTS update_bots_updated_at ON bots;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP INDEX IF EXISTS idx_bots_admin_id;
DROP INDEX IF EXISTS idx_bots_deleted_at;
DROP TABLE IF EXISTS bots;