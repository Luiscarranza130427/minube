import type { CategoriaFiltro, Archivo } from '../types';

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
  const ext = (extension || '').toLowerCase().replace('.', '');
  const tipo = (tipoArchivo || '').toLowerCase();

  const extensionesImagenes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico', 'avif'];
  const extensionesTexto = [
    'txt', 'md', 'json', 'js', 'ts', 'tsx', 'jsx', 'html', 'css', 'sql',
    'py', 'java', 'c', 'cpp', 'xml', 'yaml', 'yml', 'env', 'sh'
  ];
  const extensionesDocumentos = [
    'pdf', 'doc', 'docx', 'rtf', 'odt', 'xls', 'xlsx', 'csv', 'ppt', 'pptx'
  ];

  if (extensionesImagenes.includes(ext) || tipo.startsWith('image/')) {
    return 'imagenes';
  }

  if (
    extensionesTexto.includes(ext) ||
    tipo.includes('json') ||
    tipo.includes('javascript') ||
    tipo.includes('typescript') ||
    tipo.startsWith('text/')
  ) {
    return 'texto';
  }

  if (
    extensionesDocumentos.includes(ext) ||
    tipo.includes('pdf') ||
    tipo.includes('word') ||
    tipo.includes('excel') ||
    tipo.includes('sheet') ||
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

/**
 * Genera y descarga un archivo CSV con el inventario completo de archivos
 */
export function exportarInventarioCSV(archivos: Archivo[]): void {
  if (!archivos || archivos.length === 0) return;

  const encabezados = ['ID', 'Nombre de Archivo', 'Extensión', 'Tipo MIME', 'Tamaño (Bytes)', 'Tamaño Formateado', 'Fecha de Subida', 'Descripción', 'Ruta Storage'];

  const filas = archivos.map((a) => [
    `"${a.id}"`,
    `"${(a.nombre_archivo || '').replace(/"/g, '""')}"`,
    `"${a.extension || ''}"`,
    `"${a.tipo_archivo || ''}"`,
    a.tamano_bytes,
    `"${formatearTamano(a.tamano_bytes)}"`,
    `"${a.fecha_subida || ''}"`,
    `"${(a.descripcion || '').replace(/"/g, '""')}"`,
    `"${a.ruta_almacenamiento || ''}"`,
  ]);

  const contenidoCSV = '\uFEFF' + [encabezados.join(','), ...filas.map((f) => f.join(','))].join('\r\n');
  const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  const fechaHoy = new Date().toISOString().split('T')[0];
  enlace.href = url;
  enlace.download = `inventario_archivos_nubox_${fechaHoy}.csv`;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
