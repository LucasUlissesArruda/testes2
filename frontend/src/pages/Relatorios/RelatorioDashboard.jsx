
// frontend/src/pages/Relatorios/RelatorioDashboard.jsx

import React, { useState, useEffect } from 'react';
import { getDashboard } from '../../api/relatorios'; // Importa a nossa função da API
import { Box, Typography, Paper, CircularProgress, Grid, TextField, Button } from '@mui/material';

// Um componente simples para mostrar os cartões de valores
const StatCard = ({ title, value, color = 'text.secondary' }) => (
  <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
    <Typography variant="h6" color={color}>{title}</Typography>
    <Typography variant="h4">
      {/* Formata o número como dinheiro (BRL) */}
      {typeof value === 'number' 
        ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : value}
    </Typography>
  </Paper>
);

const RelatorioDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para os filtros
  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  // Função para ir buscar os dados
  const fetchDashboardData = async (filtros) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboard(filtros);
      setData(response);
    } catch (err) {
      setError('Falha ao carregar dados. Tente fazer login novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para carregar os dados quando a página abre
  useEffect(() => {
    fetchDashboardData({ ano, mes });
  }, []); // O array vazio [] faz com que isto rode só uma vez

  // Handler para o botão de filtrar
  const handleFiltrar = () => {
    fetchDashboardData({ ano, mes });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!data) {
    return <Typography>Nenhum dado encontrado.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Financeiro ({data.periodo_referencia})
      </Typography>

      {/* Secção de Filtros */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Ano"
          type="number"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          size="small"
        />
        <TextField
          label="Mês"
          type="number"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleFiltrar}>Filtrar</Button>
      </Paper>

      {/* Secção de Balanço Total */}
      <Typography variant="h5" gutterBottom>Balanço Total (Acumulado)</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard title="Total a Receber" value={data.balanco_total.a_receber} color="green" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Total a Pagar" value={data.balanco_total.a_pagar} color="red" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Saldo Pendente Geral" value={data.balanco_total.saldo_geral_pendente} />
        </Grid>
      </Grid>

      {/* Secção de Previsão do Mês */}
      <Typography variant="h5" gutterBottom>Previsão do Mês ({data.periodo_referencia})</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard title="Novos a Receber" value={data.previsao_periodo.novos_a_receber} color="green" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Novos a Pagar" value={data.previsao_periodo.novos_a_pagar} color="red" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Saldo Previsto" value={data.previsao_periodo.saldo_previsto} />
        </Grid>
      </Grid>

      {/* Secção de Fluxo de Caixa do Mês */}
      <Typography variant="h5" gutterBottom>Fluxo de Caixa do Mês ({data.periodo_referencia})</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <StatCard title="Total Recebido" value={data.fluxo_caixa_periodo.total_recebido} color="blue" />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard title="Total Pago" value={data.fluxo_caixa_periodo.total_pago} color="orange" />
        </Grid>
      </Grid>
      
    </Box>
  );
};

export default RelatorioDashboard;