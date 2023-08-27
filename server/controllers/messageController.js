const pool = require('../db');

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const queryGetMessages =
      "SELECT * FROM messages WHERE users @> ARRAY[$1::text, $2::text] ORDER BY created_at ASC";
    const result = await pool.query(queryGetMessages, [from, to]);
    const messages = result.rows;

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender === parseInt(from), // Ensure from is parsed to integer
        message: msg.message,
      };
    });

    res.json(projectedMessages);
  } catch (ex) {
    console.error("Error fetching messages:", ex);
    res.status(500).json({ error: "Error fetching messages" });
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    const queryAddMessage =
      "INSERT INTO messages (message, users, sender) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(queryAddMessage, [
      message,
      [from, to],
      parseInt(from), // Ensure from is parsed to integer
    ]);

    if (result.rows.length > 0) {
      res.json({ msg: "Message added successfully." });
    } else {
      res.status(500).json({ error: "Failed to add message to the database" });
    }
  } catch (ex) {
    console.error("Error adding message:", ex);
    res.status(500).json({ error: "Error adding message" });
  }
};
