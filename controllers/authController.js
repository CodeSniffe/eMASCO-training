const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'wasd666()*8^';

const mockUser = {
  id: 'user1',
  username: 'admin',
  passwordHash: bcrypt.hashSync('password123', 10), // Pre-hashed password
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username !== mockUser.username || !bcrypt.compareSync(password, mockUser.passwordHash)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: mockUser.id, username: mockUser.username }, SECRET_KEY, {
    expiresIn: '1h',
  });

  res.json({ token });
};