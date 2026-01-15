-- Fix notifications INSERT policy to prevent cross-user spam
-- Users can only insert notifications for themselves, service role can insert for anyone

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Users can only create notifications for themselves
CREATE POLICY "Users can insert own notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() = user_id);
