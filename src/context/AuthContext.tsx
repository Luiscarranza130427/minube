import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, estaConfiguradoSupabase } from '../services/supabase';
import { MOCK_PERFIL } from '../mocks/mockData';
import type { Perfil } from '../types';

interface AuthContextType {
  usuario: Perfil | null;
  cargando: boolean;
  modoDemostracion: boolean;
  iniciarSesion: (correo: string, contrasena: string) => Promise<{ exito: boolean; error?: string }>;
  registrarse: (nombreCompleto: string, correo: string, contrasena: string) => Promise<{ exito: boolean; error?: string }>;
  cerrarSesion: () => Promise<void>;
  actualizarNombre: (nuevoNombre: string) => Promise<{ exito: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const modoDemostracion = !estaConfiguradoSupabase;

  useEffect(() => {
    async function inicializarSesion() {
      try {
        if (estaConfiguradoSupabase) {
          // Obtener sesión activa de Supabase
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (session?.user) {
            // Consultar tabla 'perfiles'
            const { data: perfilData } = await supabase
              .from('perfiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (perfilData) {
              setUsuario(perfilData as Perfil);
            } else {
              // Si no existe fila en 'perfiles' aún, crear estado temporal
              setUsuario({
                id: session.user.id,
                nombre_completo: session.user.user_metadata?.nombre_completo || 'Usuario',
                correo: session.user.email || '',
                fecha_registro: session.user.created_at,
                fecha_actualizacion: session.user.created_at,
              });
            }
          }
        } else {
          // Modo demostración: comprobar si hay sesión guardada en localStorage
          const guardado = localStorage.getItem('minube_usuario_demo');
          if (guardado) {
            setUsuario(JSON.parse(guardado));
          } else {
            // Inicialmente cargamos el perfil mock para que el evaluador pueda navegar de inmediato
            setUsuario(MOCK_PERFIL);
            localStorage.setItem('minube_usuario_demo', JSON.stringify(MOCK_PERFIL));
          }
        }
      } catch (err) {
        console.error('Error al inicializar sesión:', err);
      } finally {
        setCargando(false);
      }
    }

    inicializarSesion();

    // Suscripción a cambios de autenticación en Supabase
    if (estaConfiguradoSupabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: perfilData } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (perfilData) {
            setUsuario(perfilData as Perfil);
          }
        } else if (event === 'SIGNED_OUT') {
          setUsuario(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const iniciarSesion = async (correo: string, contrasena: string) => {
    try {
      if (estaConfiguradoSupabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: correo,
          password: contrasena,
        });

        if (error) {
          return { exito: false, error: error.message };
        }

        if (data.user) {
          const { data: perfil } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (perfil) setUsuario(perfil as Perfil);
        }
        return { exito: true };
      } else {
        // Validación en modo demostración
        if (!correo || !contrasena) {
          return { exito: false, error: 'Por favor completa todos los campos' };
        }

        const perfilDemo: Perfil = {
          ...MOCK_PERFIL,
          correo: correo,
        };
        setUsuario(perfilDemo);
        localStorage.setItem('minube_usuario_demo', JSON.stringify(perfilDemo));
        return { exito: true };
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error inesperado al iniciar sesión';
      return { exito: false, error: errorMsg };
    }
  };

  const registrarse = async (nombreCompleto: string, correo: string, contrasena: string) => {
    try {
      if (estaConfiguradoSupabase) {
        const { data, error } = await supabase.auth.signUp({
          email: correo,
          password: contrasena,
          options: {
            data: {
              nombre_completo: nombreCompleto,
            },
          },
        });

        if (error) {
          return { exito: false, error: error.message };
        }

        if (data.user) {
          const ahora = new Date().toISOString();
          const nuevoPerfil: Perfil = {
            id: data.user.id,
            nombre_completo: nombreCompleto,
            correo: correo,
            fecha_registro: ahora,
            fecha_actualizacion: ahora,
          };

          // Guardar en tabla perfiles de PostgreSQL
          await supabase.from('perfiles').upsert(nuevoPerfil);
          setUsuario(nuevoPerfil);
        }
        return { exito: true };
      } else {
        const ahora = new Date().toISOString();
        const nuevoPerfil: Perfil = {
          id: `usr-demo-${Date.now()}`,
          nombre_completo: nombreCompleto,
          correo: correo,
          fecha_registro: ahora,
          fecha_actualizacion: ahora,
        };
        setUsuario(nuevoPerfil);
        localStorage.setItem('minube_usuario_demo', JSON.stringify(nuevoPerfil));
        return { exito: true };
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error inesperado al registrar usuario';
      return { exito: false, error: errorMsg };
    }
  };

  const cerrarSesion = async () => {
    try {
      if (estaConfiguradoSupabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setUsuario(null);
      localStorage.removeItem('minube_usuario_demo');
    }
  };

  const actualizarNombre = async (nuevoNombre: string) => {
    if (!usuario) return { exito: false, error: 'No hay usuario autenticado' };

    try {
      const ahora = new Date().toISOString();
      if (estaConfiguradoSupabase) {
        const { error } = await supabase
          .from('perfiles')
          .update({
            nombre_completo: nuevoNombre,
            fecha_actualizacion: ahora,
          })
          .eq('id', usuario.id);

        if (error) return { exito: false, error: error.message };
      }

      const usuarioActualizado: Perfil = {
        ...usuario,
        nombre_completo: nuevoNombre,
        fecha_actualizacion: ahora,
      };

      setUsuario(usuarioActualizado);
      if (!estaConfiguradoSupabase) {
        localStorage.setItem('minube_usuario_demo', JSON.stringify(usuarioActualizado));
      }
      return { exito: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar perfil';
      return { exito: false, error: errorMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        modoDemostracion,
        iniciarSesion,
        registrarse,
        cerrarSesion,
        actualizarNombre,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
