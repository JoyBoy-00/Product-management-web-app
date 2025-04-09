'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import {
  CardContent,
  TextField,
  Button,
  Box,
  MenuItem,
} from "@mui/material";

interface JwtPayload {
  email: string;
  role: string;
  iat: number;
  exp: number;
}

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
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, form);
      alert('Signup successful!');
      router.push('/login');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Signup failed');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  return (
    <Box className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-800 via-black to-black">
      
      <div className="w-full max-w-md p-6 backdrop-blur-sm bg-white/90 rounded-xl transition-transform hover:scale-105">
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