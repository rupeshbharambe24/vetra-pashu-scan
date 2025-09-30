import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all analyses with their measurements
    const { data: analyses, error: analysesError } = await supabase
      .from('livestock_analyses')
      .select(`
        *,
        livestock_measurements (
          trait_name,
          value,
          unit,
          confidence,
          measurement_type
        )
      `)
      .order('created_at', { ascending: false });

    if (analysesError) {
      console.error('Database error:', analysesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch results' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Transform data for frontend
    const results = analyses?.map(analysis => ({
      id: analysis.id,
      entryId: analysis.entry_id,
      sideImageUrl: analysis.side_image_url,
      backImageUrl: analysis.back_image_url,
      timestamp: analysis.created_at,
      status: analysis.analysis_status,
      sideViewMeasurements: analysis.livestock_measurements
        .filter((m: any) => m.measurement_type === 'side')
        .map((m: any) => ({
          name: m.trait_name,
          value: m.value.toString(),
          unit: m.unit,
          confidence: m.confidence
        })),
      backViewMeasurements: analysis.livestock_measurements
        .filter((m: any) => m.measurement_type === 'back')
        .map((m: any) => ({
          name: m.trait_name,
          value: m.value.toString(),
          unit: m.unit,
          confidence: m.confidence
        }))
    })) || [];

    return new Response(
      JSON.stringify(results),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});