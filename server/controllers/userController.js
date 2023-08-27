const UserModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const pool = require('../db')

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const queryUsernameCheck = "SELECT * FROM users WHERE username = $1";
    const queryEmailCheck = "SELECT * FROM users WHERE email = $1";
    const usernameCheckResult = await pool.query(queryUsernameCheck, [username]);
    const emailCheckResult = await pool.query(queryEmailCheck, [email]);

    if (usernameCheckResult.rows.length > 0)
      return res.json({ msg: "Username already used", status: false });

    if (emailCheckResult.rows.length > 0)
      return res.json({ msg: "Email already used", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const queryCreateUser =
      "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *";
    const createUserResult = await pool.query(queryCreateUser, [
      email,
      username,
      hashedPassword,
    ]);
    const user = createUserResult.rows[0];

    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const query = "SELECT * FROM users WHERE username = $1";
      const result = await pool.query(query, [username]);
      const user = result.rows[0];
  
      if (!user)
        return res.json({ msg: "Incorrect Username or Password", status: false });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.json({ msg: "Incorrect Username or Password", status: false });
  
      delete user.password;
      return res.json({ status: true, user });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.setAvatar = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
  
      const queryUpdateAvatar = "UPDATE users SET is_avatar_image_set = true, avatar_image = $1 WHERE id = $2 RETURNING *";
      const updateAvatarResult = await pool.query(queryUpdateAvatar, [avatarImage, userId]);
      const userData = updateAvatarResult.rows[0];
  
      return res.json({
        isSet: userData.is_avatar_image_set,
        image: userData.avatar_image, // Use the correct column name here
      });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.getAllUsers = async (req, res, next) => {
    try {
      const queryGetAllUsers = "SELECT email, username, id, avatar_image FROM users WHERE id <> $1";
      const result = await pool.query(queryGetAllUsers, [req.params.id]);
      const users = result.rows;
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };
