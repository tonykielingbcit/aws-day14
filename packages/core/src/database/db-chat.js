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

export async function getChats() {
  const res = await getPool().query(`
    SELECT * FROM chats
    ORDER BY timestamp DESC
  `)
  return res.rows
}

export async function createChat(name, userId, username) {
    const res = await getPool().query(`
      INSERT INTO chats (name, user_id, username)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [name, userId, username]);
  return res.rows[0]
}

export async function updateChat(id, name, userId) {
  const res = await getPool().query(`
    UPDATE chats
    SET name = $2
    WHERE id = $1 AND
        user_id = $3
  `, [id, name, userId]);
  return res.rowCount;
}

export async function deleteChat(id, userId) {
  const res = await getPool().query(`
    DELETE FROM chats
    WHERE id = $1 AND
        user_id = $2
    RETURNING *
  `, [id, userId])
  return res.rowCount;
}
