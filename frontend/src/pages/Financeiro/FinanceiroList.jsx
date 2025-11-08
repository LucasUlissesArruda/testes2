
// frontend/src/pages/Financeiro/FinanceiroList.jsx
import React, { useState, useEffect } from 'react';
import { getLancamentos, deleteLancamento } from '../../api/financeiro'; // Funções da nossa API
import { 
  Box, Typography, Paper, CircularProgress, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
// (Assumindo que o react-router-dom está a ser usado para navegação)
import { Link } from 'react-router-dom'; 

// Função para formatar a data
const formatDate = (dateString) => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  // Adiciona o fuso horário para corrigir o dia (problema comum de JS)
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString('pt-BR');
}

// Função para formatar o valor
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const FinanceiroList = () => {
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para carregar os dados
  const fetchLancamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Por enquanto, busca tudo. No futuro, podemos adicionar filtros aqui.
      const data = await getLancamentos();
      setLancamentos(data);
    } catch (err) {
      setError('Falha ao carregar lançamentos.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect para carregar os dados quando a página abre
  useEffect(() => {
    fetchLancamentos();
  }, []);

  // Handler para apagar
  const handleDelete = async (id) => {
    if (window.confirm('Tem a certeza que quer apagar este lançamento?')) {
      try {
        await deleteLancamento(id);
        // Recarrega a lista após apagar
        fetchLancamentos(); 
      } catch (err) {
        alert('Erro ao apagar lançamento.');
      }
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Lançamentos Financeiros</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          component={Link} // (Assumindo que a rota /financeiro/novo existe)
          to="/financeiro/novo"
        >
          Novo Lançamento
        </Button>
      </Box>

      {/* TODO: Adicionar Filtros aqui (Status, Tipo, Data) */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell>Pagamento</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lancamentos.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.descricao}</TableCell>
                <TableCell style={{ color: row.tipo === 'PAGAR' ? 'red' : 'green' }}>
                  {formatCurrency(row.valor)}
                </TableCell>
                <TableCell>{row.tipo}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{formatDate(row.data_vencimento)}</TableCell>
                <TableCell>{formatDate(row.data_pagamento)}</TableCell>
                <TableCell>
                  <IconButton 
                    component={Link} 
                    to={`/financeiro/${row.id}`} // (Assumindo que a rota de edição existe)
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FinanceiroList;