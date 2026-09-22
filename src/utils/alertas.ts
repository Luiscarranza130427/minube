import swal from 'sweetalert';
import logoNubox from '../assets/nubox-logo.png';

/**
 * Notificación rápida de éxito (SweetAlert 1)
 */
export const mostrarToastExito = (mensaje: string) => {
  return swal({
    title: '¡Operación exitosa!',
    text: mensaje,
    icon: 'success',
    timer: 2000,
    buttons: [false],
  });
};

/**
 * Notificación rápida de error (SweetAlert 1)
 */
export const mostrarToastError = (mensaje: string) => {
  return swal({
    title: 'Ocurrió un error',
    text: mensaje,
    icon: 'error',
    timer: 3500,
    buttons: ['Aceptar'],
  });
};

/**
 * Notificación de información (SweetAlert 1)
 */
export const mostrarToastInfo = (mensaje: string) => {
  return swal({
    title: 'Información',
    text: mensaje,
    icon: 'info',
    timer: 2200,
    buttons: [false],
  });
};

/**
 * Notificación de advertencia (SweetAlert 1)
 */
export const mostrarToastAdvertencia = (mensaje: string) => {
  return swal({
    title: 'Atención',
    text: mensaje,
    icon: 'warning',
    timer: 2500,
    buttons: [false],
  });
};

/**
 * Modal de confirmación para eliminar archivos (SweetAlert 1)
 */
export const confirmarEliminacionArchivo = async (nombreArchivo: string): Promise<boolean> => {
  const valor = await swal({
    title: '¿Eliminar archivo?',
    text: `Esta acción no se puede deshacer. Se eliminará permanentemente:\n\n"${nombreArchivo}"`,
    icon: 'warning',
    buttons: ['Cancelar', 'Sí, eliminar'],
    dangerMode: true,
  });

  return Boolean(valor);
};

/**
 * Modal de confirmación para cerrar sesión (SweetAlert 1)
 */
export const confirmarCerrarSesion = async (): Promise<boolean> => {
  const valor = await swal({
    title: '¿Cerrar sesión?',
    text: 'Tu sesión en Nubox se cerrará de forma segura.',
    icon: logoNubox,
    buttons: ['Cancelar', 'Cerrar sesión'],
    dangerMode: true,
  });

  return Boolean(valor);
};

/**
 * Modal de éxito con botón
 */
export const mostrarModalExito = (titulo: string, mensaje: string) => {
  return swal({
    title: titulo,
    text: mensaje,
    icon: 'success',
    buttons: ['Entendido'],
  });
};

/**
 * Modal de error con botón
 */
export const mostrarModalError = (titulo: string, mensaje: string) => {
  return swal({
    title: titulo,
    text: mensaje,
    icon: 'error',
    buttons: ['Aceptar'],
    dangerMode: true,
  });
};
