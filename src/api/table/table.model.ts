import { model, Document, Schema } from "mongoose";
import { IUser } from "../user/user.model";

export interface ITable extends Document {
  number: number;
  floor: number;
  order: string;
  type:string;
}

const tableSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    floor:{
        type:Number,
        required: true
    },
    order:{
        type: String, 
        required: false
    },
    type: {
        type: String,
        required: true,
        enum: {
          values: ["restaurant", "togo", "delivery",'pickup'],
          message: "Invalid type",
        },
      },    
  },
  { timestamps: true }
);

export default model<ITable>("Table", tableSchema);
