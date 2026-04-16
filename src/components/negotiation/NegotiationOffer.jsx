import React, { useState } from 'react';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const NegotiationOffer = ({ orderId, currentBid }) => {
  const [offer, setOffer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOffer = async (e) => {
    e.preventDefault();
    if (!offer || isNaN(offer)) return alert('Por favor ingresa un monto válido');

    setLoading(true);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        current_bid: parseFloat(offer),
        last_bid_at: new Date()
      });
      alert('Oferta enviada con éxito');
      setOffer('');
    } catch (error) {
      console.error("Error al actualizar la oferta:", error);
      alert('Hubo un error al enviar tu oferta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
      <h4 className="text-sm font-semibold text-slate-300 mb-2">Negociar Envío</h4>
      <form onSubmit={handleOffer} className="flex gap-2">
        <div className="relative flex-grow">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">S/</span>
          <input
            type="number"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder={currentBid || "Tu oferta"}
            className="w-full bg-slate-900 text-white pl-8 pr-4 py-2 rounded-md border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Ofertar'}
        </button>
      </form>
      <p className="text-[10px] text-slate-500 mt-2 italic">
        * El cliente recibirá tu notificación al instante.
      </p>
    </div>
  );
};

export default NegotiationOffer;
