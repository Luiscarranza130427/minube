import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  Sheet,
  Archive,
  File,
  FileCode,
  Music,
  Video,
} from 'lucide-react';

interface IconoConfig {
  icono: React.ComponentType<{ className?: string }>;
  colorTexto: string;
  colorFondo: string;
  etiquetaTipo: string;
}

export function obtenerConfiguracionArchivo(extension: string, tipoArchivo?: string): IconoConfig {
  const ext = extension.toLowerCase().replace('.', '');
  const tipo = (tipoArchivo || '').toLowerCase();

  // PDF
  if (ext === 'pdf' || tipo.includes('pdf')) {
    return {
      icono: FileText,
      colorTexto: 'text-red-500',
      colorFondo: 'bg-red-50',
      etiquetaTipo: 'PDF',
    };
  }

  // Imágenes
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext) || tipo.startsWith('image/')) {
    return {
      icono: ImageIcon,
      colorTexto: 'text-sky-500',
      colorFondo: 'bg-sky-50',
      etiquetaTipo: 'Imagen',
    };
  }

  // Word / Documentos de texto
  if (['doc', 'docx', 'odt', 'rtf'].includes(ext) || tipo.includes('word')) {
    return {
      icono: FileText,
      colorTexto: 'text-blue-600',
      colorFondo: 'bg-blue-50',
      etiquetaTipo: 'Documento',
    };
  }

  // Excel / Hojas de cálculo
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext) || tipo.includes('excel') || tipo.includes('sheet') || tipo.includes('csv')) {
    return {
      icono: Sheet,
      colorTexto: 'text-emerald-600',
      colorFondo: 'bg-emerald-50',
      etiquetaTipo: 'Hoja de cálculo',
    };
  }

  // Archivos comprimidos / ZIP
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || tipo.includes('zip') || tipo.includes('compressed')) {
    return {
      icono: Archive,
      colorTexto: 'text-amber-600',
      colorFondo: 'bg-amber-50',
      etiquetaTipo: 'Comprimido',
    };
  }

  // Código
  if (['js', 'ts', 'tsx', 'jsx', 'html', 'css', 'json', 'py', 'sql'].includes(ext)) {
    return {
      icono: FileCode,
      colorTexto: 'text-indigo-500',
      colorFondo: 'bg-indigo-50',
      etiquetaTipo: 'Código',
    };
  }

  // Audio / Video
  if (['mp3', 'wav', 'ogg', 'flac'].includes(ext) || tipo.startsWith('audio/')) {
    return {
      icono: Music,
      colorTexto: 'text-purple-500',
      colorFondo: 'bg-purple-50',
      etiquetaTipo: 'Audio',
    };
  }

  if (['mp4', 'avi', 'mkv', 'mov', 'webm'].includes(ext) || tipo.startsWith('video/')) {
    return {
      icono: Video,
      colorTexto: 'text-pink-500',
      colorFondo: 'bg-pink-50',
      etiquetaTipo: 'Video',
    };
  }

  // Otros
  return {
    icono: File,
    colorTexto: 'text-slate-500',
    colorFondo: 'bg-slate-100',
    etiquetaTipo: ext ? ext.toUpperCase() : 'Archivo',
  };
}
