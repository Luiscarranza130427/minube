import type { Archivo, Perfil } from '../types';

/**
 * Perfil de demostración inicial para desarrollo y evaluación académica
 */
export const MOCK_PERFIL: Perfil = {
  id: 'usr-academico-001',
  nombre_completo: 'Carlos Arratia',
  correo: 'carlos.arratia@ejemplo.edu.pe',
  fecha_registro: '2026-03-15T10:30:00Z',
  fecha_actualizacion: '2026-09-22T08:00:00Z',
};

/**
 * Archivos de demostración iniciales requeridos en la especificación académica
 */
export const MOCK_ARCHIVOS: Archivo[] = [
  {
    id: 'arch-001',
    usuario_id: 'usr-academico-001',
    nombre_archivo: 'informe_senati.pdf',
    nombre_almacenamiento: 'usr-academico-001/1726998000000_informe_senati.pdf',
    extension: '.pdf',
    tipo_archivo: 'application/pdf',
    tamano_bytes: 1258291, // ~1.2 MB
    ruta_almacenamiento: 'archivos-personales/usr-academico-001/informe_senati.pdf',
    descripcion: 'Informe técnico de avance de proyecto para el módulo de cloud computing.',
    fecha_subida: '2026-09-22T07:45:00Z',
    fecha_actualizacion: '2026-09-22T07:45:00Z',
  },
  {
    id: 'arch-002',
    usuario_id: 'usr-academico-001',
    nombre_archivo: 'foto_proyecto.jpg',
    nombre_almacenamiento: 'usr-academico-001/1726911600000_foto_proyecto.jpg',
    extension: '.jpg',
    tipo_archivo: 'image/jpeg',
    tamano_bytes: 870400, // ~850 KB
    ruta_almacenamiento: 'archivos-personales/usr-academico-001/foto_proyecto.jpg',
    descripcion: 'Captura de pantalla de la arquitectura desplegada en Supabase.',
    fecha_subida: '2026-09-21T15:20:00Z',
    fecha_actualizacion: '2026-09-21T15:20:00Z',
  },
  {
    id: 'arch-003',
    usuario_id: 'usr-academico-001',
    nombre_archivo: 'documentacion.docx',
    nombre_almacenamiento: 'usr-academico-001/1726825200000_documentacion.docx',
    extension: '.docx',
    tipo_archivo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    tamano_bytes: 430080, // ~420 KB
    ruta_almacenamiento: 'archivos-personales/usr-academico-001/documentacion.docx',
    descripcion: 'Borrador de manual de usuario y guía de configuración del sistema.',
    fecha_subida: '2026-09-20T11:10:00Z',
    fecha_actualizacion: '2026-09-20T11:10:00Z',
  },
  {
    id: 'arch-004',
    usuario_id: 'usr-academico-001',
    nombre_archivo: 'backup_bd.zip',
    nombre_almacenamiento: 'usr-academico-001/1726652400000_backup_bd.zip',
    extension: '.zip',
    tipo_archivo: 'application/zip',
    tamano_bytes: 3460300, // ~3.3 MB
    ruta_almacenamiento: 'archivos-personales/usr-academico-001/backup_bd.zip',
    descripcion: 'Copia de seguridad en formato SQL de esquemas y tablas.',
    fecha_subida: '2026-09-18T18:00:00Z',
    fecha_actualizacion: '2026-09-18T18:00:00Z',
  },
  {
    id: 'arch-005',
    usuario_id: 'usr-academico-001',
    nombre_archivo: 'presupuesto_cloud.xlsx',
    nombre_almacenamiento: 'usr-academico-001/1726479600000_presupuesto_cloud.xlsx',
    extension: '.xlsx',
    tipo_archivo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    tamano_bytes: 184320, // ~180 KB
    ruta_almacenamiento: 'archivos-personales/usr-academico-001/presupuesto_cloud.xlsx',
    descripcion: 'Cálculo de costos estimados de computación y storage.',
    fecha_subida: '2026-09-16T09:30:00Z',
    fecha_actualizacion: '2026-09-16T09:30:00Z',
  },
];
