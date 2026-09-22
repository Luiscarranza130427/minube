import Swal from 'sweetalert2';
import logoNubox from '../assets/nubox-logo.png';

/**
 * Toast flotante minimalista estilo píldora moderna (Apple / Linear)
 * Centrado arriba, limpio, elegante y SIN fondo oscuro ni barras molestas
 */
export const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  showCancelButton: false,
  timer: 2800,
  timerProgressBar: false, // Sin barra de carga para máxima limpieza visual
  backdrop: false, // Cero sombra oscura en la pantalla
  background: '#ffffff',
  color: '#0f172a',
  customClass: {
    popup: 'swal2-pill-toast',
    container: 'swal2-pill-container',
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

/**
 * Genera el HTML minimalista de una sola línea tipo píldora
 */
const generarPillToast = (
  mensaje: string,
  tipo: 'exito' | 'error' | 'info' | 'advertencia'
) => {
  const iconConfig = {
    exito: {
      color: '#10b981',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    },
    error: {
      color: '#f43f5e',
      bg: '#fff1f2',
      border: '#fecdd3',
      svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    },
    info: {
      color: '#0ea5e9',
      bg: '#f0f9ff',
      border: '#bae6fd',
      svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    },
    advertencia: {
      color: '#f59e0b',
      bg: '#fffbeb',
      border: '#fde68a',
      svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    },
  }[tipo];

  return `
    <div class="swal-pill-wrapper">
      <img src="${logoNubox}" alt="Nubox" class="swal-pill-logo-img" />
      <span class="swal-pill-sep"></span>
      <span class="swal-pill-text">${mensaje}</span>
      <span class="swal-pill-icon-box" style="background-color: ${iconConfig.bg}; border: 1px solid ${iconConfig.border};">
        ${iconConfig.svg}
      </span>
    </div>
  `;
};

/**
 * Notificación Toast de ÉXITO
 */
export const mostrarToastExito = (mensaje: string) => {
  return Toast.fire({
    html: generarPillToast(mensaje, 'exito'),
  });
};

/**
 * Notificación Toast de ERROR
 */
export const mostrarToastError = (mensaje: string) => {
  return Toast.fire({
    html: generarPillToast(mensaje, 'error'),
  });
};

/**
 * Notificación Toast de INFORMACIÓN
 */
export const mostrarToastInfo = (mensaje: string) => {
  return Toast.fire({
    html: generarPillToast(mensaje, 'info'),
  });
};

/**
 * Notificación Toast de ADVERTENCIA
 */
export const mostrarToastAdvertencia = (mensaje: string) => {
  return Toast.fire({
    html: generarPillToast(mensaje, 'advertencia'),
  });
};

/**
 * Modal centrado estilo SweetAlert clásico para confirmación de eliminación
 */
export const confirmarEliminacionArchivo = async (nombreArchivo: string): Promise<boolean> => {
  const resultado = await Swal.fire({
    imageUrl: logoNubox,
    imageWidth: 64,
    imageHeight: 64,
    imageAlt: 'Nubox',
    title: '¿Eliminar archivo?',
    html: `
      <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.75rem;">
        Esta acción no se puede deshacer. Se eliminará permanentemente de tu nube:
      </p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 0.625rem 0.875rem; font-weight: 600; color: #1e293b; font-size: 0.8125rem; word-break: break-all;">
        ${nombreArchivo}
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: 'swal-classic-modal',
      title: 'swal-classic-title',
      confirmButton: 'swal-classic-btn-danger',
      cancelButton: 'swal-classic-btn-cancel',
      actions: 'swal-classic-actions',
    },
  });

  return resultado.isConfirmed;
};

/**
 * Modal centrado para confirmar cerrar sesión
 */
export const confirmarCerrarSesion = async (): Promise<boolean> => {
  const resultado = await Swal.fire({
    imageUrl: logoNubox,
    imageWidth: 60,
    imageHeight: 60,
    imageAlt: 'Nubox',
    title: '¿Cerrar sesión?',
    text: 'Tu sesión se cerrará de forma segura en este navegador.',
    showCancelButton: true,
    confirmButtonText: 'Cerrar sesión',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: 'swal-classic-modal',
      title: 'swal-classic-title',
      confirmButton: 'swal-classic-btn-danger',
      cancelButton: 'swal-classic-btn-cancel',
      actions: 'swal-classic-actions',
    },
  });

  return resultado.isConfirmed;
};

/**
 * Modal centrado clásico de éxito
 */
export const mostrarModalExito = (titulo: string, mensaje: string) => {
  return Swal.fire({
    imageUrl: logoNubox,
    imageWidth: 64,
    imageHeight: 64,
    imageAlt: 'Nubox',
    title: titulo,
    text: mensaje,
    confirmButtonText: 'Entendido',
    buttonsStyling: false,
    customClass: {
      popup: 'swal-classic-modal',
      title: 'swal-classic-title',
      confirmButton: 'swal-classic-btn-primary',
      actions: 'swal-classic-actions',
    },
  });
};

/**
 * Modal centrado clásico de error
 */
export const mostrarModalError = (titulo: string, mensaje: string) => {
  return Swal.fire({
    icon: 'error',
    title: titulo,
    text: mensaje,
    confirmButtonText: 'Aceptar',
    buttonsStyling: false,
    customClass: {
      popup: 'swal-classic-modal',
      title: 'swal-classic-title',
      confirmButton: 'swal-classic-btn-primary',
      actions: 'swal-classic-actions',
    },
  });
};
