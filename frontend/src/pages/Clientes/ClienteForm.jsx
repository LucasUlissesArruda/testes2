import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, 
  CircularProgress 
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

function ClienteForm({ open, handleClose, cliente, onSave }) {
  const [formData, setFormData] = useState({
    razao_social: '',
    cnpj: '',
    responsavel_nome: '',
    responsavel_email: '',
    responsavel_telefone: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cliente) {
      setFormData(cliente);
    } else {
      setFormData({
        razao_social: '', cnpj: '', responsavel_nome: '', 
        responsavel_email: '', responsavel_telefone: ''
      });
    }
  }, [cliente, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave(formData);
    setIsLoading(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {cliente ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
        </Typography>

        <TextField name="razao_social" label="Razão Social" value={formData.razao_social} onChange={handleChange} fullWidth required margin="normal" />
        <TextField name="cnpj" label="CNPJ" value={formData.cnpj} onChange={handleChange} fullWidth required margin="normal" />
        <TextField name="responsavel_nome" label="Nome do Responsável" value={formData.responsavel_nome} onChange={handleChange} fullWidth required margin="normal" />
        <TextField name="responsavel_email" label="Email do Responsável" value={formData.responsavel_email} type="email" onChange={handleChange} fullWidth required margin="normal" />
        <TextField name="responsavel_telefone" label="Telefone (Opcional)" value={formData.responsavel_telefone || ''} onChange={handleChange} fullWidth margin="normal" />
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={handleClose} disabled={isLoading}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ClienteForm;