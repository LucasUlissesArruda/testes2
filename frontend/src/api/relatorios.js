// frontend/src/api/relatorios.js

import api from './api'; // Importa a instância principal do Axios

/**
 * Busca os dados do dashboard.
 * Aceita filtros de ano e mês.
 * @param {object} filtros - Opcional. Ex: { ano: 2025, mes: 11 }
 */
export const getDashboard = async (filtros = {}) => {
  const { ano, mes } = filtros;
  let url = '/dashboard/';

  // Adiciona os filtros de data se eles existirem
  if (ano && mes) {
    const params = new URLSearchParams({ ano, mes });
    url += `?${params.toString()}`;
  }

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    throw error;
  }
};

// Aqui podem entrar outras funções de relatórios (PDF, Excel) no futuro
