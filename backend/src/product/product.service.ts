import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) { }

  async create(data: Partial<Product>) {
    const product = await this.productModel.create(data);
    return product;
  }

  async findAllPaginated(page: number, limit: number, query: any) {
    const skip = (page - 1) * limit;
  
    const mongoQuery: any = {};
  
    // ✅ Search
    if (query.search && query.search.trim() !== "") {
      mongoQuery.name = { $regex: query.search.trim(), $options: "i" };
    }
  
    // ✅ Category
    if (query.category && query.category.trim() !== "") {
      mongoQuery.category = query.category.trim();
    }
  
    // ✅ Parse price filters
    const minPrice = parseFloat(query.minPrice);
    const maxPrice = parseFloat(query.maxPrice);
  
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      mongoQuery.price = {};
      if (!isNaN(minPrice)) mongoQuery.price.$gte = minPrice;
      if (!isNaN(maxPrice)) mongoQuery.price.$lte = maxPrice;
    }
  
    // ✅ Rating
    const minRating = parseFloat(query.minRating);
    if (!isNaN(minRating)) {
      mongoQuery.rating = { $gte: minRating };
    }
  
    // ✅ Sort
    let sortOption = {};
    if (query.sort && typeof query.sort === "string") {
      const field = query.sort.replace("-", "");
      const order = query.sort.startsWith("-") ? -1 : 1;
      sortOption[field] = order;
    }
  
    console.log("📦 MongoQuery:", mongoQuery);
    console.log("📊 Sort Option:", sortOption);
  
    const products = await this.productModel
      .find(mongoQuery)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
  
    const total = await this.productModel.countDocuments(mongoQuery);
  
    return {
      data: products,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(query: any) {
    const { sort, category, minPrice, maxPrice, minRating, search } = query;

    const filter: any = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOption: any = {};
    if (sort === 'price') sortOption.price = 1;
    else if (sort === 'rating') sortOption.rating = -1;

    return this.productModel.find(filter).sort(sortOption);
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, data: Partial<Product>) {
    const updated = await this.productModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Product not found');
    return deleted;
  }

  async getMaxPrice(): Promise<number> {
    const maxProduct = await this.productModel
      .findOne()
      .sort({ price: -1 })
      .limit(1);

    if (!maxProduct) throw new Error("No products found");

    return maxProduct.price;
  }
}