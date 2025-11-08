import api from './api';

/**
 * Busca a lista de lançamentos, com filtros.
 * @param {object} filtros - Opcional. Ex: { status: 'PENDENTE', tipo: 'PAGAR' }
 */
export const getLancamentos = async (filtros = {}) => {
  // Constrói a query string para os filtros
  // A nossa API backend já suporta isto (ex: /api/lancamentos/?status=PENDENTE)
  const params = new URLSearchParams(filtros);
  
  try {
    const response = await api.get(`/lancamentos/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar lançamentos:", error);
    throw error;
  }
};

/**
 * Busca um único lançamento pelo ID.
 */
export const getLancamentoDetalhe = async (id) => {
  try {
    const response = await api.get(`/lancamentos/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar lançamento ${id}:`, error);
    throw error;
  }
};

/**
 * Cria um novo lançamento.
 */
export const createLancamento = async (lancamentoData) => {
  try {
    const response = await api.post('/lancamentos/', lancamentoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar lançamento:", error);
    throw error;
  }
};

/**
 * Atualiza um lançamento (parcialmente).
 * Usamos PATCH para enviar apenas os campos alterados (ex: só o status).
 */
export const updateLancamento = async (id, lancamentoData) => {
  try {
    const response = await api.patch(`/lancamentos/${id}/`, lancamentoData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar lançamento ${id}:`, error);
    throw error;
  }
};

/**
 * Apaga um lançamento.
 */
export const deleteLancamento = async (id) => {
  try {
    await api.delete(`/lancamentos/${id}/`);
  } catch (error) {
    console.error(`Erro ao apagar lançamento ${id}:`, error);
    throw error;
  }
};