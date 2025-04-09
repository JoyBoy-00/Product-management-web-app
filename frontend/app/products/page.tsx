'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/products');
    setProducts(res.data);
  };

  const handleAddProduct = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/products', newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewProduct({ name: '', price: '', description: '' });
      fetchProducts();
    } catch (err) {
      console.error('Failed to add product', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    const role = localStorage.getItem('role');
    if (role === 'ADMIN') setIsAdmin(true);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Products</h1>

      {isAdmin && (
        <div className="mb-6 border rounded p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Add New Product</h2>
          <input
            type="text"
            placeholder="Name"
            className="border px-2 py-1 mr-2"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Price"
            className="border px-2 py-1 mr-2"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            className="border px-2 py-1 mr-2"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={handleAddProduct}
          >
            Add
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p: any) => (
          <div key={p._id} className="border rounded p-4 shadow">
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-600">{p.description}</p>
            <p className="font-medium mt-2">${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
