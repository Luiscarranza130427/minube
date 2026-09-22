import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoNubox from '../assets/nubox-logo.png';
import { User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alerta } from '../components/ui/Alerta';

export const Registro: React.FC = () => {
  const { registrarse } = useAuth();
  const navigate = useNavigate();

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [erroresCampos, setErroresCampos] = useState<{
    nombreCompleto?: string;
    correo?: string;
    contrasena?: string;
    confirmarContrasena?: string;
  }>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: typeof erroresCampos = {};

    // Todos los campos obligatorios
    if (!nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = 'El nombre completo es obligatorio';
    } else if (nombreCompleto.trim().length < 3) {
      nuevosErrores.nombreCompleto = 'Ingresa tu nombre y apellido completos';
    }

    // Correo válido
    if (!correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      nuevosErrores.correo = 'Ingresa un correo electrónico válido';
    }

    // Contraseña mínimo 6 caracteres
    if (!contrasena) {
      nuevosErrores.contrasena = 'La contraseña es obligatoria';
    } else if (contrasena.length < 6) {
      nuevosErrores.contrasena = 'La contraseña debe tener mínimo 6 caracteres';
    }

    // Las contraseñas deben coincidir
    if (!confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Debes confirmar tu contraseña';
    } else if (contrasena !== confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    setErroresCampos(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);

    if (!validarFormulario()) return;

    setCargando(true);
    const res = await registrarse(nombreCompleto.trim(), correo.trim(), contrasena);
    setCargando(false);

    if (res.exito) {
      navigate('/inicio');
    } else {
      setErrorGeneral(res.error || 'Ocurrió un error al registrar la cuenta.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 selection:bg-sky-500 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
        {/* Cabecera visual */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center">
            <img
              src={logoNubox}
              alt="Logo Nubox"
              className="h-16 w-auto max-w-[200px] object-contain drop-shadow-sm"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Crear cuenta en Nubox
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Regístrate para comenzar a gestionar tus archivos personales.
            </p>
          </div>
        </div>

        {/* Alerta de error general */}
        {errorGeneral && (
          <Alerta
            tipo="error"
            mensaje={errorGeneral}
            alCerrar={() => setErrorGeneral(null)}
          />
        )}

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            etiqueta="Nombre completo"
            type="text"
            placeholder="Ej: Carlos Arratia"
            value={nombreCompleto}
            onChange={(e) => {
              setNombreCompleto(e.target.value);
              if (erroresCampos.nombreCompleto) {
                setErroresCampos({ ...erroresCampos, nombreCompleto: undefined });
              }
            }}
            error={erroresCampos.nombreCompleto}
            iconoIzquierda={<User className="w-4 h-4" />}
            autoComplete="name"
          />

          <Input
            etiqueta="Correo electrónico"
            type="email"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
              if (erroresCampos.correo) {
                setErroresCampos({ ...erroresCampos, correo: undefined });
              }
            }}
            error={erroresCampos.correo}
            iconoIzquierda={<Mail className="w-4 h-4" />}
            autoComplete="email"
          />

          <Input
            etiqueta="Contraseña"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={contrasena}
            onChange={(e) => {
              setContrasena(e.target.value);
              if (erroresCampos.contrasena) {
                setErroresCampos({ ...erroresCampos, contrasena: undefined });
              }
            }}
            error={erroresCampos.contrasena}
            iconoIzquierda={<Lock className="w-4 h-4" />}
            permiteOcultarClave
            autoComplete="new-password"
          />

          <Input
            etiqueta="Confirmar contraseña"
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmarContrasena}
            onChange={(e) => {
              setConfirmarContrasena(e.target.value);
              if (erroresCampos.confirmarContrasena) {
                setErroresCampos({ ...erroresCampos, confirmarContrasena: undefined });
              }
            }}
            error={erroresCampos.confirmarContrasena}
            iconoIzquierda={<CheckCircle className="w-4 h-4" />}
            permiteOcultarClave
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-3"
            cargando={cargando}
            icono={<ArrowRight className="w-4 h-4" />}
          >
            Crear cuenta
          </Button>
        </form>

        {/* Enlace para volver a Iniciar Sesión */}
        <div className="pt-2 text-center text-xs sm:text-sm text-slate-500 border-t border-slate-100">
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/login"
            className="font-semibold text-sky-600 hover:text-sky-700 hover:underline transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};
