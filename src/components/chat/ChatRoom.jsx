import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const db = {}; 

const ChatRoom = ({ orderId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [alert, setAlert] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!orderId || !db.collection) return; 
    
    const messagesRef = collection(db, 'orders', orderId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
         id: doc.id,
         ...doc.data()
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const phoneRegex = /\b9\d{8}\b/;
    const emailTextRegex = /[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/i;
    const forbiddenWordsRegex = /\b(celular|wsp|whatsapp|pagar afuera|pago afuera|yape|plin)\b/i;

    if (
      phoneRegex.test(newMessage) || 
      emailTextRegex.test(newMessage) || 
      forbiddenWordsRegex.test(newMessage)
    ) {
      if (db.collection) {
        try {
           await addDoc(collection(db, 'security_logs'), {
             userId: currentUser?.uid || 'Desconocido',
             userName: currentUser?.name || 'Usuario',
             blockedMessage: newMessage,
             reason: 'Intento de compartir datos prohibidos',
             date: serverTimestamp(),
             orderId: orderId
           });
        } catch (error) {}
      }

      setAlert('Acción bloqueada: No se permite compartir números de contacto o redes.');
      setNewMessage('');
      setTimeout(() => setAlert(null), 4000);
      return;
    }

    const messageText = newMessage;
    setNewMessage('');

    if (db.collection) {
      try {
        const messagesRef = collection(db, 'orders', orderId, 'messages');
        await addDoc(messagesRef, {
          text: messageText,
          senderId: currentUser?.uid || 'cliente1',
          senderName: currentUser?.name || 'Yo',
          createdAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error al enviar el mensaje: ', error);
      }
    } else {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: messageText,
            senderId: currentUser?.uid || 'cliente1',
            senderName: currentUser?.name || 'Yo',
            createdAt: new Date()
        }]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative font-sans">
      
      {/* Header del Chat */}
      <div className="bg-[#1f2937] bg-opacity-90 backdrop-blur-md border-b border-slate-700 px-5 py-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
              V
           </div>
           <div>
             <h3 className="font-bold text-white text-sm tracking-wide">Soporte Seguro</h3>
             <p className="text-xs text-cyan-400 font-medium">#{orderId}</p>
           </div>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Protegido</span>
        </div>
      </div>

      {/* Alerta de Seguridad (Absoluta para no romper layout) */}
      {alert && (
        <div className="absolute top-16 left-0 right-0 z-20 flex justify-center px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-red-500/90 backdrop-blur-sm border border-red-400 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl flex items-center justify-between w-full max-w-sm">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{alert}</span>
            </div>
            <button onClick={() => setAlert(null)} className="hover:text-red-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Área de Mensajes */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#0b1121] relative flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm space-y-3">
             <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center opacity-50">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
             </div>
             <p>Este chat es privado y monitoreado.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === (currentUser?.uid || 'cliente1');
            return (
              <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-full`}>
                <span className="text-[10px] text-slate-400 mb-1.5 px-1 font-medium tracking-wide">
                  {msg.senderName}
                </span>
                <div 
                  className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm break-words leading-relaxed shadow-sm
                  ${isMine 
                      ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-blue-500/20' 
                      : 'bg-[#1f2937] text-slate-200 border border-slate-700/50 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Chat */}
      <div className="bg-[#1f2937] p-4 border-t border-slate-700">
        <form onSubmit={handleSendMessage} className="flex gap-3 relative items-center">
          <input
            type="text"
            className="flex-1 bg-[#0b1121] border border-slate-600 text-slate-200 text-sm rounded-full px-5 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-500 shadow-inner"
            placeholder="Mensaje seguro..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3 rounded-full flex items-center justify-center hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/30 w-11 h-11"
            aria-label="Enviar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
              <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
