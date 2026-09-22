import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ArchivosProvider } from './context/ArchivosContext';
import { AppRouter } from './router/AppRouter';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ArchivosProvider>
        <AppRouter />
      </ArchivosProvider>
    </AuthProvider>
  );
};

export default App;
