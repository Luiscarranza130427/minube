import type { Perfil } from './database.types';

export * from './database.types';

export type CategoriaFiltro = 'todos' | 'documentos' | 'imagenes' | 'otros';

export interface EstadisticasArchivos {
  totalArchivos: number;
  espacioUtilizadoBytes: number;
  ultimaSubida: string | null;
}

export interface UsuarioAutenticado {
  id: string;
  correo: string;
  perfil: Perfil;
}

export interface RespuestaAuth {
  exito: boolean;
  mensaje?: string;
  error?: string;
}
