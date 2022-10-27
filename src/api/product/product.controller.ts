import Product, { IProduct } from "./product.model";
import Category, { ICategory } from "../category/category.model";
import { Request, Response, NextFunction } from "express";
import ErrroResponse from "../../utils/errorResponse";

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;
    const category: ICategory | null = await Category.findOne(data.category);
    if (!category) {
      return next(new ErrroResponse("No category found", 400));
    }
    const newProduct = {
      name: data.name,
      categoryId: category._id,
    };
    const product: IProduct = await Product.create(newProduct);
    category.products.push(product._id);
    await category.save({ validateBeforeSave: false });
    res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
    });
    if (!product) {
      return next(new ErrroResponse("No product found", 400));
    }
    res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function destroyProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = req.params.id;
    const product: IProduct | null = await Product.findById(productId);

    if (!product) {
      return next(new ErrroResponse("no product found", 400));
    }

    const category: ICategory | null = await Category.findById(
      product.categoryId
    );

    if (!category) {
      return next(new ErrroResponse("No valid category in product", 400));
    }

    const newProducts = category.products.filter(
      (item) => item.toString() !== productId
    );

    category.products = newProducts

    await category.save({validateBeforeSave:false})

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}

export async function showProduct (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try{
        const productId = req.params.id
        const product: IProduct | null = await Product.findById(productId)
        if (!product) {
            return next(new ErrroResponse('No product found',400))
        }
        res.status(200).json({data:product})    
    } catch (err){
        next(err)
    }
  }
