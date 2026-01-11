-- Fix 1: Update profiles SELECT policy to require authentication
-- This prevents public exposure of user email addresses
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Fix 2: Fix conversations RLS policy - correct the table reference
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
CREATE POLICY "Users can view their conversations" 
ON public.conversations 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.conversation_participants 
  WHERE conversation_participants.conversation_id = conversations.id 
  AND conversation_participants.user_id = auth.uid()
));

-- Fix 3: Fix conversation_participants RLS policy - correct the table reference
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON public.conversation_participants;
CREATE POLICY "Users can view participants in their conversations" 
ON public.conversation_participants 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.conversation_participants AS cp 
  WHERE cp.conversation_id = conversation_participants.conversation_id 
  AND cp.user_id = auth.uid()
));