import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc 
} from 'firebase/firestore';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suscripción a logs de seguridad
    const qLogs = query(collection(db, 'security_logs'), orderBy('timestamp', 'desc'));
    const unsubscribeLogs = onSnapshot(qLogs, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Suscripción a pedidos activos
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubscribeLogs();
      unsubscribeOrders();
    };
  }, []);

  const closeOrder = async (orderId) => {
    if (!window.confirm("¿Estás seguro de cerrar este pedido?")) return;
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'Cerrado' });
      alert("Pedido finalizado con éxito.");
    } catch (error) {
      console.error("Error al cerrar pedido:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">Admin Dashboard</h1>
          <p className="text-slate-400">Vento Delivery - Control Central de Operaciones</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <span className="block text-xs text-slate-500 uppercase">Alertas</span>
            <span className="text-xl font-bold text-red-500">{logs.length}</span>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <span className="block text-xs text-slate-500 uppercase">Pedidos</span>
            <span className="text-xl font-bold text-green-500">{orders.length}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sección de Logs de Seguridad */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Monitoreo de Seguridad (Fraude)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Mensaje Bloqueado</th>
                  <th className="px-6 py-4">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500 italic">No se han detectado intentos de fraude.</td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-300">{log.user || 'Desconocido'}</td>
                      <td className="px-6 py-4">
                        <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded text-sm break-all">
                          {log.message}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {log.timestamp?.toDate().toLocaleString() || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sección de Gestión de Pedidos */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50">
            <h2 className="text-xl font-semibold">Gestión de Pedidos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Paquete</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">{order.package_name || 'Sin nombre'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'Cerrado' ? 'bg-slate-700 text-slate-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {order.status || 'Activo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status !== 'Cerrado' && (
                        <button 
                          onClick={() => closeOrder(order.id)}
                          className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md text-sm font-medium transition-all"
                        >
                          Cerrar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;

