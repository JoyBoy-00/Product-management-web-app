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
} from "@mui/material";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', form);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role); // You need to return role from backend
      router.push('/products');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-gray-800">
      <Card className="w-full max-w-md p-6 bg-gray-800">
        <CardContent>
          <div className="mb-6 font-bold text-3xl text-center text-black">
            Login
          </div>
          <div className="flex flex-col gap-4">
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              InputLabelProps={{ className: "text-white" }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={form.password}
              onChange={handleChange}
              InputLabelProps={{ className: "text-white" }}
              InputProps={{ style: { color: "white" } }}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button variant="contained" color="primary" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}