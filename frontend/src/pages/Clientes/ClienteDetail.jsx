import { useEffect, useState } from "react";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../../api/clientes";
import ClienteForm from "./ClienteForm";
import ClientesList from "./ClientesList";

export default function ClienteDetail() {
  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    const res = await getClientes();
    setClientes(res.data);
  };

  const handleSave = async (cliente) => {
    if (clienteEditando) {
      await updateCliente(clienteEditando.id, cliente);
      setClienteEditando(null);
    } else {
      await createCliente(cliente);
    }
    carregarClientes();
  };

  const handleDelete = async (id) => {
    await deleteCliente(id);
    carregarClientes();
  };

  return (
    <div>
      <h2>Gerenciamento de Clientes</h2>
      <ClienteForm
        onSave={handleSave}
        clienteEditando={clienteEditando}
        onCancel={() => setClienteEditando(null)}
      />
      <ClientesList
        clientes={clientes}
        onEdit={setClienteEditando}
        onDelete={handleDelete}
      />
    </div>
  );
}

