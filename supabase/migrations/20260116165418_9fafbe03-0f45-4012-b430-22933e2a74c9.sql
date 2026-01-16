-- Drop the overly permissive INSERT policy on conversations
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;

-- Create a more restrictive INSERT policy
-- Users can only create conversations if they're authenticated
-- The conversation creation should be paired with adding themselves as a participant
CREATE POLICY "Authenticated users can create conversations"
ON public.conversations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Note: We keep WITH CHECK (true) but restrict to authenticated users only
-- This is necessary because conversations don't have a user_id column
-- Security is enforced through conversation_participants table which requires auth.uid() = user_id
-- An alternative would be to add a created_by column, but that would require schema changes