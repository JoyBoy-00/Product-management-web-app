"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    TextField,
    Typography,
    MenuItem,
    Button,
    Collapse,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface ProductFormProps {
    newProduct: any;
    setNewProduct: React.Dispatch<React.SetStateAction<any>>;
    handleAddProduct: () => void;
}

export default function ProductForm({ newProduct, setNewProduct, handleAddProduct }: ProductFormProps) {
    const [showForm, setShowForm] = useState(false);

    const handleChange = (field: string, value: any) => {
        setNewProduct((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <div className="mb-8">
                <Button
                    variant="contained"
                    onClick={() => setShowForm((prev) => !prev)}
                    className="mb-8 transition-all duration-300 transform hover:scale-105"
                    sx={{
                        background: 'linear-gradient(45deg, #7A73D1 30%,#4D55CC 90%)',
                        color: 'white',
                        padding: '8px 20px',
                        fontWeight: '600',
                        letterSpacing: '0.5px',
                        boxShadow: '0 3px 5px 2pxrgb(50, 43, 141)',
                        '&:hover': {
                            background: 'linear-gradient(45deg,rgb(74, 159, #7A73D1 #4D55CC 90%)',
                            boxShadow: '0 4px 8px 2px #7A73D1',
                        },
                        '&:active': {
                            transform: 'scale(0.98)',
                        }
                    }}
                    startIcon={showForm ? <VisibilityOffIcon /> : <AddCircleOutlineIcon />}
                >
                    {showForm ? "Hide Product Form" : "Add New Product"}
                </Button>
            </div>

            <Collapse in={showForm}>
                <Card className="mb-8 p-4">
                    <CardContent>
                        <Typography variant="h6" className="mb-4">
                            Add New Product
                        </Typography>
                        <div className="flex flex-col gap-4">

                            {/*name, price, category, rating */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-2">
                                    <TextField
                                        label="Name"
                                        fullWidth
                                        value={newProduct.name}
                                        onChange={(e) =>
                                            handleChange("name", e.target.value)
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
                                            handleChange("category", e.target.value)
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
                                            handleChange("price", parseFloat(e.target.value))
                                        }
                                    />
                                </div>
                                <div className="flex-1">
                                    <TextField
                                        label="Rating"
                                        type="number"
                                        fullWidth
                                        inputProps={{ min: 0, max: 10 }}
                                        value={newProduct.rating}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            if (value === "") {
                                                handleChange("rating", "");
                                                return;
                                            }

                                            let parsed = parseFloat(value);

                                            if (parsed > 10) parsed = 10;
                                            if (parsed < 0) parsed = 0;

                                            handleChange("rating", parsed);
                                        }}
                                    />
                                </div>
                            </div>

                            {/*Description*/}
                            <div>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    value={newProduct.description}
                                    onChange={(e) =>
                                        handleChange("description", e.target.value)
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
            </Collapse>
        </>
    );
}