CREATE TABLE cockpits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    bot_id INTEGER NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes
CREATE INDEX idx_cockpits_bot_id ON cockpits(bot_id);
CREATE INDEX idx_cockpits_deleted_at ON cockpits(deleted_at);

-- Create updated_at trigger
CREATE TRIGGER update_cockpits_updated_at
    BEFORE UPDATE ON cockpits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 