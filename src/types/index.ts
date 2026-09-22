import type { Perfil } from './database.types';

export * from './database.types';

export type CategoriaFiltro = 'todos' | 'documentos' | 'imagenes' | 'texto' | 'otros';

export type OrdenFiltro =
  | 'recientes'
  | 'antiguos'
  | 'tamano_desc'
  | 'tamano_asc'
  | 'nombre_asc'
  | 'nombre_desc';

export interface DesgloseCategoria {
  categoria: string;
  bytes: number;
  cantidad: number;
  color: string;
  porcentaje: number;
}

export interface EstadisticasArchivos {
  totalArchivos: number;
  espacioUtilizadoBytes: number;
  ultimaSubida: string | null;
  desgloseCategorias: DesgloseCategoria[];
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
