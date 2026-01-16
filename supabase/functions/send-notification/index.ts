import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS - prevents CSRF attacks
const allowedOrigins = [
  'https://adnivio-growth-hub.lovable.app',
  'https://id-preview--8060a8a2-edc1-4e3e-a4a8-36b831cb0c29.lovable.app',
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
};

interface NotificationRequest {
  user_id: string;
  type: 'message' | 'campaign' | 'conversion' | 'wallet' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Verify authentication - this function should only be called by authenticated users or service role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Check if it's service role key (for internal calls from other edge functions)
    const isServiceRole = token === supabaseServiceKey;
    
    let callerId: string | null = null;
    
    if (!isServiceRole) {
      // Validate user JWT
      const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      });
      
      const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
      if (claimsError || !claimsData?.claims) {
        return new Response(JSON.stringify({ error: 'Invalid authentication token' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      callerId = claimsData.claims.sub as string;
    }
    
    // Create admin client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { user_id, type, title, message, data } = await req.json() as NotificationRequest;

    // Validate required fields
    if (!user_id || !type || !title || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate input lengths to prevent abuse
    if (title.length > 200 || message.length > 2000) {
      return new Response(JSON.stringify({ error: 'Title or message too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Authorization: If not service role, users can only send notifications to themselves
    // (unless we add admin role check in the future)
    if (!isServiceRole && callerId !== user_id) {
      return new Response(JSON.stringify({ error: 'Cannot send notifications to other users' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Sending notification to user ${user_id}: ${title} (caller: ${isServiceRole ? 'service_role' : callerId})`);

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id,
        type,
        title,
        message,
        data: data || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }

    console.log('Notification created:', notification.id);

    return new Response(JSON.stringify({ success: true, notification }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const origin = req.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in send-notification function:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
