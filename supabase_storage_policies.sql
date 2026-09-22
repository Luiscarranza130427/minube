-- ==============================================================================
-- POLÍTICAS ROW LEVEL SECURITY (RLS) PARA SUPABASE STORAGE EN NUBOX
-- Bucket: 'archivos-personales'
-- ==============================================================================
-- NOTA: NO incluir "ALTER TABLE" porque storage.objects ya tiene RLS activo por
-- defecto y pertenece al rol interno del sistema de Supabase.
-- ==============================================================================

-- 1. Eliminar políticas existentes si ya se crearon para evitar duplicados
DROP POLICY IF EXISTS "Permitir subida en archivos-personales" ON storage.objects;
DROP POLICY IF EXISTS "Permitir lectura en archivos-personales" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminar en archivos-personales" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualizar en archivos-personales" ON storage.objects;

-- 2. POLÍTICA DE SUBIDA (INSERT): Permite a los usuarios subir archivos al bucket
CREATE POLICY "Permitir subida en archivos-personales"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'archivos-personales');

-- 3. POLÍTICA DE LECTURA (SELECT): Permite visualizar y descargar los archivos
CREATE POLICY "Permitir lectura en archivos-personales"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'archivos-personales');

-- 4. POLÍTICA DE ELIMINACIÓN (DELETE): Permite eliminar archivos del bucket
CREATE POLICY "Permitir eliminar en archivos-personales"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'archivos-personales');

-- 5. POLÍTICA DE ACTUALIZACIÓN (UPDATE): Permite sobrescribir o modificar archivos
CREATE POLICY "Permitir actualizar en archivos-personales"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'archivos-personales');
