import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './context/ThemeContext.jsx';
import Box from '@mui/material/Box';
import { Toolbar } from '@mui/material';

// Nossas Páginas
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Login from './pages/Login.jsx';
import ClientesList from './pages/Clientes/ClientesList.jsx';
import FinanceiroList from './pages/Financeiro/FinanceiroList.jsx'; // (Já estava importado)
import RelatorioDashboard from './pages/Relatorios/RelatorioDashboard.jsx'; // (Já estava importado)
// (Vamos precisar das rotas de formulário também)
import ClienteForm from './pages/Clientes/ClienteForm.jsx';
import FinanceiroForm from './pages/Financeiro/FinanceiroForm.jsx';

// Layout Principal (com menus)
const MainLayout = ({ children }) => (
  <Box sx={{ display: 'flex' }}>
    <Navbar />
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Toolbar /> {/* Espaçador para o Navbar */}
      {children}
    </Box>
  </Box>
);

// Rota protegida
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Componente principal de rotas
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Rota Raiz - Redireciona para o dashboard */}
      <Route 
        path="/"
        element={
          <PrivateRoute>
            <Navigate to="/relatorios" />
          </PrivateRoute>
        }
      />

      {/* Rotas de Clientes */}
      <Route 
        path="/clientes" 
        element={
          <PrivateRoute>
            <MainLayout>
              <ClientesList />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/clientes/novo" 
        element={<PrivateRoute><MainLayout><ClienteForm /></MainLayout></PrivateRoute>} 
      />
      <Route 
        path="/clientes/:id" 
        element={<PrivateRoute><MainLayout><ClienteForm /></MainLayout></PrivateRoute>} 
      />

      {/* --- ROTAS ADICIONADAS --- */}

      {/* Rotas de Financeiro */}
      <Route 
        path="/financeiro" 
        element={
          <PrivateRoute>
            <MainLayout>
              <FinanceiroList />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/financeiro/novo" 
        element={<PrivateRoute><MainLayout><FinanceiroForm /></MainLayout></PrivateRoute>} 
      />
      <Route 
        path="/financeiro/:id" 
        element={<PrivateRoute><MainLayout><FinanceiroForm /></MainLayout></PrivateRoute>} 
      />

      {/* Rota de Relatórios (Dashboard) */}
      <Route 
        path="/relatorios" 
        element={
          <PrivateRoute>
            <MainLayout>
              <RelatorioDashboard />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      
      {/* Rota "apanha-tudo" - Se não encontrar, volta ao dashboard */}
      <Route path="*" element={<Navigate to="/relatorios" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;