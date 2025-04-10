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
  createdBy?: string;
}

interface ProductPage extends Product {
  createdBy?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductPage[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;
  const [newProduct, setNewProduct] = useState<Omit<Product, '_id'>>({
    name: "",
    price: 0,
    description: "",
    category: "",
    rating: 10,
    createdBy: "",
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: 0,
    maxPrice: 3000,
    minRating: "",
    sort: "",
  });
  const [editingProduct, setEditingProduct] = useState<ProductPage | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: "" });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setUserInfo({ email: decoded.email });
      if (decoded.role === "ADMIN") setIsAdmin(true);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Invalid token");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      console.log("Fetching page:", page, "with filters:", filters);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`, {
        params: {
          ...filters,
          page,
          limit: pageSize,
        },
      });

      const productList = Array.isArray(res.data?.data) ? res.data.data : [];
      setProducts(productList);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching products", err);
      setProducts([]);
    }
  };


  const handleAddProduct = async () => {
    const token = localStorage.getItem("token");
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

  const handleEditProduct = (product: ProductPage) => {
    setEditingProduct({ ...product });
  };


  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
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
      setPage(1);
      const params = new URLSearchParams(filters as any).toString();
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products?${params}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to apply filters", err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams(
          Object.entries({
            ...filters,
            page: String(page),
            limit: String(pageSize),
          }).reduce((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
          }, {} as Record<string, string>)
        ).toString();

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products?${params}`);

        // Safely access paginated response
        const productList = Array.isArray(res.data?.data) ? res.data.data : [];
        setProducts(productList);
        setTotalPages(res.data?.totalPages || 1);
      } catch (err) {
        console.error("Error fetching products", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [page, filters]);

  if (isLoading) {
    return <div className="text-white p-6 text-center">🔒 Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box className="min-h-screen p-6 bg-gradient-to-b from-blue-800 via-black to-black text-white relative">
      <div className="mb-4">
        <div className="absolute top-4 right-4 flex items-center gap-2">
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


      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(products) && products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            editingProduct={editingProduct as any}
            isAdmin={isAdmin}
            setEditingProduct={setEditingProduct}
            handleSaveEdit={handleSaveEdit}
            handleDeleteProduct={handleDeleteProduct}
          />
        ))}

        {/*if empty */}
        {Array.isArray(products) && products.length === 0 && (
          <div className="text-white col-span-full text-center text-lg">No products found.</div>
        )}
      </div>


      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </Box>
  );
}