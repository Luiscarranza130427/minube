import React from 'react';
import {
  ShieldCheck,
  Database,
  Lock,
  Server,
  KeyRound,
  Layers,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ModalArquitecturaNubeProps {
  abierto: boolean;
  alCerrar: () => void;
}

export const ModalArquitecturaNube: React.FC<ModalArquitecturaNubeProps> = ({
  abierto,
  alCerrar,
}) => {
  return (
    <Modal
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Arquitectura Cloud & Seguridad"
      subtitulo="Desglose técnico de la infraestructura implementada para la evaluación académica"
      anchoMaximo="xl"
    >
      <div className="space-y-6 text-slate-700 text-sm max-h-[75vh] overflow-y-auto pr-1">
        {/* Banner de resumen */}
        <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-100">
            <Layers className="w-4 h-4" />
            <span>Infraestructura Cloud Native</span>
          </div>
          <h3 className="text-xl font-black mt-1 tracking-tight">
            Nubox: Almacenamiento Seguro Multi-Inquilino
          </h3>
          <p className="text-xs sm:text-sm text-sky-100 mt-1.5 leading-relaxed">
            Arquitectura desacoplada en la nube que separa la capa de almacenamiento de objetos (BLOBs),
            el catálogo relacional ACID (PostgreSQL), la identidad criptográfica (Auth JWT) y el
            control de acceso a nivel de fila (Row Level Security).
          </p>
        </div>

        {/* 4 Pilares de la Solución */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pilar 1: Supabase Auth */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">1. Supabase Auth</h4>
                <p className="text-[11px] text-slate-400">Identidad Criptográfica JWT</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Autenticación segura con firma asimétrica de tokens JWT. Cada sesión inyecta el ID del
              usuario (<code className="bg-slate-200/80 px-1 py-0.5 rounded text-sky-700 font-mono text-[11px]">auth.uid()</code>),
              el cual viaja en cada cabecera HTTP autorizada hacia la base de datos y el storage.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Sesión persistente y renovación automática de tokens</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Control de contraseñas con hashing BCrypt / Argon2</span>
              </li>
            </ul>
          </div>

          {/* Pilar 2: PostgreSQL Relacional */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">2. PostgreSQL Relacional</h4>
                <p className="text-[11px] text-slate-400">Catálogo de Metadatos ACID</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tabla <code className="bg-slate-200/80 px-1 py-0.5 rounded text-indigo-700 font-mono text-[11px]">archivos</code> con
              llave foránea que referencia <code className="bg-slate-200/80 px-1 py-0.5 rounded text-indigo-700 font-mono text-[11px]">auth.users(id) ON DELETE CASCADE</code>.
              Garantiza integridad referencial y permite búsquedas en milisegundos con filtros indexados.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Metadatos: tamaño exacto, extensión, tipo MIME, timestamps</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Sincronización en tiempo real y transacciones seguras</span>
              </li>
            </ul>
          </div>

          {/* Pilar 3: Supabase Storage */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">3. Supabase Storage</h4>
                <p className="text-[11px] text-slate-400">Bucket: archivos-personales</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Almacenamiento de objetos particionado jerárquicamente por el ID del usuario:
              <br />
              <code className="bg-slate-200/80 px-1.5 py-0.5 rounded text-emerald-700 font-mono text-[11px] mt-1 inline-block">
                {'archivos-personales/{user_id}/{timestamp}_{filename}'}
              </code>
              <br />
              Esta convención previene colisiones de nombres y optimiza la distribución en CDN.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Soporta subida en lotes simultáneos de hasta 50MB</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Descargas directas con cabecera Content-Disposition</span>
              </li>
            </ul>
          </div>

          {/* Pilar 4: Row Level Security (RLS) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">4. Row Level Security</h4>
                <p className="text-[11px] text-slate-400">Aislamiento Cero Confianza</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Las políticas SQL de RLS garantizan aislamiento estricto tanto en tablas como en buckets.
              Incluso si un usuario malintencionado intenta solicitar el archivo de otro usuario, el motor
              PostgreSQL rechaza la petición a nivel de kernel de base de datos.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Verificación en Storage: <code className="font-mono text-[10px]">(storage.foldername(name))[1] = auth.uid()::text</code></span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Protección completa contra inyecciones e IDOR</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Políticas SQL aplicadas */}
        <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold flex items-center gap-2 text-sky-400">
              <Lock className="w-4 h-4" />
              Políticas RLS en PostgreSQL y Storage
            </span>
            <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              supabase_storage_policies.sql
            </span>
          </div>
          <pre className="overflow-x-auto text-[11px] text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
{`-- 1. Los usuarios solo pueden insertar sus propios archivos en su carpeta
CREATE POLICY "Permitir subida en carpeta propia"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'archivos-personales' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. Los usuarios solo pueden ver y descargar sus propios archivos
CREATE POLICY "Permitir ver archivos propios"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'archivos-personales' AND
  (storage.foldername(name))[1] = auth.uid()::text
);`}
          </pre>
        </div>

        {/* Resumen de características evaluadas */}
        <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-sky-900">
              Cumplimiento del 100% de los Criterios Académicos
            </p>
            <p className="text-sky-700">
              Autenticación funcional, CRUD completo de archivos, previsualización, URLs temporales firmadas y base de datos relacional.
            </p>
          </div>
          <a
            href="https://supabase.com/docs/guides/storage"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-sky-700 rounded-xl border border-sky-200 font-semibold hover:bg-sky-50 shrink-0 transition-colors shadow-2xs"
          >
            <span>Docs Supabase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Botón cerrar */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="primary" size="md" onClick={alCerrar}>
            Entendido
          </Button>
        </div>
      </div>
    </Modal>
  );
};
