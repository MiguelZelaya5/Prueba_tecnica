import { useState } from 'react';
import { api } from '../services/api';

export default function RejectModal({ id, onClose, onSuccess }: { id: number, onClose: () => void, onSuccess: () => void }) {
  const [comments, setComments] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.patch(`/requisitions/${id}/reject`, { adminComments: comments });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-red-600">Rechazar Solicitud</h3>
        <textarea placeholder="Motivo de rechazo (Obligatorio)" required value={comments} onChange={e => setComments(e.target.value)} className="w-full border p-2 mb-4 rounded h-24" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 border rounded">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">Rechazar</button>
        </div>
      </form>
    </div>
  );
}