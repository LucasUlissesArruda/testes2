import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import {
  TextField, Button, Container, Typography, Box, CircularProgress,
  Alert, InputAdornment, IconButton, Paper
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { onLogin, user } = useAuth();

  if (user) {
    return <Navigate to="/clientes" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    const success = await onLogin(username, password);
    if (!success) {
      setError('Usuário ou senha inválidos. Tente novamente.');
    }
    setIsLoading(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper 
        elevation={2} 
        sx={{ 
          padding: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: '10px',
        }}
      >
        <LockOutlined sx={{ m: 1, bgcolor: 'primary.main', p: 1, borderRadius: '50%', color: 'white' }} />
        
        <Typography component="h1" variant="h5">
          Acesso ao Sistema
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          <TextField
            variant="standard" margin="normal" required fullWidth id="username" label="Usuário" name="username"
            autoFocus value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading}
          />
          <TextField
            variant="standard" margin="normal" required fullWidth name="password" label="Senha"
            type={showPassword ? 'text' : 'password'} id="password" value={password}
            onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ position: 'relative', mt: 4, mb: 2 }}>
            <Button type="submit" fullWidth variant="contained" disabled={isLoading}>
              Entrar
            </Button>
            {isLoading && (
              <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }}/>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;