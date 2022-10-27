import {model, Schema, Document,models} from 'mongoose'
import { ICategory } from '../category/category.model';

export interface IProduct extends Document {
    name: string,
    categoryId: ICategory['_id'],    
}

const productSchema = new Schema ({
    name: {
        type: String,
        required: true,
        validate: [
            {
              async validator(name: string) {
                try {
                  const product = await models.Product.findOne({ name });
                  return !product;
                } catch (err) {
                  return false;
                }
              },
              message: "Category already exist",
            },
          ],
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
},{
    timestamps: true
})

export default model <IProduct>('Product',productSchema);