import { Schema, Document, model, Types } from "mongoose";
import { IProduct } from "../product/product.model";
import { ITable } from "../table/table.model";

export interface oderProducts {
  product: IProduct["_id"];
  name: string;
  count: number;
  price: number;
  totalPrice: number;
}

export interface IOrder extends Document {
  products: Array<oderProducts>;
  table: ITable["_id"];
  total: number;
}

const orderSchema = new Schema(
  {
    products: {
      type: [
        {
          product: { type: Schema.Types.ObjectId, ref: "Product" },
          count: {
            type: Number, 
            min: 0
          },
          price: Number,
          name: String,
          totalPrice:Number,
        },
      ],
      required: true,
    },
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table",
    },
    location: {
      type: Object,
    },
    total: {
        type: Number
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
  },
  { timestamps: true }
);

export default model<IOrder>("Order", orderSchema);