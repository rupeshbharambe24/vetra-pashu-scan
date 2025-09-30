-- Create sequence for entry IDs first
CREATE SEQUENCE IF NOT EXISTS entry_id_seq START 1;

-- Create a table for livestock analysis results
CREATE TABLE public.livestock_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id TEXT NOT NULL UNIQUE DEFAULT CONCAT('LV-', EXTRACT(YEAR FROM NOW()), '-', LPAD(nextval('entry_id_seq')::text, 6, '0')),
  side_image_url TEXT NOT NULL,
  back_image_url TEXT NOT NULL,
  analysis_status TEXT NOT NULL DEFAULT 'completed' CHECK (analysis_status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for individual measurements
CREATE TABLE public.livestock_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.livestock_analyses(id) ON DELETE CASCADE,
  measurement_type TEXT NOT NULL CHECK (measurement_type IN ('side', 'back')),
  trait_name TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  confidence DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.livestock_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livestock_measurements ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required for this demo)
CREATE POLICY "Allow all operations on livestock_analyses" 
ON public.livestock_analyses 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on livestock_measurements" 
ON public.livestock_measurements 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_livestock_analyses_entry_id ON public.livestock_analyses(entry_id);
CREATE INDEX idx_livestock_analyses_created_at ON public.livestock_analyses(created_at DESC);
CREATE INDEX idx_livestock_measurements_analysis_id ON public.livestock_measurements(analysis_id);
CREATE INDEX idx_livestock_measurements_type ON public.livestock_measurements(measurement_type);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_livestock_analyses_updated_at
BEFORE UPDATE ON public.livestock_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();