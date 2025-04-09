// ProductCard.tsx
import { Card, CardContent, Typography, TextField, Button } from "@mui/material";
// Product type defined locally in this file
interface Product {
  createdBy?: string;
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
}

interface ProductCardProps {
  product: Product;
  editingProduct: Product | null;
  isAdmin: boolean;
  setEditingProduct: (product: Product | null) => void;
  handleSaveEdit: () => void;
  handleDeleteProduct: (id: string) => void;
}

const ProductCard = ({
  product,
  editingProduct,
  isAdmin,
  setEditingProduct,
  handleSaveEdit,
  handleDeleteProduct,
}: ProductCardProps) => {
  return (
    <Card key={product._id} className="w-full max-w-md backdrop-blur-sm bg-white/90 rounded-xl transition-transform hover:scale-105 shadow-lg">
      <CardContent>
        {editingProduct?._id === product._id ? (
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
              <Button variant="contained" color="success" onClick={handleSaveEdit}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col">
              <Typography variant="h5">{product.name}</Typography>
              <Typography variant="body2" className="text-gray-600">
                {product.category}
              </Typography>
              <Typography className="font-bold mt-2">
                ₹{product.price}
              </Typography>
              <Typography className="font-bold mt-2">
                {product.rating}⭐
              </Typography>
              <p className="text-sm text-gray-300">
                Added by: {product.createdBy || 'Unknown'}
              </p>
              <Typography variant="body2" className="text-gray-600">
                {product.description}
              </Typography>
            </div>
            {isAdmin && (
              <div className="flex gap-2 mt-4">
                <Button variant="outlined" onClick={() => setEditingProduct(product)}>
                  Edit
                </Button>
                <Button variant="contained" color="error" onClick={() => handleDeleteProduct(product._id)}>
                  Delete
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;