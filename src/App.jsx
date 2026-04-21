import React, { useState } from 'react';
import ChatRoom from './components/chat/ChatRoom';

function App() {
  const [activeOrderId, setActiveOrderId] = useState(null);
  const currentUser = { uid: 'user1', name: 'Repartidor Juan' };

  const mockOrders = [
    { id: 'ORD-1001', package: 'Caja de Zapatos', from: 'Miraflores', to: 'Surco', price: 'S/ 15' },
    { id: 'ORD-1002', package: 'Documentos', from: 'San Isidro', to: 'Lince', price: 'S/ 8' }
  ];

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-200 flex flex-col md:flex-row font-sans selection:bg-cyan-500/30">
      
      {/* Sidebar Layout */}
      <div className="w-full md:w-1/3 bg-[#111827] p-6 shadow-2xl border-r border-slate-800 flex flex-col z-10 relative">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8 flex items-center gap-3 tracking-tight">
          <span className="text-cyan-400 text-3xl">🗲</span> Vento Delivery
        </h1>
        <h2 className="text-sm uppercase tracking-widest font-bold text-slate-500 mb-5">Marketplace de Pedidos</h2>
        
        <div className="space-y-4 overflow-y-auto">
          {mockOrders.map(order => (
            <div key={order.id} className="p-5 border border-slate-700/50 rounded-2xl hover:border-cyan-500/50 transition-all bg-[#1f2937] group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-2xl rounded-full group-hover:bg-cyan-500/20 transition-all"></div>
              
              <div className="flex justify-between items-start mb-3 relative z-10">
                <span className="font-bold text-slate-100 text-lg group-hover:text-cyan-400 transition-colors">{order.package}</span>
                <span className="text-emerald-400 font-black text-lg bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20">{order.price}</span>
              </div>
              <div className="flex items-center text-sm text-slate-400 mb-5 relative z-10 font-medium">
                <span>📍 {order.from}</span>
                <span className="mx-2 text-slate-600">➔</span>
                <span>{order.to}</span>
              </div>
              
              <div className="flex gap-3 relative z-10">
                {/* Botón de Dev 4 */}
                <button className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 hover:text-white transition-colors border border-slate-600">
                  Ofertar
                </button>
                {/* Botón hacia ChatRoom (Dev 3) */}
                <button 
                  onClick={() => setActiveOrderId(order.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg
                    ${activeOrderId === order.id 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/30' 
                      : 'bg-slate-700/50 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10'}`}
                >
                  {activeOrderId === order.id ? 'Chat Abierto' : 'Chat Seguro'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-6 md:p-10 flex items-center justify-center bg-[#070b14] relative overflow-hidden">
        {/* Decorative Grid BG */}
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        {activeOrderId ? (
          <div className="w-full max-w-2xl h-[650px] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-300">
            {/* Header del modal (Simulado) */}
            <div className="mb-4 flex justify-between items-center bg-[#1f2937] p-4 rounded-xl shadow-lg border border-slate-700">
              <h2 className="font-bold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Negociación Activa
              </h2>
              <button 
                onClick={() => setActiveOrderId(null)}
                className="text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-red-500/10 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors border border-slate-700 hover:border-red-500/30"
              >
                Cerrar
              </button>
            </div>
            
            {/* Componente DEV 3 */}
            <div className="flex-1">
               <ChatRoom orderId={activeOrderId} currentUser={currentUser} />
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500/50 z-10 flex flex-col items-center">
             <div className="w-24 h-24 mb-6 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center shadow-xl">
               <span className="text-4xl block opacity-50">💬</span>
             </div>
             <p className="text-lg font-medium text-slate-400">Selecciona "Chat Seguro" en un pedido</p>
             <p className="text-sm mt-2 text-slate-600 max-w-sm">
                La interfaz principal (Marketplace) se integra perfectamente con el componente de Chat usando estos colores oscuros y acentos cyan.
             </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
