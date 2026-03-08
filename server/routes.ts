
import { Router } from 'express';
import { usersDB, testsDB, hashPassword, verifyPassword } from './db';
import { HERBS_DATA } from '../src/constants/herbs';
import OpenAI from 'openai';

const router = Router();

// Cache AI client instance
let aiClient: OpenAI | null = null;
let lastConfig = '';

const getAIClient = () => {
  // 默认指向本地 Ollama 接口
  const baseURL = process.env.LOCAL_AI_URL || 'http://localhost:11434/v1';
  const model = process.env.LOCAL_AI_MODEL || 'qwen2';
  
  const currentConfig = `${baseURL}:${model}`;
  if (aiClient && lastConfig === currentConfig) {
    return aiClient;
  }

  lastConfig = currentConfig;
  aiClient = new OpenAI({
    apiKey: 'ollama', // 本地模型通常不需要 key，但 SDK 要求非空
    baseURL: baseURL,
  });
  return aiClient;
};

// 1. Auth
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "用户名和密码不能为空" });

  const user = usersDB.find(u => u.username === username);
  if (user) {
    if (verifyPassword(password, user.salt, user.passwordHash)) {
      res.json({ id: user.id, username: user.username, avatar: user.avatar, role: user.role });
    } else {
      res.status(401).json({ error: "密码错误" });
    }
  } else {
    const { salt, hash } = hashPassword(password);
    const role = username === 'admin' ? 'admin' : 'user';
    const newUser = { id: Date.now().toString(), username, salt, passwordHash: hash, avatar: 'default.png', role };
    usersDB.push(newUser);
    res.json({ id: newUser.id, username: newUser.username, avatar: newUser.avatar, role: newUser.role, message: "注册成功" });
  }
});

// 2. Herbs
router.get('/herbs', (req, res) => {
  const { q } = req.query;
  const searchTerm = (q as string || '').toLowerCase().trim();
  
  if (!searchTerm) return res.json(HERBS_DATA);
  
  const filtered = HERBS_DATA.filter(herb => 
    herb.name.includes(searchTerm) || 
    herb.pinyin.toLowerCase().includes(searchTerm) ||
    herb.efficacy.includes(searchTerm)
  );
  res.json(filtered);
});

// 3. Test Results
router.post('/test-result', (req, res) => {
  const { username, result } = req.body;
  if (!username || !result) return res.status(400).json({ error: "缺少必要参数" });
  const newTest = { id: Date.now().toString(), username, result, date: new Date().toISOString() };
  testsDB.push(newTest);
  res.json({ success: true, data: newTest });
});

router.get('/test-result', (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "缺少 username 参数" });
  const userTests = testsDB.filter(t => t.username === username);
  const lastTest = userTests.length > 0 ? userTests[userTests.length - 1] : null;
  res.json(lastTest || { result: null });
});

// 4. User Management (Admin)
router.get('/users', (req, res) => {
  const safeUsers = usersDB.map(u => ({
    id: u.id,
    username: u.username,
    avatar: u.avatar,
    role: u.role,
    registeredAt: new Date(parseInt(u.id)).toISOString().split('T')[0]
  }));
  res.json(safeUsers);
});

router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const index = usersDB.findIndex(u => u.id === id);
  if (index !== -1) {
    usersDB.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "用户不存在" });
  }
});

// 5. Intelligent Consultation (AI Chat)
router.post('/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "消息格式不正确或消息为空" });
  }

  const client = getAIClient();
  if (!client) {
    return res.status(503).json({ error: "AI 服务未配置，请联系管理员设置 API Key。" });
  }

  try {
    const response = await client.chat.completions.create({
      model: process.env.LOCAL_AI_MODEL || 'qwen2',
      messages: [
        { 
          role: 'system', 
          content: "你是一位资深的中医药专家助手。请以专业、亲切的口吻回答用户的健康咨询，并给出合理的中医建议（食疗、穴位、生活习惯）。如果用户询问非中医相关问题，请礼貌地引导回中医养生话题。" 
        },
        ...messages
      ],
      stream: true,
    });

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    const statusCode = error.status || 500;
    const message = error.message || "AI 响应失败";
    res.status(statusCode).json({ error: message });
  }
});

export default router;
