import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { Requisition } from "../types";
import { CheckCircle, XCircle, Plus, Search, LogOut } from 'lucide-react';
import CreateModal from '../components/CreateModal';
import RejectModal from '../components/RejectModal';

const STATUS_MAP = ['Pendiente', 'Aprobado', 'Rechazado'];
const PRIORITY_MAP = ['Baja', 'Media', 'Alta']; // Mapeo para el enum de prioridad

export default function Dashboard() {
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Estados para los modales
  const [showCreate, setShowCreate] = useState(false);
  const [rejectId, setRejectId] = useState<number | null>(null);

  const fetchRequisitions = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      
      const { data } = await api.get(`/requisitions?${params.toString()}`);
      setRequisitions(data);
    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

  useEffect(() => {
    fetchRequisitions();
  }, [statusFilter]);

  // Función directa para aprobar (no requiere modal)
  const handleApprove = async (id: number) => {
    try {
      await api.patch(`/requisitions/${id}/approve`);
      fetchRequisitions(); // Recargar la tabla
    } catch (error) {
      console.error("Error aprobando", error);
    }
  };

  // KPIs
  const totalAmount = requisitions.reduce((acc, req) => acc + (req.estimatedAmount || 0), 0);
  const pendingCount = requisitions.filter(r => r.status === 0).length;

  // Filtro local por texto
  const filteredData = requisitions.filter(r => 
    r.title?.toLowerCase().includes(search.toLowerCase()) || 
    r.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard de Requisiciones</h1>
          <p className="text-gray-600">Sesión iniciada como: <span className="font-semibold">{role}</span></p>
        </div>
        
        <div className="flex gap-4">
          {role === 'Empleado' && (
            <button 
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus size={18} /> Crear Solicitud
            </button>
          )}
          <button 
            onClick={logout}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-300"
          >
            <LogOut size={18} /> Salir
          </button>
        </div>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white shadow rounded border-t-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Solicitudes</p>
          <p className="text-2xl font-bold">{requisitions.length}</p>
        </div>
        <div className="p-4 bg-white shadow rounded border-t-4 border-green-500">
          <p className="text-gray-500 text-sm">Monto Total</p>
          <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white shadow rounded border-t-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Pendientes</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" placeholder="Buscar por código o título..." 
            className="w-full pl-10 pr-4 py-2 border rounded shadow-sm"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="border py-2 px-4 rounded shadow-sm bg-white" 
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los Estados</option>
          <option value="0">Pendientes</option>
          <option value="1">Aprobados</option>
          <option value="2">Rechazados</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Código</th>
              <th className="p-4 font-semibold text-gray-600">Título</th>
              <th className="p-4 font-semibold text-gray-600">Creador</th>
              <th className="p-4 font-semibold text-gray-600">Monto</th>
              <th className="p-4 font-semibold text-gray-600">Prioridad</th>
              <th className="p-4 font-semibold text-gray-600">Fecha</th>
              <th className="p-4 font-semibold text-gray-600">Estado</th>
              <th className="p-4 font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">No hay solicitudes encontradas.</td>
              </tr>
            ) : (
              filteredData.map(req => (
                <tr key={req.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{req.code}</td>
                  <td className="p-4 text-gray-700">{req.title}</td>
                  <td className="p-4 text-gray-700">{req.creator || 'N/A'}</td>
                  <td className="p-4 text-gray-700">${req.estimatedAmount?.toFixed(2)}</td>
                  <td className="p-4 text-gray-700">{PRIORITY_MAP[req.priority] || 'N/A'}</td>
                  <td className="p-4 text-gray-700">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      req.status === 0 ? 'bg-yellow-100 text-yellow-800' :
                      req.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {STATUS_MAP[req.status]}
                    </span>
                  </td>
                  <td className="p-4">
                    {role === 'Administrador' && req.status === 0 ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApprove(req.id)}
                          title="Aprobar"
                          className="text-green-600 hover:bg-green-100 p-1.5 rounded transition-colors"
                        >
                          <CheckCircle size={20}/>
                        </button>
                        <button 
                          onClick={() => setRejectId(req.id)}
                          title="Rechazar"
                          className="text-red-600 hover:bg-red-100 p-1.5 rounded transition-colors"
                        >
                          <XCircle size={20}/>
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Renderizado de Modales */}
      {showCreate && (
        <CreateModal 
          onClose={() => setShowCreate(false)} 
          onSuccess={fetchRequisitions} 
        />
      )}
      
      {rejectId && (
        <RejectModal 
          id={rejectId} 
          onClose={() => setRejectId(null)} 
          onSuccess={fetchRequisitions} 
        />
      )}
    </div>
  );
}