import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createLancamento, getLancamentoDetalhe, updateLancamento } from '../../api/financeiro';
import { getClientes } from '../../api/clientes'; // (Precisamos disto para o dropdown)
import { 
  Box, Typography, Paper, CircularProgress, TextField, Button, 
  Select, MenuItem, InputLabel, FormControl 
} from '@mui/material';

const FinanceiroForm = () => {
  const [formData, setFormData] = useState({
    cliente: '',
    descricao: '',
    valor: '0.00',
    data_vencimento: '',
    data_pagamento: '',
    tipo: 'PAGAR',
    status: 'PENDENTE',
  });
  const [clientes, setClientes] = useState([]); // Lista de clientes para o dropdown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  // Carrega os dados necessários (Clientes para o dropdown, e o Lançamento se estiver a editar)
  useEffect(() => {
    setLoading(true);
    // 1. Busca a lista de clientes para o dropdown
    const fetchClientes = getClientes().then(setClientes).catch(err => setError('Erro ao carregar clientes.'));

    // 2. Se estiver a editar (ID na URL), busca os dados do lançamento
    let fetchLancamento = Promise.resolve();
    if (id) {
      fetchLancamento = getLancamentoDetalhe(id)
        .then(data => {
          // Formata as datas para o formato YYYY-MM-DD que o input "date" espera
          setFormData({
            ...data,
            data_vencimento: data.data_vencimento || '',
            data_pagamento: data.data_pagamento || '',
          });
        })
        .catch(err => setError('Erro ao carregar lançamento.'));
    }
    
    // Espera que ambas as buscas terminem
    Promise.all([fetchClientes, fetchLancamento]).finally(() => setLoading(false));
    
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Prepara os dados para enviar (remove data_pagamento se não houver)
    const dataToSubmit = { ...formData };
    if (!dataToSubmit.data_pagamento) {
      dataToSubmit.data_pagamento = null;
    }

    try {
      if (id) {
        await updateLancamento(id, dataToSubmit);
      } else {
        await createLancamento(dataToSubmit);
      }
      navigate('/financeiro'); // Volta para a lista
    } catch (err) {
      setError('Erro ao salvar lançamento. Verifique os campos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error && !clientes.length) return <Typography color="error">{error}</Typography>; // Erro crítico

  return (
    <Box component={Paper} sx={{ p: 3 }} elevation={3}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Editar Lançamento' : 'Novo Lançamento'}
      </Typography>
      <form onSubmit={handleSubmit}>
        
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="cliente-label">Cliente</InputLabel>
          <Select
            labelId="cliente-label"
            id="cliente"
            name="cliente"
            value={formData.cliente}
            label="Cliente"
            onChange={handleChange}
          >
            <MenuItem value=""><em>Nenhum</em></MenuItem>
            {clientes.map((cli) => (
              <MenuItem key={cli.id} value={cli.id}>{cli.razao_social}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Descrição"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        
        <TextField
          label="Valor (R$)"
          name="valor"
          type="number"
          step="0.01"
          value={formData.valor}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="tipo-label">Tipo</InputLabel>
          <Select
            labelId="tipo-label"
            name="tipo"
            value={formData.tipo}
            label="Tipo"
            onChange={handleChange}
          >
            <MenuItem value="PAGAR">Contas a Pagar</MenuItem>
            <MenuItem value="RECEBER">Contas a Receber</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            name="status"
            value={formData.status}
            label="Status"
            onChange={handleChange}
          >
            <MenuItem value="PENDENTE">Pendente</MenuItem>
            <MenuItem value="ATRASADO">Atrasado</MenuItem>
            <MenuItem value="CANCELADO">Cancelado</MenuItem>
            <MenuItem value="PAGO">Pago (Contas a Pagar)</MenuItem>
            <MenuItem value="RECEBIDO">Recebido (Contas a Receber)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Data de Vencimento"
          name="data_vencimento"
          type="date"
          value={formData.data_vencimento}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
        />
        
        <TextField
          label="Data de Pagamento/Recebimento"
          name="data_pagamento"
          type="date"
          value={formData.data_pagamento}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          helperText="Deixe em branco se ainda não foi pago/recebido."
        />
        
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate('/financeiro')}>
            Cancelar
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default FinanceiroForm;