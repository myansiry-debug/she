// Armazenamento em memória para mensagens (para HTTP polling)
const messages = new Map(); // roomId -> array de mensagens
const users = new Map(); // roomId -> array de usuários

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
    const { roomId, userName } = req.body;
    console.log(`🚪 Usuário ${userName} entrou na sala ${roomId} via HTTP`);
    
    if (!users.has(roomId)) {
      users.set(roomId, []);
    }
    
    const userList = users.get(roomId);
    if (!userList.find(u => u.name === userName)) {
      userList.push({ id: Date.now().toString(), name: userName, isOnline: true });
    }
    
    res.json({ success: true, message: 'Entrou na sala' });
  } catch (error) {
    console.error('Erro no join:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
