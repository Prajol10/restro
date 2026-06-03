import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://enbqhelnfpsjtzpvdodm.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuYnFoZWxuZnBzanR6cHZkb2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMDAyODcsImV4cCI6MjA5NDU3NjI4N30.orPx5PlrQ4klhDACnNLWUtgGyDnZhbLShBf3HEGE1kM';
const BUCKET = 'restro-assets';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const uploadFile = async (file, restaurantSlug, folder = 'general') => {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `${restaurantSlug}/${folder}/${fileName}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

export const deleteFile = async (path) => {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(error.message);
};

export const listFiles = async (restaurantSlug, folder = '') => {
  const path = folder ? `${restaurantSlug}/${folder}` : restaurantSlug;
  const { data, error } = await supabase.storage.from(BUCKET).list(path, {
    limit: 100, sortBy: { column: 'created_at', order: 'desc' }
  });
  if (error) throw new Error(error.message);
  return data || [];
};

export const getPublicUrl = (path) => {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};
