/**
 * Supabase RLS (Row Level Security) Policies
 * Database-level access control for all tables
 *
 * To enable, run these SQL queries in Supabase SQL editor
 */

// ============================================
// 1. USERS / PROFILES TABLE
// ============================================

`
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin can read all profiles
CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
`;

// ============================================
// 2. JOURNAL ENTRIES TABLE
// ============================================

`
-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Users can only see their own entries
CREATE POLICY "Users can view own journal entries" ON journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create entries
CREATE POLICY "Authenticated users can create journal entries" ON journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own entries
CREATE POLICY "Users can update own journal entries" ON journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own entries
CREATE POLICY "Users can delete own journal entries" ON journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Soft delete: prevent re-deletion
CREATE POLICY "Prevent delete of soft-deleted entries" ON journal_entries
  FOR DELETE
  USING (auth.uid() = user_id AND deleted_at IS NULL);
`;

// ============================================
// 3. MOOD TRACKING TABLE
// ============================================

`
-- Enable RLS
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Users can only see their own mood entries
CREATE POLICY "Users can view own mood entries" ON mood_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create mood entries
CREATE POLICY "Authenticated users can create mood entries" ON mood_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own entries (within 1 hour)
CREATE POLICY "Users can update own mood entries" ON mood_entries
  FOR UPDATE
  USING (
    auth.uid() = user_id AND
    created_at > now() - interval '1 hour'
  );

-- Users can delete their own entries
CREATE POLICY "Users can delete own mood entries" ON mood_entries
  FOR DELETE
  USING (auth.uid() = user_id);
`;

// ============================================
// 4. CHAT MESSAGES TABLE
// ============================================

`
-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all public messages
CREATE POLICY "Users can read public chat" ON chat_messages
  FOR SELECT
  USING (
    room_id IS NULL AND is_public = true
  );

-- Users can read their own private messages
CREATE POLICY "Users can read own private messages" ON chat_messages
  FOR SELECT
  USING (
    is_public = false AND (
      user_id = auth.uid() OR
      recipient_id = auth.uid()
    )
  );

-- Users can only post their own messages
CREATE POLICY "Users can create own messages" ON chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own messages (within 5 minutes)
CREATE POLICY "Users can edit own messages" ON chat_messages
  FOR UPDATE
  USING (
    auth.uid() = user_id AND
    created_at > now() - interval '5 minutes'
  );

-- Users can only delete their own messages (within 15 minutes)
CREATE POLICY "Users can delete own messages" ON chat_messages
  FOR DELETE
  USING (
    auth.uid() = user_id AND
    created_at > now() - interval '15 minutes'
  );
`;

// ============================================
// 5. REWARDS / ACHIEVEMENTS TABLE
// ============================================

`
-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Users can only see their own achievements
CREATE POLICY "Users can view own achievements" ON achievements
  FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert achievements
CREATE POLICY "System can create achievements" ON achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id); -- Enforced by backend logic

-- Achievements are immutable (no update/delete)
`;

// ============================================
// 6. THERAPIST DIRECTORY TABLE
// ============================================

`
-- Enable RLS
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view therapist directory
CREATE POLICY "Users can view therapist directory" ON therapists
  FOR SELECT
  USING (true); -- Public read

-- Only admins can manage therapists
CREATE POLICY "Admin can manage therapists" ON therapists
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
`;

// ============================================
// 7. AUDIT LOG TABLE (for sensitive actions)
// ============================================

`
-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view logs related to them
CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- System can create logs
CREATE POLICY "System can create audit logs" ON audit_logs
  FOR INSERT
  WITH CHECK (true);

-- No one can delete or modify audit logs
`;

// ============================================
// VERIFICATION QUERIES
// ============================================

`
-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true;

-- Check RLS policies
SELECT tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
`;

export default {
  note: 'Copy and paste each SQL block into Supabase SQL Editor to enforce security policies',
};
