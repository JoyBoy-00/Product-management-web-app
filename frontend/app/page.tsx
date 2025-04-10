"use client";

import Link from 'next/link';


import { useEffect, useState } from 'react';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface JwtPayload {
  email: string;
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export default function HomePage() {
  const [userInfo, setUserInfo] = useState<{ email: string }>({ email: '' });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-blue-800 via-black to-black text-white">
      {userInfo.email && (
        <Box className="absolute top-4 right-4 flex items-center gap-2">
          <IconButton onClick={handleMenuOpen} className="text-white">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: '#B5A8D5',
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

      <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
        Welcome to Product Manager 🚀
      </h1>
      <p className="text-lg text-gray-300 mb-10 max-w-xl">
        A Minimalistic and Powerful Product Management Web Application.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Signup
        </Link>
        <Link
          href="/products"
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          View Products
        </Link>
      </div>
    </main>
  );
}