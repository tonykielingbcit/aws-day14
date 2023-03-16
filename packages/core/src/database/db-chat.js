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

export async function createChat(name) {
    const res = await getPool().query(`
      INSERT INTO chats (name)
      VALUES ($1)
      RETURNING *
    `, [name])
  return res.rows[0]
}

export async function updateChat(id, name) {
  const res = await getPool().query(`
    UPDATE chats
    SET name = $2
    WHERE id = $1
  `, [id, name]);
// console.log("UPDATING:::: ", res);
  return res.rowCount;
}

export async function deleteChat(id) {
  const res = await getPool().query(`
    DELETE FROM chats
    WHERE id = $1
    RETURNING *
  `, [id])
  return res.rows[0]
}
