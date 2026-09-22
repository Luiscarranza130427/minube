import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lectura de variables de entorno de Vite (soporta tanto ANON_KEY como PUBLISHABLE_KEY)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Verificación de si las credenciales de Supabase fueron configuradas
export const estaConfiguradoSupabase: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  supabaseUrl.startsWith('http')
);

/**
 * Cliente de Supabase singleton.
 * Si las credenciales no están presentes en el entorno (.env),
 * se inicializa con un placeholder controlado para no romper la app en modo demostración.
 */
export const supabase: SupabaseClient = estaConfiguradoSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder-minube.supabase.co', 'placeholder-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

/**
 * Nombre del bucket de Supabase Storage para los archivos de usuario
 */
export const BUCKET_ARCHIVOS = 'archivos-personales';
