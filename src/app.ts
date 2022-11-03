import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import userRouter from "./api/user/user.route";
import categoryRouter from "./api/category/category.router";
import productRouter from "./api/product/product.router";
import errorHandler from "./middleware/errorHandler";
import tableRouter from "./api/table/table.router";

//initialize
const app = express();

import "./middleware/authGoogle";
import './utils/formData'

//middleware
app.use(morgan("tiny"));
app.use(
  cors({
    origin: [
      "https://frontfogon-dxx7qsmma-diegohiguera9.vercel.app",
      'https://frontfogon.vercel.app',
      "http://localhost:3000",
      '186.28.25.144'
    ],
    credentials: true,
  })
);
app.set("trust proxy", 1);
app.use(express.json());
app.use(
  session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

//middleware routes
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use('/table', tableRouter)
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//middleware for errors
app.use(errorHandler);

export default app;
