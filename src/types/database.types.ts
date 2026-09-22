// Tipos estrictos para las entidades de base de datos en PostgreSQL / Supabase
// Respetando estrictamente los nombres en español requeridos

export interface Perfil {
  id: string;
  nombre_completo: string;
  correo: string;
  fecha_registro: string;
  fecha_actualizacion: string;
}

export interface Archivo {
  id: string;
  usuario_id: string;
  nombre_archivo: string;
  nombre_almacenamiento: string;
  extension: string;
  tipo_archivo: string;
  tamano_bytes: number;
  ruta_almacenamiento: string;
  descripcion: string | null;
  fecha_subida: string;
  fecha_actualizacion: string;
}

// Tipado para inserciones en la base de datos
export type ArchivoInsert = Omit<Archivo, 'id' | 'fecha_subida' | 'fecha_actualizacion'> & {
  id?: string;
  fecha_subida?: string;
  fecha_actualizacion?: string;
};

export type PerfilUpdate = Partial<Pick<Perfil, 'nombre_completo'>>;
