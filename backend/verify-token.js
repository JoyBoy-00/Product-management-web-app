import jwt from 'jsonwebtoken';

// Paste your full token here
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2Y2MWNlODZmNjc0OGRiZjFkNzliNzQiLCJlbWFpbCI6IjEyM0AxMjMiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc0NDIwODUyMiwiZXhwIjoxNzQ0Mjk0OTIyfQ.jSEhPY9VfHPazagp8TKj2nxC8TH1kRI_ZPMZQgw61ko';

try {
  const decoded = jwt.verify(token, 'superSecret123');
  console.log("✅ Token is valid:", decoded);
} catch (e) {
  console.error("❌ Token is invalid:", e.message);
}