"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem as MuiMenuItem,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { jwtDecode } from "jwt-decode";
import SearchFilters from "./search";
import ProductForm from "./addProduct";
import ProductCard from "./productCard";

interface JwtPayload {
  email: string;
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, '_id'>>({
    name: "",
    price: 0,
    description: "",
    category: "",
    rating: 10,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: 0,
    maxPrice: 3000,
    minRating: "",
    sort: "",
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: "" });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleAddProduct = async () => {
    const token = localStorage.getItem("token");
    console.log("Submitting product:", newProduct);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`, newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewProduct({ name: "", price: 0, description: "", category: "", rating: 10 });
      fetchProducts();
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const token = localStorage.getItem("token");
console.log("📤 Using token:", token);

if (!token) {
  console.error("❌ No token found in localStorage");
  return;
}

try {
  const decoded = jwtDecode<JwtPayload>(token);
  console.log("🪪 Decoded token:", decoded);
} catch (err) {
  console.error("❌ Could not decode token:", err);
}
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };
  

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found in localStorage");
      return;
    }

    const decoded = jwtDecode<JwtPayload>(token);
    console.log("🪪 Decoded token:", decoded);
    console.log("🕓 Expiry check:", decoded.exp * 1000 < Date.now());
    console.log("📤 Sending token:", `Bearer ${token}`);

    if (decoded.exp * 1000 < Date.now()) {
      console.error("❌ Token expired");
      localStorage.clear();
      router.push("/login");
      return;
    }

    if (decoded.role !== "ADMIN") {
      console.error("❌ User is not ADMIN", decoded.role);
      return;
    }
    if (!editingProduct) return;
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${editingProduct._id}`,
        editingProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.clear();
    router.push("/");
  };

  const applyFilters = async () => {
    try {
      console.log("Applying filter", filters);
      const params = new URLSearchParams(filters as any).toString();
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products?${params}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to apply filters", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      router.push("/login");
      return;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setUserInfo({ email: decoded.email });
      if (decoded.role === "ADMIN") setIsAdmin(true);
      setIsAuthenticated(true);
      fetchProducts();
    } catch (err) {
      console.error("Token decode failed", err);
      setIsAuthenticated(false);
      router.push("/login");
    }
  }, []);

  return (
    <Box className="min-h-screen p-6 bg-gradient-to-b from-blue-800 via-black to-black text-white relative">
      <div className="mb-4">
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
            <MuiMenuItem disabled>Email: {userInfo.email}</MuiMenuItem>
            <MuiMenuItem onClick={handleLogout}>Logout</MuiMenuItem>
          </Menu>
        </div>

        <Typography variant="h4" className="mb-6 font-bold text-center">
          Product Management
        </Typography>
      </div>

      {/* Add Product Form */}
      <ProductForm
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        handleAddProduct={handleAddProduct}
      />


      {/* Search Filter */}
      <SearchFilters
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
      />


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            editingProduct={editingProduct}
            isAdmin={isAdmin}
            setEditingProduct={setEditingProduct}
            handleSaveEdit={handleSaveEdit}
            handleDeleteProduct={handleDeleteProduct}
          />
        ))}
      </div>
    </Box>
  );
}