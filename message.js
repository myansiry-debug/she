// Armazenamento em memória para mensagens (para HTTP polling)
const messages = new Map(); // roomId -> array de mensagens

module.exports = (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const { roomId, text, userName, userId, timestamp, type } = req.body;
    console.log(`📤 Mensagem recebida via HTTP: ${text} de ${userName} na sala ${roomId}`);
    
    if (!messages.has(roomId)) {
      messages.set(roomId, []);
    }
    
    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: userId || 'http-user',
      userName: userName || 'Usuário',
      text,
      timestamp: timestamp || Date.now(),
      type: type || 'text',
      roomId,
    };
    
    const roomMessages = messages.get(roomId);
    roomMessages.push(message);
    
    // Limitar a 100 mensagens por sala
    if (roomMessages.length > 100) {
      roomMessages.shift();
    }
    
    res.json({ success: true, message: 'Mensagem enviada' });
  } catch (error) {
    console.error('Erro no message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
