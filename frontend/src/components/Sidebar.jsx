import React from 'react';
import { Drawer, Toolbar, List, ListItem, ListItemButton, ListItemText, Box, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People'; // Ícone para Clientes
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Ícone para Financeiro
import AssessmentIcon from '@mui/icons-material/Assessment'; // Ícone para Relatórios

const drawerWidth = 240;

function Sidebar() {
  const navigate = useNavigate();

  // Define os itens do menu
  const menuItems = [
    { 
      text: 'Clientes', 
      icon: <PeopleIcon />, 
      path: '/clientes' 
    },
    { 
      text: 'Lançamentos', 
      icon: <AttachMoneyIcon />, 
      path: '/financeiro' 
    },
    { 
      text: 'Dashboard', 
      icon: <AssessmentIcon />, 
      path: '/relatorios' 
    },
  ];

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
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;