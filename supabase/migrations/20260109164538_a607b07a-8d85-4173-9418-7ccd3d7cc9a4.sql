
-- Allow users to view all profiles for messaging/discovery
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);

-- Add unique constraint on user_id + conversation_id for participants
ALTER TABLE public.conversation_participants ADD CONSTRAINT unique_participant UNIQUE (conversation_id, user_id);
