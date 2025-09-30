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
    const formData = await req.formData();
    const sideImage = formData.get('sideImage') as File;
    const backImage = formData.get('backImage') as File;

    if (!sideImage || !backImage) {
      return new Response(
        JSON.stringify({ error: 'Both side and back images are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Convert images to base64 for processing (in real implementation, this would go to AI service)
    const sideImageArrayBuffer = await sideImage.arrayBuffer();
    const backImageArrayBuffer = await backImage.arrayBuffer();
    const sideImageBase64 = `data:${sideImage.type};base64,${btoa(String.fromCharCode(...new Uint8Array(sideImageArrayBuffer)))}`;
    const backImageBase64 = `data:${backImage.type};base64,${btoa(String.fromCharCode(...new Uint8Array(backImageArrayBuffer)))}`;

    // Mock AI processing results with realistic measurements
    const sideViewMeasurements = [
      { trait_name: "Body Length", value: Math.floor(Math.random() * 50) + 140, unit: "cm", confidence: Math.random() * 0.1 + 0.90 },
      { trait_name: "Withers Height", value: Math.floor(Math.random() * 30) + 125, unit: "cm", confidence: Math.random() * 0.1 + 0.85 },
      { trait_name: "Girth Length", value: Math.floor(Math.random() * 40) + 170, unit: "cm", confidence: Math.random() * 0.1 + 0.92 },
      { trait_name: "Rump Angle", value: Math.floor(Math.random() * 10) + 15, unit: "degrees", confidence: Math.random() * 0.15 + 0.80 },
      { trait_name: "Chest Depth", value: Math.floor(Math.random() * 20) + 65, unit: "cm", confidence: Math.random() * 0.1 + 0.88 },
      { trait_name: "Head Length", value: Math.floor(Math.random() * 10) + 45, unit: "cm", confidence: Math.random() * 0.1 + 0.85 }
    ];

    const backViewMeasurements = [
      { trait_name: "Hip Width", value: Math.floor(Math.random() * 15) + 45, unit: "cm", confidence: Math.random() * 0.1 + 0.87 },
      { trait_name: "Hip Height", value: Math.floor(Math.random() * 25) + 120, unit: "cm", confidence: Math.random() * 0.1 + 0.89 },
      { trait_name: "Rump Width", value: Math.floor(Math.random() * 10) + 40, unit: "cm", confidence: Math.random() * 0.1 + 0.83 },
      { trait_name: "Thurl Width", value: Math.floor(Math.random() * 8) + 22, unit: "cm", confidence: Math.random() * 0.15 + 0.78 },
      { trait_name: "Tail Length", value: Math.floor(Math.random() * 20) + 80, unit: "cm", confidence: Math.random() * 0.1 + 0.85 }
    ];

    // Store analysis in database
    const { data: analysisData, error: analysisError } = await supabase
      .from('livestock_analyses')
      .insert({
        side_image_url: sideImageBase64,
        back_image_url: backImageBase64,
        analysis_status: 'completed'
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Database error:', analysisError);
      return new Response(
        JSON.stringify({ error: 'Failed to store analysis' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Store measurements
    const allMeasurements = [
      ...sideViewMeasurements.map(m => ({ ...m, measurement_type: 'side', analysis_id: analysisData.id })),
      ...backViewMeasurements.map(m => ({ ...m, measurement_type: 'back', analysis_id: analysisData.id }))
    ];

    const { error: measurementsError } = await supabase
      .from('livestock_measurements')
      .insert(allMeasurements);

    if (measurementsError) {
      console.error('Measurements error:', measurementsError);
      return new Response(
        JSON.stringify({ error: 'Failed to store measurements' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Return results
    return new Response(
      JSON.stringify({
        entryId: analysisData.entry_id,
        analysisId: analysisData.id,
        sideViewMeasurements,
        backViewMeasurements,
        sideImageUrl: sideImageBase64,
        backImageUrl: backImageBase64,
        timestamp: analysisData.created_at
      }),
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