import { model, Document, Schema } from "mongoose";
import { IUser } from "../user/user.model";

export interface ITable extends Document {
  number: number;
  floor: number;
  order: string;
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
    }
  },
  { timestamps: true }
);

export default model<ITable>("Table", tableSchema);
