const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

const UserModel = {
  async findOneByUsername(username) {
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);
    return result.rows[0];
  },

  async findOneByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async createUser(email, username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(query, [email, username, hashedPassword]);
    return result.rows[0];
  },
  async findUsersExceptId(id) {
    const query = "SELECT email, username, id FROM users WHERE id != $1";
    const result = await pool.query(query, [id]);
    return result.rows;
  },
};

module.exports = UserModel;
