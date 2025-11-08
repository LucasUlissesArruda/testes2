import React, { useEffect, useState } from 'react';
import { 
  getClientes, createCliente, updateCliente, deleteCliente 
} from '../../api/api.js';
import ClienteForm from './ClienteForm.jsx';

import { 
  Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, Box, IconButton, Tooltip, Toolbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ClientesList() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const fetchClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (err) {
      setError('Falha ao carregar os clientes. Verifique o servidor e se você está logado.');
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleOpenModal = (cliente = null) => {
    setClienteSelecionado(cliente);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClienteSelecionado(null);
  };

  const handleSave = async (clienteData) => {
    try {
      if (clienteSelecionado) {
        await updateCliente(clienteSelecionado.id, clienteData);
      } else {
        await createCliente(clienteData);
      }
      fetchClientes();
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar cliente", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteCliente(id);
        fetchClientes();
      } catch (err) {
        console.error("Erro ao deletar cliente", err);
      }
    }
  };

  return (
    <>
      <Paper sx={{ padding: 3, borderRadius: '10px', boxShadow: (theme) => theme.shadows[2] }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">
            Clientes
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
          >
            Adicionar Cliente
          </Button>
        </Box>

        {error && <Typography color="error" sx={{ my: 2 }}>{error}</Typography>}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Razão Social</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>CNPJ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Responsável</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <TableRow hover key={cliente.id}>
                    <TableCell>{cliente.razao_social}</TableCell>
                    <TableCell>{cliente.cnpj}</TableCell>
                    <TableCell>{cliente.responsavel_nome}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleOpenModal(cliente)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton onClick={() => handleDelete(cliente.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {error ? 'Erro ao carregar dados.' : 'Nenhum cliente cadastrado.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ClienteForm 
        open={isModalOpen}
        handleClose={handleCloseModal}
        cliente={clienteSelecionado}
        onSave={handleSave}
      />
    </>
  );
}

export default ClientesList;