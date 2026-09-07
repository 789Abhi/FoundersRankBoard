-- Run this in your Supabase SQL Editor to create the listings table

CREATE TABLE public.listings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  domain text NOT NULL,
  name text,
  url text NOT NULL,
  tagline text,
  category text NOT NULL,
  total_paid_usd numeric DEFAULT 0,
  clicks integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_clicked_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  favicon text,
  bg_color text
);

-- Turn on Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to listings
CREATE POLICY "Allow public read access" ON public.listings FOR SELECT USING (true);

-- Allow public insert access (For the webhook later, or direct inserts)
CREATE POLICY "Allow public insert access" ON public.listings FOR INSERT WITH CHECK (true);

-- Allow public update access (For click tracking)
CREATE POLICY "Allow public update access" ON public.listings FOR UPDATE USING (true);
