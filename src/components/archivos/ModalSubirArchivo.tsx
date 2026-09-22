import React, { useState, useRef } from 'react';
import { UploadCloud, File, CheckCircle2, AlertCircle, X, Plus, Files } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { formatearTamano } from '../../utils/formatters';
import { useArchivos } from '../../hooks/useArchivos';
import { mostrarToastExito, mostrarToastError } from '../../utils/alertas';

interface ModalSubirArchivoProps {
  abierto: boolean;
  alCerrar: () => void;
}

export const ModalSubirArchivo: React.FC<ModalSubirArchivoProps> = ({ abierto, alCerrar }) => {
  const { subirMultiplesArchivos, progresoSubida, subiendo } = useArchivos();
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<File[]>([]);
  const [descripcion, setDescripcion] = useState<string>('');
  const [estaArrastrando, setEstaArrastrando] = useState<boolean>(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetearFormulario = () => {
    setArchivosSeleccionados([]);
    setDescripcion('');
    setErrorLocal(null);
    setMensajeExito(null);
    setEstaArrastrando(false);
  };

  const manejarCierre = () => {
    if (subiendo) return;
    resetearFormulario();
    alCerrar();
  };

  const agregarArchivos = (nuevosArchivos: FileList | File[]) => {
    const LIMITE_INDIVIDUAL_BYTES = 50 * 1024 * 1024; // 50MB
    const validos: File[] = [];
    const rechazados: string[] = [];

    Array.from(nuevosArchivos).forEach((archivo) => {
      if (archivo.size > LIMITE_INDIVIDUAL_BYTES) {
        rechazados.push(archivo.name);
      } else {
        // Evitar duplicados en la lista de espera
        const yaExiste = archivosSeleccionados.some(
          (a) => a.name === archivo.name && a.size === archivo.size
        );
        if (!yaExiste) {
          validos.push(archivo);
        }
      }
    });

    if (rechazados.length > 0) {
      setErrorLocal(
        `${rechazados.length} archivo(s) superaron el límite de 50 MB: ${rechazados.slice(0, 2).join(', ')}...`
      );
      mostrarToastError('Algunos archivos superan el límite de 50 MB.');
    } else {
      setErrorLocal(null);
    }

    if (validos.length > 0) {
      setArchivosSeleccionados((prev) => [...prev, ...validos]);
    }
  };

  const removerArchivo = (indice: number) => {
    setArchivosSeleccionados((prev) => prev.filter((_, i) => i !== indice));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setEstaArrastrando(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setEstaArrastrando(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setEstaArrastrando(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      agregarArchivos(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      agregarArchivos(e.target.files);
    }
    // Limpiar input para permitir seleccionar los mismos archivos de nuevo si se eliminan
    e.target.value = '';
  };

  const pesoTotal = archivosSeleccionados.reduce((acc, curr) => acc + curr.size, 0);

  const handleSubir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (archivosSeleccionados.length === 0) {
      setErrorLocal('Por favor selecciona al menos un archivo antes de continuar.');
      mostrarToastError('Por favor selecciona al menos un archivo.');
      return;
    }

    setErrorLocal(null);
    const resultado = await subirMultiplesArchivos(archivosSeleccionados, descripcion);

    if (resultado.exito) {
      const textoExito =
        resultado.subidos === 1
          ? '¡Archivo subido exitosamente a la nube!'
          : `¡${resultado.subidos} archivos subidos exitosamente a Nubox!`;
      setMensajeExito(textoExito);
      mostrarToastExito(textoExito);
      setTimeout(() => {
        manejarCierre();
      }, 900);
    } else {
      const msg = resultado.errores?.join('\n') || 'Error al subir los archivos';
      setErrorLocal(msg);
      mostrarToastError(resultado.errores?.[0] || 'Error al subir archivos');
    }
  };

  return (
    <Modal
      abierto={abierto}
      alCerrar={manejarCierre}
      titulo="Subir archivos"
      subtitulo="Carga uno o múltiples documentos de forma simultánea a tu nube"
      anchoMaximo="lg"
    >
      <form onSubmit={handleSubir} className="space-y-4">
        {/* Zona Drag & Drop interactiva */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200
            ${
              estaArrastrando
                ? 'border-sky-500 bg-sky-50/70 scale-[0.99]'
                : 'border-slate-200 hover:border-sky-400 hover:bg-slate-50/70'
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 shadow-2xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Arrastra tus archivos aquí o haz clic para seleccionarlos
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Puedes seleccionar múltiples documentos, imágenes, PDFs o código (máx. 50 MB por archivo)
          </p>
        </div>

        {/* Lista de archivos en cola */}
        {archivosSeleccionados.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Files className="w-3.5 h-3.5 text-sky-600" />
                Archivos en cola ({archivosSeleccionados.length})
              </span>
              <span className="text-xs font-mono text-slate-500 font-medium">
                Total: {formatearTamano(pesoTotal)}
              </span>
            </div>

            <div className="max-h-52 overflow-y-auto space-y-2 pr-1 rounded-xl">
              {archivosSeleccionados.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <File className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatearTamano(file.size)} • {file.type || 'Binario'}
                      </p>
                    </div>
                  </div>

                  {!subiendo && (
                    <button
                      type="button"
                      onClick={() => removerArchivo(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar de la lista"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!subiendo && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full py-2 border border-dashed border-sky-300 rounded-xl text-xs font-semibold text-sky-600 hover:bg-sky-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir más archivos a la cola</span>
              </button>
            )}

            {/* Progreso de subida */}
            {subiendo && (
              <div className="pt-2">
                <ProgressBar
                  progreso={progresoSubida}
                  etiqueta="Transfiriendo archivos a Supabase Storage..."
                />
              </div>
            )}
          </div>
        )}

        {/* Campo opcional: Descripción común */}
        <div>
          <label
            htmlFor="descripcion-archivo"
            className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5"
          >
            Nota o descripción <span className="text-slate-400 font-normal lowercase">(opcional)</span>
          </label>
          <textarea
            id="descripcion-archivo"
            rows={2}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={subiendo}
            placeholder="Añade una breve nota o contexto sobre estos archivos..."
            className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all resize-none"
          />
        </div>

        {/* Notificaciones */}
        {errorLocal && (
          <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 whitespace-pre-wrap">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorLocal}</span>
          </div>
        )}

        {mensajeExito && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={manejarCierre}
            disabled={subiendo}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={archivosSeleccionados.length === 0 || subiendo}
            cargando={subiendo}
          >
            {archivosSeleccionados.length > 1
              ? `Subir ${archivosSeleccionados.length} archivos`
              : 'Subir archivo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
