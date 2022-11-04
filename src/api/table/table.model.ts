import { model, Document, Schema, models } from "mongoose";
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
      validate: [
        {
          async validator(number: number) {
            try {
              const product = await models.Table.findOne({ number });
              return !product;
            } catch (err) {
              return false;
            }
          },
          message: "Product already exist",
        },
      ],
    },
    floor:{
        type:Number,
        required: true
    },
    order:{
        type: Schema.Types.ObjectId, 
        ref: 'Order',
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
