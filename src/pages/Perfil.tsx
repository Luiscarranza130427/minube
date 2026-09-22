import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { formatearFecha, obtenerIniciales } from '../utils/formatters';
import { mostrarToastExito, mostrarToastError } from '../utils/alertas';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Alerta } from '../components/ui/Alerta';

export const Perfil: React.FC = () => {
  const { usuario, actualizarNombre, modoDemostracion } = useAuth();

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  useEffect(() => {
    if (usuario) {
      setNombreCompleto(usuario.nombre_completo);
    }
  }, [usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeExito(null);
    setMensajeError(null);

    if (!nombreCompleto.trim()) {
      setMensajeError('El nombre completo no puede estar vacío.');
      mostrarToastError('El nombre completo no puede estar vacío.');
      return;
    }

    setGuardando(true);
    const res = await actualizarNombre(nombreCompleto.trim());
    setGuardando(false);

    if (res.exito) {
      setMensajeExito('Nombre actualizado exitosamente.');
      mostrarToastExito('¡Perfil actualizado con éxito!');
      setTimeout(() => setMensajeExito(null), 4000);
    } else {
      setMensajeError(res.error || 'No se pudieron guardar los cambios.');
      mostrarToastError(res.error || 'No se pudieron guardar los cambios.');
    }
  };

  const iniciales = obtenerIniciales(nombreCompleto || usuario?.nombre_completo || 'MN');

  return (
    <div className="max-w-3xl space-y-6">
      {/* Título de la página */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Mi perfil
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Consulta y actualiza los datos personales de tu cuenta en la nube.
        </p>
      </div>

      {/* Alertas */}
      {mensajeExito && (
        <Alerta
          tipo="exito"
          mensaje={mensajeExito}
          alCerrar={() => setMensajeExito(null)}
        />
      )}

      {mensajeError && (
        <Alerta
          tipo="error"
          mensaje={mensajeError}
          alCerrar={() => setMensajeError(null)}
        />
      )}

      {/* Tarjeta de Resumen con Avatar */}
      <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-sky-500/20 shrink-0 select-none">
          {iniciales}
        </div>
        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">
              {usuario?.nombre_completo || 'Usuario'}
            </h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 w-fit mx-auto sm:mx-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Cuenta Activa
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" />
            {usuario?.correo}
          </p>
          <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Registrado el {formatearFecha(usuario?.fecha_registro)}
          </p>
        </div>
      </Card>

      {/* Formulario de Modificación de Datos */}
      <Card className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-800">Datos personales</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Por políticas académicas de seguridad, solo se permite modificar el nombre completo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre completo (Modificable) */}
          <Input
            etiqueta="Nombre completo"
            type="text"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            placeholder="Ingresa tu nombre completo"
            iconoIzquierda={<User className="w-4 h-4" />}
            ayuda="Este nombre se mostrará en los reportes y en el saludo del sistema."
            required
          />

          {/* Correo electrónico (Solo lectura) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 tracking-wide uppercase">
              Correo electrónico <span className="text-slate-400 font-normal lowercase">(no modificable)</span>
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={usuario?.correo || ''}
                disabled
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200 text-sm text-slate-500 cursor-not-allowed select-none"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              El correo está vinculado a las políticas RLS y Auth de Supabase.
            </p>
          </div>

          {/* Fecha de registro (Solo lectura) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 tracking-wide uppercase">
              Fecha de registro <span className="text-slate-400 font-normal lowercase">(no modificable)</span>
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formatearFecha(usuario?.fecha_registro)}
                disabled
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200 text-sm text-slate-500 cursor-not-allowed select-none"
              />
            </div>
          </div>

          {/* Botón Guardar cambios */}
          <div className="flex justify-end pt-3 border-t border-slate-100">
            <Button
              type="submit"
              variant="primary"
              size="md"
              cargando={guardando}
              icono={<Save className="w-4 h-4" />}
            >
              Guardar cambios
            </Button>
          </div>
        </form>
      </Card>

      {/* Nota técnica sobre Supabase */}
      <div className="p-4 bg-slate-100/70 border border-slate-200/80 rounded-2xl flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-semibold text-slate-800">
            Seguridad y Row Level Security (RLS)
          </p>
          <p>
            En Supabase, la tabla <code className="bg-white px-1.5 py-0.5 rounded text-sky-700 font-mono text-[11px] border border-slate-200">perfiles</code> tiene RLS activo vinculando <code className="bg-white px-1.5 py-0.5 rounded text-sky-700 font-mono text-[11px] border border-slate-200">auth.uid() = id</code> para garantizar que ningún usuario acceda o modifique información ajena.
          </p>
          {modoDemostracion && (
            <p className="text-sky-700 font-medium pt-1">
              • Ejecutando en Modo Académico con almacenamiento local para evaluación.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
