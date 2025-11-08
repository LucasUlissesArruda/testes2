// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx'; // Ou o nome do teu componente principal, ex: './App.jsx'
import { BrowserRouter } from 'react-router-dom';

// --- Importações importantes para o MUI ---
import { ThemeProvider, createTheme } from '@mui/material/styles'; 
import CssBaseline from '@mui/material/CssBaseline'; 
// --- Fim das importações MUI ---

import { AuthProvider } from './context/AuthContext.jsx'; 

// Cria um tema MUI básico (podes personalizar depois)
const theme = createTheme({
  // Adiciona aqui personalizações se quiseres
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* --- Envolve a App com o Tema e Estilos Base --- */}
        <ThemeProvider theme={theme}> 
          <CssBaseline /> 
          <App />
        </ThemeProvider>
        {/* --- Fim do envolvimento --- */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);