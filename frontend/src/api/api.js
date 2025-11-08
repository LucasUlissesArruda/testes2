import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

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

export default api;