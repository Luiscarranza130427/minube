import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Image as ImageIcon,
  FileCode,
  ExternalLink,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useArchivos } from '../../hooks/useArchivos';
import { formatearTamano, formatearFecha } from '../../utils/formatters';
import { mostrarToastExito, mostrarToastInfo } from '../../utils/alertas';
import type { Archivo } from '../../types';

interface ModalVistaPreviaProps {
  archivo: Archivo | null;
  alCerrar: () => void;
}

export const ModalVistaPrevia: React.FC<ModalVistaPreviaProps> = ({ archivo, alCerrar }) => {
  const { obtenerUrlPublica, obtenerUrlFirmada, descargarArchivo } = useArchivos();
  const [urlPublica, setUrlPublica] = useState<string>('');
  const [contenidoTexto, setContenidoTexto] = useState<string | null>(null);
  const [cargandoTexto, setCargandoTexto] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);
  const [generandoFirmada, setGenerandoFirmada] = useState<boolean>(false);

  useEffect(() => {
    if (!archivo) {
      setUrlPublica('');
      setContenidoTexto(null);
      return;
    }

    const url = obtenerUrlPublica(archivo);
    setUrlPublica(url);

    const ext = (archivo.extension || '').toLowerCase();
    const esTexto = ['.txt', '.md', '.json', '.js', '.ts', '.html', '.css', '.sql'].includes(ext);

    if (esTexto && url) {
      setCargandoTexto(true);
      fetch(url)
        .then((res) => res.text())
        .then((text) => {
          setContenidoTexto(text.slice(0, 15000)); // Limitar a 15k caracteres para fluidez
        })
        .catch(() => {
          setContenidoTexto('No se pudo cargar el contenido del archivo en vista previa.');
        })
        .finally(() => {
          setCargandoTexto(false);
        });
    } else {
      setContenidoTexto(null);
    }
  }, [archivo]);

  if (!archivo) return null;

  const ext = (archivo.extension || '').toLowerCase();
  const esImagen = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(ext);
  const esPdf = ext === '.pdf';
  const esTexto = ['.txt', '.md', '.json', '.js', '.ts', '.html', '.css', '.sql'].includes(ext);

  const handleCopiarEnlace = async () => {
    if (!urlPublica) return;
    try {
      await navigator.clipboard.writeText(urlPublica);
      setCopiado(true);
      mostrarToastExito('¡Enlace público copiado al portapapeles!');
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      mostrarToastInfo('No se pudo copiar automáticamente.');
    }
  };

  const handleGenerarEnlaceFirmado = async () => {
    setGenerandoFirmada(true);
    const firmada = await obtenerUrlFirmada(archivo, 120); // Válida por 120 segundos
    setGenerandoFirmada(false);

    if (firmada) {
      await navigator.clipboard.writeText(firmada);
      mostrarToastExito('¡Enlace temporal firmado (120s) copiado!');
    } else {
      mostrarToastInfo('Disponible al estar conectado a Supabase Storage.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl flex flex-col w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Cabecera del visor */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
              {esImagen ? (
                <ImageIcon className="w-5 h-5" />
              ) : esTexto ? (
                <FileCode className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate" title={archivo.nombre_archivo}>
                {archivo.nombre_archivo}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{formatearTamano(archivo.tamano_bytes)}</span>
                <span>•</span>
                <span>Subido el {formatearFecha(archivo.fecha_subida)}</span>
              </p>
            </div>
          </div>

          {/* Botones de acción rápida */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopiarEnlace}
              className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl border border-slate-200/80 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Copiar enlace público"
            >
              {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">Enlace</span>
            </button>

            <button
              onClick={handleGenerarEnlaceFirmado}
              disabled={generandoFirmada}
              className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl border border-slate-200/80 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Generar enlace firmado temporal (seguridad RLS)"
            >
              <Clock className="w-4 h-4 text-emerald-500" />
              <span className="hidden md:inline">Enlace Seguro (2m)</span>
            </button>

            <button
              onClick={() => descargarArchivo(archivo)}
              className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs shadow-sky-500/20"
              title="Descargar archivo"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Descargar</span>
            </button>

            <button
              onClick={alCerrar}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer ml-1"
              title="Cerrar visor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cuerpo del visor */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100/50 flex items-center justify-center min-h-[300px]">
          {esImagen ? (
            <div className="max-w-full max-h-[70vh] flex items-center justify-center bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60">
              <img
                src={urlPublica}
                alt={archivo.nombre_archivo}
                className="max-w-full max-h-[65vh] object-contain rounded-xl"
              />
            </div>
          ) : esPdf ? (
            <div className="w-full h-[70vh] bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
              <iframe
                src={`${urlPublica}#toolbar=1`}
                title={archivo.nombre_archivo}
                className="w-full h-full border-0"
              />
            </div>
          ) : esTexto ? (
            <div className="w-full max-h-[65vh] bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 overflow-auto text-left">
              {cargandoTexto ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Cargando vista previa de texto...
                </div>
              ) : (
                <pre className="text-xs sm:text-sm font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {contenidoTexto || 'El archivo está vacío.'}
                </pre>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-500 mx-auto flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">{archivo.nombre_archivo}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  La vista previa directa en navegador no está soportada para este tipo de archivo ({archivo.extension}).
                </p>
              </div>
              <button
                onClick={() => descargarArchivo(archivo)}
                className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Descargar para abrir
              </button>
            </div>
          )}
        </div>

        {/* Pie informativo */}
        <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-500" />
            <span>Almacenamiento seguro en Supabase Storage (Bucket: archivos-personales)</span>
          </div>
          {urlPublica && (
            <a
              href={urlPublica}
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Abrir en pestaña nueva</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
