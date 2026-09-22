import Swal from 'sweetalert2';

/**
 * Toast flotante no intrusivo en la esquina superior derecha
 */
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#ffffff',
  color: '#1e293b',
  customClass: {
    popup: 'swal2-toast-nubox',
    timerProgressBar: 'swal2-toast-progress',
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

/**
 * Notificación rápida tipo Toast de éxito
 */
export const mostrarToastExito = (mensaje: string) => {
  return Toast.fire({
    icon: 'success',
    title: mensaje,
    iconColor: '#10b981',
  });
};

/**
 * Notificación rápida tipo Toast de error
 */
export const mostrarToastError = (mensaje: string) => {
  return Toast.fire({
    icon: 'error',
    title: mensaje,
    iconColor: '#f43f5e',
  });
};

/**
 * Notificación rápida tipo Toast de información
 */
export const mostrarToastInfo = (mensaje: string) => {
  return Toast.fire({
    icon: 'info',
    title: mensaje,
    iconColor: '#0ea5e9',
  });
};

/**
 * Modal estilizado de confirmación para eliminar archivos
 */
export const confirmarEliminacionArchivo = async (nombreArchivo: string): Promise<boolean> => {
  const resultado = await Swal.fire({
    title: '¿Eliminar archivo?',
    html: `
      <div style="text-align: center; margin-top: 0.5rem;">
        <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.75rem;">
          Esta acción no se puede deshacer. Se eliminará permanentemente:
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 0.75rem 1rem; font-weight: 600; color: #1e293b; font-size: 0.875rem; word-break: break-all;">
          ${nombreArchivo}
        </div>
      </div>
    `,
    icon: 'warning',
    iconColor: '#f43f5e',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: 'swal2-popup-nubox',
      title: 'swal2-title-nubox',
      confirmButton: 'swal2-btn-danger',
      cancelButton: 'swal2-btn-cancel',
      actions: 'swal2-actions-nubox',
    },
  });

  return resultado.isConfirmed;
};

/**
 * Modal estilizado de éxito (por ejemplo al subir archivo o actualizar perfil)
 */
export const mostrarModalExito = (titulo: string, mensaje: string) => {
  return Swal.fire({
    title: titulo,
    text: mensaje,
    icon: 'success',
    iconColor: '#0ea5e9',
    confirmButtonText: 'Entendido',
    buttonsStyling: false,
    customClass: {
      popup: 'swal2-popup-nubox',
      title: 'swal2-title-nubox',
      confirmButton: 'swal2-btn-primary',
    },
  });
};

/**
 * Modal estilizado de error
 */
export const mostrarModalError = (titulo: string, mensaje: string) => {
  return Swal.fire({
    title: titulo,
    text: mensaje,
    icon: 'error',
    iconColor: '#f43f5e',
    confirmButtonText: 'Aceptar',
    buttonsStyling: false,
    customClass: {
      popup: 'swal2-popup-nubox',
      title: 'swal2-title-nubox',
      confirmButton: 'swal2-btn-primary',
    },
  });
};
