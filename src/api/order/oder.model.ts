import {Schema, Document, model} from 'mongoose'
import { IProduct } from '../product/product.model'

export interface IOrder extends Document {
    products: Array<IProduct['_id']>
}

const orderSchema = new Schema({
    products: {
        type: [{type: Schema.Types.ObjectId, ref:'Product'}],
        required:true
    }
},{timestamps:true})

export default model <IOrder>('Order',orderSchema)

