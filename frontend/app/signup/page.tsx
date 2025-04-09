'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
} from "@mui/material";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "USER" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/auth/signup', form);
      alert('Signup successful!');
      router.push('/login');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-800 via-black to-black">
      <div className="w-full max-w-md p-6 backdrop-blur-md bg-white/90 border border-white/30 rounded-xl shadow-lg">
        <CardContent>
          <div className="mb-6 text-3xl font-bold text-center text-black">
            Signup
          </div>
          <div className="flex flex-col gap-4">
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={form.password}
              onChange={handleChange}
            />
            <TextField
              select
              label="Role"
              name="role"
              fullWidth
              value={form.role}
              onChange={handleChange}
            >
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </TextField>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button variant="contained" className='bg-green-800' onClick={handleSignup}>
              Signup
            </Button>
          </div>
        </CardContent>
      </div>
    </Box>
  );
}