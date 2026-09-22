import type { CategoriaFiltro } from '../types';

/**
 * Formatea un tamaño en bytes a una representación legible (KB, MB, GB)
 */
export function formatearTamano(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const decimales = 1;
  const magnitudes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimales))} ${magnitudes[i]}`;
}

/**
 * Formatea una fecha ISO a formato legible en español (DD/MM/YYYY)
 */
export function formatearFecha(fechaIso: string | null | undefined): string {
  if (!fechaIso) return 'Sin fecha';
  try {
    const fecha = new Date(fechaIso);
    if (isNaN(fecha.getTime())) return 'Fecha inválida';

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
  } catch {
    return 'Fecha inválida';
  }
}

/**
 * Retorna una descripción relativa sencilla (e.g., "Hoy", "Ayer", o DD/MM/YYYY)
 */
export function formatearFechaRelativa(fechaIso: string | null | undefined): string {
  if (!fechaIso) return 'Sin fecha';
  try {
    const fecha = new Date(fechaIso);
    const ahora = new Date();

    const esMismoDia =
      fecha.getDate() === ahora.getDate() &&
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getFullYear() === ahora.getFullYear();

    if (esMismoDia) return 'Hoy';

    const ayer = new Date();
    ayer.setDate(ahora.getDate() - 1);
    const esAyer =
      fecha.getDate() === ayer.getDate() &&
      fecha.getMonth() === ayer.getMonth() &&
      fecha.getFullYear() === ayer.getFullYear();

    if (esAyer) return 'Ayer';

    return formatearFecha(fechaIso);
  } catch {
    return 'Reciente';
  }
}

/**
 * Determina la categoría del archivo a partir de su extensión o tipo MIME
 */
export function clasificarArchivo(extension: string, tipoArchivo?: string): CategoriaFiltro {
  const ext = extension.toLowerCase().replace('.', '');
  const tipo = (tipoArchivo || '').toLowerCase();

  const extensionesImagenes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
  const extensionesDocumentos = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'csv', 'ppt', 'pptx'];

  if (extensionesImagenes.includes(ext) || tipo.startsWith('image/')) {
    return 'imagenes';
  }

  if (
    extensionesDocumentos.includes(ext) ||
    tipo.includes('pdf') ||
    tipo.includes('word') ||
    tipo.includes('excel') ||
    tipo.includes('sheet') ||
    tipo.includes('text') ||
    tipo.includes('presentation')
  ) {
    return 'documentos';
  }

  return 'otros';
}

/**
 * Obtiene las iniciales del nombre de un usuario
 */
export function obtenerIniciales(nombre: string): string {
  if (!nombre) return 'MN';
  const partes = nombre.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
}
