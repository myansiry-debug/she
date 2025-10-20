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
  
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const { roomId } = req.query;
    const { since } = req.query;
    
    console.log(`📡 Polling de mensagens para sala ${roomId} desde ${since}`);
    
    if (!messages.has(roomId)) {
      messages.set(roomId, []);
    }
    
    const roomMessages = messages.get(roomId);
    const sinceTimestamp = parseInt(since) || 0;
    
    // Filtrar mensagens mais recentes que o timestamp
    const newMessages = roomMessages.filter(msg => msg.timestamp > sinceTimestamp);
    
    console.log(`📡 Retornando ${newMessages.length} mensagens novas`);
    res.json(newMessages);
  } catch (error) {
    console.error('Erro no messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
