"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Avatar,
  Menu,
  MenuItem as MuiMenuItem,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { jwtDecode } from "jwt-decode";
import SearchFilters from "./search";
import ProductForm from "./addProduct";

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
    minPrice: "",
    maxPrice: "",
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
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleAddProduct = async () => {
    const token = localStorage.getItem("token");
    console.log("Submitting product:", newProduct);
    try {
      await axios.post("http://localhost:5000/products", newProduct, {
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
      await axios.delete(`http://localhost:5000/products/${id}`, {
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
    if (!editingProduct) return;
    try {
      await axios.put(
        `http://localhost:5000/products/${editingProduct._id}`,
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
      const params = new URLSearchParams(filters as any).toString();
      const res = await axios.get(`http://localhost:5000/products?${params}`);
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
          <Card key={p._id} className="w-full max-w-md backdrop-blur-sm bg-white/90 rounded-xl transition-transform hover:scale-105 shadow-lg">
            <CardContent>
              {editingProduct?._id === p._id ? (
                <>
                  <div className="mb-3">
                    <TextField
                      label="Name"
                      fullWidth
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <TextField
                      label="Description"
                      fullWidth
                      className="mb-2"
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <TextField
                      label="Price"
                      fullWidth
                      type="number"
                      className="mb-2"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditingProduct(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col">
                    <Typography variant="h5">{p.name}</Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {p.category}
                    </Typography>
                    <Typography className="font-bold mt-2">
                    ₹{p.price}
                    </Typography>
                    <Typography className="font-bold mt-2">
                      {p.rating}⭐
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {p.description}
                    </Typography>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outlined"
                        onClick={() => handleEditProduct(p)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteProduct(p._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </Box>
  );
}