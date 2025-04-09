import jwt from 'jsonwebtoken';

const payload = {
  sub: 'some-user-id-123',
  email: 'user@example.com',
  role: 'USER',
};

const token = jwt.sign(payload, 'superSecret123', { expiresIn: '24h' });

console.log("✅ New USER token:\n", token);