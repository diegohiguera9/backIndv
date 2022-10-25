import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'


//initialize
dotenv.config()
const app = express()


//middleware
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())

export default app;