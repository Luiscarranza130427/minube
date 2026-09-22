-- ==============================================================================
-- POLÍTICAS ROW LEVEL SECURITY (RLS) PARA SUPABASE STORAGE EN NUBOX
-- Bucket: 'archivos-personales'
-- ==============================================================================
-- INSTRUCCIONES:
-- 1. Ve a tu panel de Supabase: https://supabase.com/dashboard/project/yoanlgnqynkbxmllownp/sql/new
-- 2. Copia y pega este script completo en el SQL Editor.
-- 3. Haz clic en "Run" (o presiona Ctrl + Enter).
-- ==============================================================================

-- 1. Asegurar que RLS esté activo en la tabla de objetos de Storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Limpiar políticas existentes para evitar duplicados si ya se crearon
DROP POLICY IF EXISTS "Permitir subida en archivos-personales" ON storage.objects;
DROP POLICY IF EXISTS "Permitir lectura en archivos-personales" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminar en archivos-personales" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualizar en archivos-personales" ON storage.objects;

-- 3. POLÍTICA DE SUBIDA (INSERT): Permite a los usuarios subir archivos al bucket
CREATE POLICY "Permitir subida en archivos-personales"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'archivos-personales');

-- 4. POLÍTICA DE LECTURA (SELECT): Permite visualizar y descargar los archivos
CREATE POLICY "Permitir lectura en archivos-personales"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'archivos-personales');

-- 5. POLÍTICA DE ELIMINACIÓN (DELETE): Permite eliminar archivos del bucket
CREATE POLICY "Permitir eliminar en archivos-personales"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'archivos-personales');

-- 6. POLÍTICA DE ACTUALIZACIÓN (UPDATE): Permite sobrescribir o modificar archivos
CREATE POLICY "Permitir actualizar en archivos-personales"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'archivos-personales');
