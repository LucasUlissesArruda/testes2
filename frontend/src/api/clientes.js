import axios from 'axios';

// A instância do Axios está correta
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// O Interceptor para adicionar o token está correto
api.interceptors.request.use(async (config) => {
  try {
    const tokenData = JSON.parse(localStorage.getItem('authToken'));
    if (tokenData?.access) {
      config.headers.Authorization = `Bearer ${tokenData.access}`;
    }
  } catch (e) {
    console.error("Erro ao processar o token:", e);
  }
  return config;
});


// --- FUNÇÃO DE LOGIN ---
export const login = async (username, password) => {
  const response = await api.post('/token/', {
    username,
    password,
  });
  if (response.data) {
    localStorage.setItem('authToken', JSON.stringify(response.data));
  }
  return response.data;
};

// --- FUNÇÕES DE CLIENTES (já existiam) ---
export const getClientes = async () => {
  const response = await api.get('/clientes/');
  return response.data;
};

export const createCliente = async (clienteData) => {
  const response = await api.post('/clientes/', clienteData);
  return response.data;
};

export const updateCliente = async (id, clienteData) => {
  const response = await api.put(`/clientes/${id}/`, clienteData);
  return response.data;
};

export const deleteCliente = async (id) => {
  await api.delete(`/clientes/${id}/`);
};

// --- (NOVO) FUNÇÃO DO DASHBOARD ---
export const getDashboard = async (ano, mes) => {
    let url = '/dashboard/';
    
    // Adiciona os filtros de data se eles existirem
    if (ano && mes) {
        url += `?ano=${ano}&mes=${mes}`;
    }
    
    const response = await api.get(url);
    return response.data;
};

// --- (NOVO) FUNÇÕES DE LANÇAMENTOS ---
export const getLancamentos = async (filtros = {}) => {
    // Constrói a query string para os filtros
    // Ex: { status: 'PENDENTE', tipo: 'PAGAR' }
    const params = new URLSearchParams(filtros).toString();
    
    const response = await api.get(`/lancamentos/?${params}`);
    return response.data;
};

export const getLancamentoDetalhe = async (id) => {
    const response = await api.get(`/lancamentos/${id}/`);
    return response.data;
};

export const createLancamento = async (lancamentoData) => {
    const response = await api.post('/lancamentos/', lancamentoData);
    return response.data;
};

export const updateLancamento = async (id, lancamentoData) => {
    // Usamos PATCH aqui, é melhor para atualizações parciais
    const response = await api.patch(`/lancamentos/${id}/`, lancamentoData);
    return response.data;
};

export const deleteLancamento = async (id) => {
    await api.delete(`/lancamentos/${id}/`);
};


export default api;