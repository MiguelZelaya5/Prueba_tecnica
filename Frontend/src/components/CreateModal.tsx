import { useState } from 'react';
import { api } from '../services/api';

export default function CreateModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [priority, setPriority] = useState('0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/requisitions', { title, estimatedAmount: parseFloat(amount), priority: parseInt(priority) });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Nueva Requisición</h3>
        <input placeholder="Título" required value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 mb-3 rounded" />
        <input type="number" step="0.01" min="0.01" placeholder="Monto Estimado" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full border p-2 mb-3 rounded" />
        <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border p-2 mb-4 rounded">
          <option value="0">Baja</option>
          <option value="1">Media</option>
          <option value="2">Alta</option>
        </select>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 border rounded">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>
      </form>
    </div>
  );
}