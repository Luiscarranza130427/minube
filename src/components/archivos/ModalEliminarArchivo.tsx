import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Archivo } from '../../types';

interface ModalEliminarArchivoProps {
  archivo: Archivo | null;
  alCerrar: () => void;
  alConfirmar: () => Promise<void>;
  eliminando: boolean;
}

export const ModalEliminarArchivo: React.FC<ModalEliminarArchivoProps> = ({
  archivo,
  alCerrar,
  alConfirmar,
  eliminando,
}) => {
  if (!archivo) return null;

  return (
    <Modal
      abierto={Boolean(archivo)}
      alCerrar={alCerrar}
      titulo="Eliminar archivo"
      anchoMaximo="sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-800">
          <div className="p-2 rounded-lg bg-rose-100 shrink-0 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">¿Seguro que deseas eliminar este archivo?</p>
            <p className="text-xs text-rose-600/90 mt-0.5">
              Esta acción eliminará el archivo del almacenamiento y de la base de datos.
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
            Archivo a eliminar
          </p>
          <p className="text-sm font-semibold text-slate-800 truncate" title={archivo.nombre_archivo}>
            {archivo.nombre_archivo}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={alCerrar}
            disabled={eliminando}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={alConfirmar}
            cargando={eliminando}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
