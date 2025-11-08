import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createCliente, getClienteDetalhe, updateCliente } from '../../api/clientes';
import { Box, Typography, Paper, CircularProgress, TextField, Button } from '@mui/material';

const ClienteForm = () => {
  const [formData, setFormData] = useState({
    razao_social: '',
    cnpj: '',
    responsavel_nome: '',
    responsavel_email: '',
    responsavel_telefone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams(); // Pega o ID do URL (se estiver a editar)
  const navigate = useNavigate(); // Para redirecionar após salvar

  // Se existir um ID, busca os dados desse cliente para edição
  useEffect(() => {
    if (id) {
      setLoading(true);
      getClienteDetalhe(id)
        .then(data => {
          setFormData(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Erro ao carregar cliente.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (id) {
        // Modo Edição
        await updateCliente(id, formData);
      } else {
        // Modo Criação
        await createCliente(formData);
      }
      navigate('/clientes'); // Volta para a lista
    } catch (err) {
      setError('Erro ao salvar cliente. Verifique os campos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) return <CircularProgress />;

  return (
    <Box component={Paper} sx={{ p: 3 }} elevation={3}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Editar Cliente' : 'Novo Cliente'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Razão Social"
          name="razao_social"
          value={formData.razao_social}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="CNPJ"
          name="cnpj"
          value={formData.cnpj}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Nome do Responsável"
          name="responsavel_nome"
          value={formData.responsavel_nome}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email do Responsável"
          name="responsavel_email"
          type="email"
          value={formData.responsavel_email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Telefone do Responsável"
          name="responsavel_telefone"
          value={formData.responsavel_telefone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate('/clientes')}>
            Cancelar
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ClienteForm;