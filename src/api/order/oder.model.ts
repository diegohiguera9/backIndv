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
  status:string;  
  updatedAt: string;
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
      type: {
        coordinates: Object,
        address: String
      },
    },
    total: {
        type: Number
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    kitchen: {
      type: String,
      enum: {
        values: ["preparacion", "entregada"],
        message: "Invalid kitchen",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["pendiente", "pagada"],
        message: "Invalid status",
      },
    },
  },
  { timestamps: true }
);

export default model<IOrder>("Order", orderSchema);
