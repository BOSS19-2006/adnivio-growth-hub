import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketingRequest {
  type: 'product_description' | 'ad_copy' | 'campaign_suggestion' | 'chat';
  data: {
    productName?: string;
    productCategory?: string;
    productFeatures?: string;
    productPrice?: string;
    productImage?: string;
    serviceName?: string;
    serviceType?: string;
    targetAudience?: string;
    salesGoal?: string;
    budget?: string;
    message?: string;
    conversationHistory?: Array<{ role: string; content: string }>;
    userType?: 'product' | 'service';
  };
}

const getSystemPrompt = (type: string, userType?: string) => {
  const baseContext = userType === 'service' 
    ? 'You are an AI Marketing Assistant for Adnivio, specializing in helping service providers (freelancers, agencies, local businesses) grow their client base.'
    : 'You are an AI Marketing Assistant for Adnivio, specializing in helping product sellers (SMEs selling physical goods) increase sales and visibility.';

  switch (type) {
    case 'product_description':
      return `${baseContext}

Your task is to generate compelling product descriptions that:
1. Highlight key benefits and features
2. Use persuasive language that converts
3. Include relevant SEO keywords
4. Create emotional connection with the target audience
5. Be concise yet informative (150-200 words)

Format your response as:
**Title:** [Catchy product title]
**Description:** [Main description]
**Key Features:** [Bullet points]
**SEO Tags:** [Comma-separated tags]`;

    case 'ad_copy':
      return `${baseContext}

Your task is to create high-converting ad copy for social media platforms (Meta, Google, YouTube). Generate:
1. Attention-grabbing headlines (max 30 characters)
2. Compelling primary text (max 125 characters)
3. Strong call-to-action
4. Multiple variations for A/B testing

Format your response as:
**Headline Options:**
1. [Headline 1]
2. [Headline 2]
3. [Headline 3]

**Ad Copy Variations:**
**Version A:** [Copy]
**Version B:** [Copy]

**Recommended CTAs:**
- [CTA 1]
- [CTA 2]`;

    case 'campaign_suggestion':
      return `${baseContext}

Your task is to suggest optimized marketing campaign strategies. Consider:
1. Target audience segmentation
2. Budget allocation across platforms
3. Campaign duration and timing
4. Expected ROI projections
5. Key performance metrics to track

Format your response as:
**Campaign Strategy:**
**Target Audience:** [Demographics, interests]
**Platform Mix:** [Platform recommendations with budget split]
**Timeline:** [Recommended duration]
**Budget Breakdown:** [Allocation details]
**Expected Results:** [Projected metrics]
**Optimization Tips:** [Key recommendations]`;

    case 'chat':
    default:
      return `${baseContext}

You are a helpful, friendly AI marketing assistant. Help users with:
- Marketing strategy and campaign planning
- Content creation ideas
- Budget optimization
- Performance analysis insights
- Ad creative suggestions
- Audience targeting recommendations

Be conversational, proactive with suggestions, and always provide actionable advice. Keep responses concise but valuable. Use emojis sparingly to keep the tone friendly. If users ask about specific products/services, ask clarifying questions to give better recommendations.`;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { type, data }: MarketingRequest = await req.json();
    console.log(`Processing ${type} request with data:`, JSON.stringify(data));

    const systemPrompt = getSystemPrompt(type, data.userType);
    let userMessage = '';

    switch (type) {
      case 'product_description':
        userMessage = `Generate a compelling product description for:
Product Name: ${data.productName || 'Not specified'}
Category: ${data.productCategory || 'General'}
Key Features: ${data.productFeatures || 'Not specified'}
Price: ${data.productPrice || 'Not specified'}
Target Audience: ${data.targetAudience || 'General consumers'}`;
        break;

      case 'ad_copy':
        userMessage = `Create ad copy for:
${data.productName ? `Product: ${data.productName}` : `Service: ${data.serviceName}`}
Category/Type: ${data.productCategory || data.serviceType || 'General'}
Target Audience: ${data.targetAudience || 'General audience'}
Sales Goal: ${data.salesGoal || 'Increase awareness and conversions'}`;
        break;

      case 'campaign_suggestion':
        userMessage = `Suggest a marketing campaign for:
Business Type: ${data.userType === 'service' ? 'Service Provider' : 'Product Seller'}
${data.productName ? `Product: ${data.productName}` : `Service: ${data.serviceName}`}
Sales Goal: ${data.salesGoal || 'Increase sales by 25%'}
Budget: ${data.budget || 'Not specified - suggest optimal budget'}
Target Audience: ${data.targetAudience || 'To be determined'}`;
        break;

      case 'chat':
        userMessage = data.message || 'Hello, I need help with my marketing strategy.';
        break;

      default:
        throw new Error(`Unknown request type: ${type}`);
    }

    const messages = type === 'chat' && data.conversationHistory 
      ? [
          { role: 'system', content: systemPrompt },
          ...data.conversationHistory,
          { role: 'user', content: userMessage }
        ]
      : [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI usage credits exhausted. Please add more credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    console.log('Streaming response from AI Gateway');
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Error in ai-marketing function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
