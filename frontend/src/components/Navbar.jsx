
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { onLogout } = useAuth();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: (theme) => theme.shadows[2]
      }}
    >
      <Toolbar>
        <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1 }}>
          Santo BPO
        </Typography>
        <Button color="inherit" onClick={onLogout}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;