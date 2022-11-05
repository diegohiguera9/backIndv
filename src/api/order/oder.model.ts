import {Schema, Document, model} from 'mongoose'
import { IProduct } from '../product/product.model'
import { ITable } from '../table/table.model'

export interface IOrder extends Document {
    products: Array<IProduct['_id']>;
    table: ITable['_id'];
}

const orderSchema = new Schema({
    products: {
        type: [{type: Schema.Types.ObjectId, ref:'Product'}],
        required:true
    }, 
    table: {
        type: Schema.Types.ObjectId,
        ref: 'Table'
    },
    location: {
        type: Object
    }
},{timestamps:true})

export default model <IOrder>('Order',orderSchema)

