
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bencao_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

/**
 * 合理的编写方式：
 * 1. 使用连接池 (Pool) 而不是单一连接，提高并发性能。
 * 2. 使用 async/await 处理异步操作。
 * 3. 预处理语句 (Prepared Statements) 防止 SQL 注入。
 */

// 示例：获取用户
export async function getUserById(id: string) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return (rows as any[])[0];
}
