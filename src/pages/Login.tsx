import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import logoNubox from '../assets/nubox-logo.png';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alerta } from '../components/ui/Alerta';

export const Login: React.FC = () => {
  const { iniciarSesion, modoDemostracion } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('carlos.arratia@ejemplo.edu.pe');
  const [contrasena, setContrasena] = useState('123456');
  const [cargando, setCargando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [erroresCampos, setErroresCampos] = useState<{ correo?: string; contrasena?: string }>({});

  const validarFormulario = (): boolean => {
    const nuevosErrores: { correo?: string; contrasena?: string } = {};

    if (!correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      nuevosErrores.correo = 'Ingresa un correo electrónico válido';
    }

    if (!contrasena) {
      nuevosErrores.contrasena = 'La contraseña es obligatoria';
    } else if (contrasena.length < 6) {
      nuevosErrores.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErroresCampos(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);

    if (!validarFormulario()) return;

    setCargando(true);
    const res = await iniciarSesion(correo, contrasena);
    setCargando(false);

    if (res.exito) {
      navigate('/inicio');
    } else {
      setErrorGeneral(res.error || 'Credenciales inválidas. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 selection:bg-sky-500 selection:text-white">
      {/* Contenedor central */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
        {/* Cabecera / Identidad visual con Logo */}
        <div className="text-center space-y-3 pb-1">
          <div className="flex items-center justify-center">
            <img
              src={logoNubox}
              alt="Nubox"
              className="h-20 w-auto object-contain drop-shadow-md transition-transform hover:scale-105 duration-300"
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Nubox
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Accede a tus archivos almacenados en la nube
            </p>
          </div>
        </div>

        {/* Mensaje de error general si falló la autenticación */}
        {errorGeneral && (
          <Alerta
            tipo="error"
            mensaje={errorGeneral}
            alCerrar={() => setErrorGeneral(null)}
          />
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            etiqueta="Correo electrónico"
            type="email"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
              if (erroresCampos.correo) setErroresCampos({ ...erroresCampos, correo: undefined });
            }}
            error={erroresCampos.correo}
            iconoIzquierda={<Mail className="w-4 h-4" />}
            autoComplete="email"
          />

          <Input
            etiqueta="Contraseña"
            type="password"
            placeholder="••••••••"
            value={contrasena}
            onChange={(e) => {
              setContrasena(e.target.value);
              if (erroresCampos.contrasena) setErroresCampos({ ...erroresCampos, contrasena: undefined });
            }}
            error={erroresCampos.contrasena}
            iconoIzquierda={<Lock className="w-4 h-4" />}
            permiteOcultarClave
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            cargando={cargando}
            icono={<ArrowRight className="w-4 h-4" />}
          >
            Iniciar sesión
          </Button>
        </form>

        {/* Información académica de ayuda */}
        {modoDemostracion && (
          <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl text-xs text-sky-800 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Modo Académico:</span> Puedes iniciar sesión directamente con los datos precargados para explorar todas las vistas y funciones.
            </div>
          </div>
        )}

        {/* Nota de sistema privado */}
        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-100">
          Sistema privado • Acceso restringido únicamente a usuarios autorizados
        </div>
      </div>
    </div>
  );
};
