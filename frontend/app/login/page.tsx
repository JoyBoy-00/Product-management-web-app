"use client";

import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface JwtPayload {
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [userInfo, setUserInfo] = useState({ email: "" });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setUserInfo({ email: storedEmail });
    }
  }, []);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, form);
      const token = res.data.token;
      const decoded = jwtDecode<JwtPayload>(token);

      localStorage.setItem("token", token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", decoded.email);

      setUserInfo({ email: decoded.email });
      router.push("/products");
    } catch (err) {
      setError("Invalid email or password");
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

  return (
    <Box className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-800 via-black to-black">
      {userInfo.email && (
        <Box className="absolute top-4 right-4 text-white flex items-center gap-2">
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
        </Box>
      )}
      <div className="w-full max-w-md p-6 backdrop-blur-sm bg-white/90 rounded-xl transition-transform hover:scale-105">
        <div className="mb-6 text-3xl font-bold text-center text-black">
          Login
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
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </div>
    </Box>
  );
}