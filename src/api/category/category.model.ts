import { model, Schema, Document,models } from "mongoose";
import { IProduct } from "../product/product.model";

export interface ICategory extends Document {
  name: string;
  products: Array<IProduct["_id"]>;
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: [
        {
          async validator(name: string) {
            try {
              const category = await models.Category.findOne({ name });
              return !category;
            } catch (err) {
              return false;
            }
          },
          message: "Category already exist",
        },
      ],
    },
    products: {
      type: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    },
  },
  { timestamps: true }
);

export default model <ICategory>('Category',categorySchema)
