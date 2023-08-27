const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

const createMessagesTable = async () => {
  const query = `
    CREATE TABLE messages (
      id SERIAL PRIMARY KEY,
      message TEXT NOT NULL,
      users TEXT[] NOT NULL,
      sender INTEGER REFERENCES users(id) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`;

  try {
    await pool.query(query);
    console.log("Messages table created");
  } catch (error) {
    console.error("Error creating messages table:", error);
  }
};

createMessagesTable();
