-- Käyttäjä-sessiot (for anonymous sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Korttisetti (flashcard set)
CREATE TABLE IF NOT EXISTS card_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('flashcard', 'multiple_choice')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flashcard-kortit
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_set_id UUID NOT NULL REFERENCES card_sets(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty INT DEFAULT 1,
  background_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Monivalinta-kortit
CREATE TABLE IF NOT EXISTS multiple_choice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_set_id UUID NOT NULL REFERENCES card_sets(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  explanation TEXT,
  difficulty INT DEFAULT 1,
  background_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API-avainten salaus (tallennetaan hash-muodossa)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  encrypted_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE multiple_choice ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read sessions
CREATE POLICY "sessions_read" ON sessions
  FOR SELECT USING (true);

-- Policy: Sessions can only be created
CREATE POLICY "sessions_create" ON sessions
  FOR INSERT WITH CHECK (true);

-- Policy: Card sets can be read by anyone (shared within app)
CREATE POLICY "card_sets_read" ON card_sets
  FOR SELECT USING (true);

-- Policy: Card sets can be created
CREATE POLICY "card_sets_create" ON card_sets
  FOR INSERT WITH CHECK (true);

-- Policy: Card sets can be updated by creator
CREATE POLICY "card_sets_update" ON card_sets
  FOR UPDATE USING (true);

-- Policy: Card sets can be deleted by creator
CREATE POLICY "card_sets_delete" ON card_sets
  FOR DELETE USING (true);

-- Policy: Flashcards can be read
CREATE POLICY "flashcards_read" ON flashcards
  FOR SELECT USING (true);

-- Policy: Flashcards can be created
CREATE POLICY "flashcards_create" ON flashcards
  FOR INSERT WITH CHECK (true);

-- Policy: Flashcards can be deleted
CREATE POLICY "flashcards_delete" ON flashcards
  FOR DELETE USING (true);

-- Policy: Multiple choice can be read
CREATE POLICY "multiple_choice_read" ON multiple_choice
  FOR SELECT USING (true);

-- Policy: Multiple choice can be created
CREATE POLICY "multiple_choice_create" ON multiple_choice
  FOR INSERT WITH CHECK (true);

-- Policy: Multiple choice can be deleted
CREATE POLICY "multiple_choice_delete" ON multiple_choice
  FOR DELETE USING (true);

-- Policy: API keys can be read by owner
CREATE POLICY "api_keys_read" ON api_keys
  FOR SELECT USING (true);

-- Policy: API keys can be created
CREATE POLICY "api_keys_create" ON api_keys
  FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_card_sets_session_id ON card_sets(session_id);
CREATE INDEX idx_flashcards_card_set_id ON flashcards(card_set_id);
CREATE INDEX idx_multiple_choice_card_set_id ON multiple_choice(card_set_id);
CREATE INDEX idx_api_keys_session_id ON api_keys(session_id);
