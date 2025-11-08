
import React from 'react';
import { Drawer, Toolbar, List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

function Sidebar() {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/clientes')}>
              <ListItemText primary="Clientes" />
            </ListItemButton>
          </ListItem>
          {}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;