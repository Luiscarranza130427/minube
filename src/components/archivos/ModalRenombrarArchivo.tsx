import React, { useState, useEffect } from 'react';
import { Edit3 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useArchivos } from '../../hooks/useArchivos';
import { mostrarToastExito, mostrarToastError } from '../../utils/alertas';
import type { Archivo } from '../../types';

interface ModalRenombrarArchivoProps {
  archivo: Archivo | null;
  abierto: boolean;
  alCerrar: () => void;
}

export const ModalRenombrarArchivo: React.FC<ModalRenombrarArchivoProps> = ({
  archivo,
  abierto,
  alCerrar,
}) => {
  const { renombrarArchivo } = useArchivos();
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (archivo) {
      setNuevoNombre(archivo.nombre_archivo);
      setError(null);
    }
  }, [archivo]);

  if (!archivo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) {
      setError('El nombre del archivo no puede estar vacío');
      return;
    }

    setGuardando(true);
    setError(null);
    const res = await renombrarArchivo(archivo.id, nuevoNombre.trim());
    setGuardando(false);

    if (res.exito) {
      mostrarToastExito('¡Archivo renombrado con éxito!');
      alCerrar();
    } else {
      setError(res.error || 'No se pudo renombrar el archivo');
      mostrarToastError(res.error || 'Error al renombrar archivo');
    }
  };

  return (
    <Modal
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Renombrar archivo"
      subtitulo="Modifica el nombre del archivo visible en tu nube"
      anchoMaximo="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          etiqueta="Nombre del archivo"
          value={nuevoNombre}
          onChange={(e) => {
            setNuevoNombre(e.target.value);
            if (error) setError(null);
          }}
          placeholder="nombre_archivo.ext"
          iconoIzquierda={<Edit3 className="w-4 h-4 text-slate-400" />}
          error={error || undefined}
          autoFocus
        />

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={alCerrar}
            disabled={guardando}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={guardando || !nuevoNombre.trim()}
            cargando={guardando}
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};
