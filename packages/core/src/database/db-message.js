import pg from 'pg'
const { Pool } = pg

let pool
function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    pool = new Pool({
      connectionString,
      application_name: "",
      max: 1,
    });
  }
  return pool
}


export async function getMessagesByChatId(chatId) {
  const res = await getPool().query(`
    SELECT * FROM messages
    WHERE chat_id = $1
    ORDER BY timestamp DESC
  `, [chatId]);

  return res.rows
}


export async function createMessage(chatId, content, userId, username) {
    const getChatInfo = await getPool().query(`
        SELECT * FROM chats
        WHERE id = $1
    `, [chatId]);
    // console.log("Chat:::::::::::::::::;; ", getChatInfo.rows[0].user_id, " and ", userId)
    if (getChatInfo.rows[0].user_id !== userId)
        return false;

    const res = await getPool().query(`
      INSERT INTO messages (chat_id, content, user_id, username)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [chatId, content, userId, username])
// console.log("res---------------- ", res.rows)
  return res.rows[0]
}


export async function updateMessage(id, content, userId) {
  const res = await getPool().query(`
    UPDATE messages
    SET content = $2
    WHERE id = $1 AND
    user_id = $3
  `, [id, content, userId]);
  
  return res.rowCount;
}


export async function deleteMessage(id, userId) {
  const res = await getPool().query(`
    DELETE FROM messages
    WHERE id = $1 AND
    user_id = $2
    RETURNING *
  `, [id, userId])
  
//   return res.rows[0]
  return res.rowCount;
}
