import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(data: Partial<Product>) {
    const product = await this.productModel.create(data);
    return product;
  }

  async findAll(query: any) {
    const { sort, category, minPrice, maxPrice, minRating, search} = query;
  
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