import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const LayoutPrincipal: React.FC = () => {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50/60 flex text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      {/* Sidebar fijo / colapsable */}
      <Sidebar
        abiertoMovil={menuMovilAbierto}
        alCerrarMovil={() => setMenuMovilAbierto(false)}
      />

      {/* Contenedor principal de contenidos */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header alAbrirMovil={() => setMenuMovilAbierto(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
