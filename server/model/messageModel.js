const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

const MessageModel = {
  async createMessage(text, users, sender) {
    const query = `
      INSERT INTO messages (message, users, sender)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const values = [text, users, sender];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = MessageModel;
