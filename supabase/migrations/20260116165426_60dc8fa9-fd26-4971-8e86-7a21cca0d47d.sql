-- Add created_by column to track conversation creator
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Drop the current INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;

-- Create a proper INSERT policy that validates ownership
CREATE POLICY "Users can create their own conversations"
ON public.conversations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);