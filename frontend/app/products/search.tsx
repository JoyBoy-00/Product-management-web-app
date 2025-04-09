"use client";

import { TextField, MenuItem, Button, Card, CardContent, Slider, Collapse, Typography } from "@mui/material";
import { VisibilityOff as VisibilityOffIcon, AddCircleOutline as AddCircleOutlineIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface SearchFiltersProps {
    filters: any;
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    applyFilters: () => void;
}

export default function SearchFilters({ filters, setFilters, applyFilters }: SearchFiltersProps) {
    const [showForm, setShowForm] = useState(false);
    const [maxPriceRange, setMaxPriceRange] = useState(1000); // default fallback

    const handleChange = (field: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        const fetchMaxPrice = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/max-price`);
                setMaxPriceRange(res.data.max || 1000); // default if nothing
            } catch (err) {
                console.error("Failed to fetch max price", err);
            }
        };
        fetchMaxPrice();
    }, []);

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
                        padding: '8px 38px',
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
                    {showForm ? "Hide Filters" : "Show Filters"}
                </Button>
            </div>


            <Collapse in={showForm}>
                <Card className="mb-8 p-4">
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Search */}
                            <TextField
                                label="Search"
                                className="bg-white rounded-lg"
                                value={filters.search}
                                onChange={(e) => handleChange("search", e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                            />

                            {/* Category dropdown */}
                            <TextField
                                select
                                label="Category"
                                className="bg-white rounded-lg"
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                fullWidth
                                variant="outlined"
                                size="small"
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                <MenuItem value="Pen">Pen</MenuItem>
                                <MenuItem value="Pencil">Pencil</MenuItem>
                                <MenuItem value="Accessories">Accessories</MenuItem>
                                <MenuItem value="Eraser">Eraser</MenuItem>
                                <MenuItem value="Notebook">Notebook</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>

                            {/* Min Rating */}
                            <TextField
                                label="Min Rating"
                                type="number"
                                className="bg-white rounded-lg"
                                value={filters.minRating}
                                onChange={(e) => handleChange("minRating", e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                                inputProps={{
                                    min: 0,
                                    max: 10,
                                    step: 0.1  // Allows decimal ratings if needed
                                }}
                            />

                            {/* Sort */}
                            <TextField
                                select
                                label="Sort By"
                                className="bg-white rounded-lg"
                                value={filters.sort}
                                onChange={(e) => handleChange("sort", e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                            >
                                <MenuItem value="">Default</MenuItem>
                                <MenuItem value="price">Price (Low to High)</MenuItem>
                                <MenuItem value="-price">Price (High to Low)</MenuItem>
                                <MenuItem value="-rating">Rating (High to Low)</MenuItem>
                                <MenuItem value="rating">Rating (Low to High)</MenuItem>
                            </TextField>

                            {/* Price Range */}
                            <div>
                                <div>Price Range</div>
                                <Slider
                                    value={[filters.minPrice, filters.maxPrice]}
                                    onChange={(_, newValue) => {
                                        const [min, max] = newValue as number[];
                                        setFilters((prev: any) => ({
                                            ...prev,
                                            minPrice: min,
                                            maxPrice: max,
                                        }));
                                    }}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={maxPriceRange}
                                />
                            </div>
                            <div></div>
                            <div></div>

                            {/* Action Buttons */}
                            <div className="flex items-end gap-2">
                                <Button
                                    variant="outlined"
                                    className="text-white border-gray-500 hover:border-gray-400 h-10 w-full"
                                    onClick={() => setFilters({
                                        search: "",
                                        category: "",
                                        minPrice: 0,
                                        maxPrice: maxPriceRange,
                                        minRating: "",
                                        sort: ""
                                    })}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="contained"
                                    className="bg-blue-600 hover:bg-blue-700 h-10 w-full"
                                    onClick={applyFilters}
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </Collapse>
        </>
    );
}