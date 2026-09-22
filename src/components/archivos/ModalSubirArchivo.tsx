import React, { useState, useRef } from 'react';
import { UploadCloud, File, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { formatearTamano } from '../../utils/formatters';
import { useArchivos } from '../../hooks/useArchivos';

interface ModalSubirArchivoProps {
  abierto: boolean;
  alCerrar: () => void;
}

export const ModalSubirArchivo: React.FC<ModalSubirArchivoProps> = ({ abierto, alCerrar }) => {
  const { subirArchivo, progresoSubida, subiendo } = useArchivos();
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState<string>('');
  const [estaArrastrando, setEstaArrastrando] = useState<boolean>(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetearFormulario = () => {
    setArchivoSeleccionado(null);
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

  const procesarArchivo = (archivo: File) => {
    // Límite razonable para demostración académica: 50MB
    const LIMITE_BYTES = 50 * 1024 * 1024;
    if (archivo.size > LIMITE_BYTES) {
      setErrorLocal('El archivo supera el tamaño máximo permitido de 50 MB.');
      return;
    }
    setErrorLocal(null);
    setArchivoSeleccionado(archivo);
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
      procesarArchivo(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      procesarArchivo(e.target.files[0]);
    }
  };

  const handleSubir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivoSeleccionado) {
      setErrorLocal('Por favor selecciona un archivo antes de continuar.');
      return;
    }

    setErrorLocal(null);
    const resultado = await subirArchivo(archivoSeleccionado, descripcion);

    if (resultado.exito) {
      setMensajeExito('¡Archivo subido exitosamente a la nube!');
      setTimeout(() => {
        manejarCierre();
      }, 1200);
    } else {
      setErrorLocal(resultado.error || 'Error al subir el archivo');
    }
  };

  return (
    <Modal
      abierto={abierto}
      alCerrar={manejarCierre}
      titulo="Subir archivo"
      subtitulo="Almacena tus documentos de forma segura en la nube"
      anchoMaximo="md"
    >
      <form onSubmit={handleSubir} className="space-y-4">
        {/* Zona Drag & Drop */}
        {!archivoSeleccionado ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
              ${
                estaArrastrando
                  ? 'border-sky-500 bg-sky-50/60 scale-[0.99]'
                  : 'border-slate-200 hover:border-sky-400 hover:bg-slate-50/70'
              }
            `}
          >
            <input
              ref={inputRef}
              type="file"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 shadow-2xs">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Arrastra tu archivo aquí
            </p>
            <p className="text-xs text-slate-400 mt-1">
              o haz clic para <span className="text-sky-600 font-medium underline">Seleccionar archivo</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-3">
              Archivos PDF, imágenes, Word, Excel, ZIP hasta 50MB
            </p>
          </div>
        ) : (
          /* Metadatos del archivo seleccionado */
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100/70 text-sky-600 flex items-center justify-center shrink-0">
                  <File className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 truncate" title={archivoSeleccionado.name}>
                    {archivoSeleccionado.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatearTamano(archivoSeleccionado.size)} • {archivoSeleccionado.type || 'Tipo desconocido'}
                  </p>
                </div>
              </div>

              {!subiendo && (
                <button
                  type="button"
                  onClick={() => setArchivoSeleccionado(null)}
                  className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline cursor-pointer ml-2 shrink-0"
                >
                  Cambiar
                </button>
              )}
            </div>

            {/* Barra de progreso interactiva */}
            {subiendo && (
              <ProgressBar
                progreso={progresoSubida}
                etiqueta="Transfiriendo a la nube..."
              />
            )}
          </div>
        )}

        {/* Campo opcional: Descripción */}
        <div>
          <label
            htmlFor="descripcion-archivo"
            className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5"
          >
            Descripción <span className="text-slate-400 font-normal lowercase">(opcional)</span>
          </label>
          <textarea
            id="descripcion-archivo"
            rows={2}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={subiendo}
            placeholder="Añade una breve nota o contexto sobre este archivo..."
            className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all resize-none"
          />
        </div>

        {/* Notificaciones de error o éxito */}
        {errorLocal && (
          <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
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
            disabled={!archivoSeleccionado || subiendo}
            cargando={subiendo}
          >
            Subir archivo
          </Button>
        </div>
      </form>
    </Modal>
  );
};
