import Swal from 'sweetalert2';
import logoNubox from '../assets/nubox-logo.png';

/**
 * Toast base de SweetAlert2 con diseño ultra-moderno Nubox
 */
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  showCancelButton: false,
  timer: 3500,
  timerProgressBar: true,
  background: '#ffffff',
  color: '#0f172a',
  customClass: {
    popup: 'swal2-toast-nubox',
    container: 'swal2-toast-container-nubox',
    timerProgressBar: 'swal2-toast-progress-nubox',
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

/**
 * Genera el HTML enriquecido para un Toast con el logotipo oficial de Nubox
 */
const generarHtmlToast = (
  mensaje: string,
  tipo: 'exito' | 'error' | 'info' | 'advertencia',
  subtitulo: string = 'Nubox Cloud'
) => {
  const configTipo = {
    exito: {
      colorBadge: '#10b981',
      iconoSvg: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
      fondoBadge: '#ecfdf5',
      bordeBadge: '#a7f3d0',
      label: 'ÉXITO',
    },
    error: {
      colorBadge: '#f43f5e',
      iconoSvg: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
      fondoBadge: '#fff1f2',
      bordeBadge: '#fecdd3',
      label: 'ERROR',
    },
    info: {
      colorBadge: '#0ea5e9',
      iconoSvg: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
      fondoBadge: '#f0f9ff',
      bordeBadge: '#bae6fd',
      label: 'INFORMACIÓN',
    },
    advertencia: {
      colorBadge: '#f59e0b',
      iconoSvg: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
      fondoBadge: '#fffbeb',
      bordeBadge: '#fde68a',
      label: 'AVISO',
    },
  }[tipo];

  return `
    <div class="swal-custom-toast-inner">
      <div class="swal-custom-toast-avatar">
        <img src="${logoNubox}" alt="Nubox" class="swal-custom-toast-logo" />
        <span class="swal-custom-toast-dot" style="background-color: ${configTipo.colorBadge};"></span>
      </div>
      <div class="swal-custom-toast-content">
        <div class="swal-custom-toast-header">
          <span class="swal-custom-toast-brand">${subtitulo}</span>
          <span class="swal-custom-toast-badge" style="color: ${configTipo.colorBadge}; background-color: ${configTipo.fondoBadge}; border-color: ${configTipo.bordeBadge};">
            ${configTipo.iconoSvg}
            <span>${configTipo.label}</span>
          </span>
        </div>
        <div class="swal-custom-toast-message">${mensaje}</div>
      </div>
    </div>
  `;
};

/**
 * Notificación Toast de ÉXITO personalizada con logo
 */
export const mostrarToastExito = (mensaje: string, subtitulo?: string) => {
  return Toast.fire({
    html: generarHtmlToast(mensaje, 'exito', subtitulo),
  });
};

/**
 * Notificación Toast de ERROR personalizada con logo
 */
export const mostrarToastError = (mensaje: string, subtitulo?: string) => {
  return Toast.fire({
    html: generarHtmlToast(mensaje, 'error', subtitulo),
  });
};

/**
 * Notificación Toast de INFORMACIÓN personalizada con logo
 */
export const mostrarToastInfo = (mensaje: string, subtitulo?: string) => {
  return Toast.fire({
    html: generarHtmlToast(mensaje, 'info', subtitulo),
  });
};

/**
 * Notificación Toast de ADVERTENCIA personalizada con logo
 */
export const mostrarToastAdvertencia = (mensaje: string, subtitulo?: string) => {
  return Toast.fire({
    html: generarHtmlToast(mensaje, 'advertencia', subtitulo),
  });
};

/**
 * Modal estilizado de confirmación para eliminar archivos (con logo oficial)
 */
export const confirmarEliminacionArchivo = async (nombreArchivo: string): Promise<boolean> => {
  const resultado = await Swal.fire({
    html: `
      <div class="swal-custom-modal-wrap">
        <div class="swal-custom-modal-logo-container">
          <div class="swal-custom-modal-logo-badge">
            <img src="${logoNubox}" alt="Nubox Cloud" class="swal-custom-modal-logo-img" />
          </div>
        </div>
        <h3 class="swal-custom-modal-title">¿Eliminar archivo?</h3>
        <p class="swal-custom-modal-subtitle">
          Esta acción no se puede deshacer. El archivo se eliminará de forma permanente de tu nube:
        </p>
        <div class="swal-custom-modal-filebox">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          <span class="swal-custom-modal-filename">${nombreArchivo}</span>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar archivo',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: 'swal2-modal-nubox',
      confirmButton: 'swal2-btn-modal-danger',
      cancelButton: 'swal2-btn-modal-cancel',
      actions: 'swal2-actions-modal-nubox',
    },
  });

  return resultado.isConfirmed;
};

/**
 * Modal de confirmación para cerrar sesión (con logo oficial)
 */
export const confirmarCerrarSesion = async (): Promise<boolean> => {
  const resultado = await Swal.fire({
    html: `
      <div class="swal-custom-modal-wrap">
        <div class="swal-custom-modal-logo-container">
          <div class="swal-custom-modal-logo-badge">
            <img src="${logoNubox}" alt="Nubox Cloud" class="swal-custom-modal-logo-img" />
          </div>
        </div>
        <h3 class="swal-custom-modal-title">¿Cerrar sesión en Nubox?</h3>
        <p class="swal-custom-modal-subtitle">
          Tu sesión se cerrará de forma segura. Tendrás que iniciar sesión nuevamente para acceder a tus archivos.
        </p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Cerrar sesión',
    cancelButtonText: 'Permanecer conectado',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: 'swal2-modal-nubox',
      confirmButton: 'swal2-btn-modal-danger',
      cancelButton: 'swal2-btn-modal-cancel',
      actions: 'swal2-actions-modal-nubox',
    },
  });

  return resultado.isConfirmed;
};

/**
 * Modal estilizado de éxito con logotipo
 */
export const mostrarModalExito = (titulo: string, mensaje: string) => {
  return Swal.fire({
    html: `
      <div class="swal-custom-modal-wrap">
        <div class="swal-custom-modal-logo-container">
          <div class="swal-custom-modal-logo-badge">
            <img src="${logoNubox}" alt="Nubox Cloud" class="swal-custom-modal-logo-img" />
          </div>
        </div>
        <h3 class="swal-custom-modal-title">${titulo}</h3>
        <p class="swal-custom-modal-subtitle">${mensaje}</p>
      </div>
    `,
    confirmButtonText: 'Entendido',
    buttonsStyling: false,
    customClass: {
      popup: 'swal2-modal-nubox',
      confirmButton: 'swal2-btn-modal-primary',
      actions: 'swal2-actions-modal-nubox',
    },
  });
};

/**
 * Modal estilizado de error con logotipo
 */
export const mostrarModalError = (titulo: string, mensaje: string) => {
  return Swal.fire({
    html: `
      <div class="swal-custom-modal-wrap">
        <div class="swal-custom-modal-logo-container">
          <div class="swal-custom-modal-logo-badge error-badge">
            <img src="${logoNubox}" alt="Nubox Cloud" class="swal-custom-modal-logo-img" />
          </div>
        </div>
        <h3 class="swal-custom-modal-title" style="color: #e11d48;">${titulo}</h3>
        <p class="swal-custom-modal-subtitle">${mensaje}</p>
      </div>
    `,
    confirmButtonText: 'Aceptar',
    buttonsStyling: false,
    customClass: {
      popup: 'swal2-modal-nubox',
      confirmButton: 'swal2-btn-modal-primary',
      actions: 'swal2-actions-modal-nubox',
    },
  });
};
