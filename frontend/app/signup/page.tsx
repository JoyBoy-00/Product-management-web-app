'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  IconButton,
  Avatar,
  Menu,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [userInfo, setUserInfo] = useState({ email: "" });

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    localStorage.removeItem("role");  // Remove role from local storage
    localStorage.removeItem("email"); // Remove email from local storage
    localStorage.removeItem("userId"); // Remove userId from local storage
    router.push("/");         // Navigate to login page
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserInfo({ email: decoded.email });
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  return (
    <Box className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-800 via-black to-black">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <IconButton onClick={handleMenuOpen} className="text-white">
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#B5A8D5', // Tailwind's indigo-600
              color: 'white',
              fontSize: 24,
            }}
          >
            <AccountCircleIcon />
          </Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem disabled>Email: {userInfo.email}</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
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