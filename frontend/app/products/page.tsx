"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem
} from "@mui/material";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, '_id'>>({
    name: "",
    price: 0,
    description: "",
    category: "",
    rating: 10,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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

  useEffect(() => {
    fetchProducts();
    const role = localStorage.getItem("role");
    if (role === "ADMIN") setIsAdmin(true);
  }, []);

  return (
    <Box className="p-6 bg-gray-800">
      <div className="mb-6 bg-gray-800">
      <Typography variant="h4" className="font-bold text-center">
        Product Management
      </Typography>
      </div>

      {isAdmin && (
        <Card className="mb-8 p-4">
          <CardContent>
            <Typography variant="h6" className="mb-4">
              Add New Product
            </Typography>
            <div className="flex flex-col gap-4">
              {/* 1st row: name, price, category, rating */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-2">
                  <TextField
                    label="Name"
                    fullWidth
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    select
                    label="Category"
                    fullWidth
                    value={newProduct.category || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="Pen">Pen</MenuItem>
                    <MenuItem value="Pencil">Pencil</MenuItem>
                    <MenuItem value="Accessories">Accessories</MenuItem>
                    <MenuItem value="Eraser">Eraser</MenuItem>
                    <MenuItem value="Notebook">Notebook</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </div>
                <div className="flex-1">
                  <TextField
                    label="Price"
                    type="number"
                    fullWidth
                    value={isNaN(newProduct.price) ? "" : newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: e.target.value === "" ? 0 : parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="Rating"
                    type="number"
                    fullWidth
                    value={newProduct.rating || 0}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        rating: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              {/* 2nd row: description full width */}
              <div>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  minRows={2}
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddProduct}
                className="mt-4"
              >
                Add Product
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Card key={p._id} className="shadow-lg">
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
                    <Typography variant="h6">{p.name}</Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {p.category}
                    </Typography>
                    <Typography className="font-bold mt-2">
                      ${p.price}
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