import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import userRouter from './api/user/user.route'
import categoryRouter from './api/category/category.router'
import productRouter from './api/product/product.router'
import errorHandler from './middleware/errorHandler'

//initialize
dotenv.config()
const app = express()

//middleware
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())

//middleware routes
app.use('/user',userRouter)
app.use('/category',categoryRouter)
app.use('/product',productRouter)

//middleware for errors
app.use(errorHandler)

export default app;