-- Fix the conversations SELECT policy - use explicit table references
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
CREATE POLICY "Users can view their conversations" 
ON public.conversations 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.conversation_participants cp
  WHERE cp.conversation_id = public.conversations.id 
  AND cp.user_id = auth.uid()
));

-- Fix conversation_participants SELECT policy with correct references
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view conversation participants" ON public.conversation_participants;
CREATE POLICY "Users can view participants in their conversations" 
ON public.conversation_participants 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.conversation_participants AS cp2 
  WHERE cp2.conversation_id = public.conversation_participants.conversation_id 
  AND cp2.user_id = auth.uid()
));

-- Fix profiles SELECT policy - ensure authenticated only
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.role() = 'authenticated');