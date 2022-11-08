import Order, { IOrder, oderProducts } from "./oder.model";
import User, { IUser } from "../user/user.model";
import { Request, Response, NextFunction } from "express";
import Table, { ITable } from "../table/table.model";
import ErrroResponse from "../../utils/errorResponse";
import oderModel from "./oder.model";

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;

    const tableId = await Table.findOne({ number: parseFloat(data.table) });
    const userId = await User.findById(req.body.user._id);

    if (!tableId || !userId) {
      return next(new ErrroResponse("No valid table or user", 400));
    }

    const order = await Order.create({
      products: [...data.data],
      table: tableId._id,
      total: 0,
      user: userId._id,
    });

    order.products.forEach((item) => {
      item.totalPrice = item.price * item.count;
      order.total = order.total + item.totalPrice;
    });

    await order.save({ validateBeforeSave: false });

    userId.orders.push(order);
    tableId.order = order._id;

    await userId.save({ validateBeforeSave: false });
    await tableId.save({ validateBeforeSave: false });

    console.log(order);

    res.status(200).json({ data: order });
  } catch (err) {
    next(err);
  }
}

export async function updateOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orderId = req.params.id;
    const data = req.body.data;
    const order = await Order.findById(orderId);

    if (!order) {
      return next(new ErrroResponse("no order found", 400));
    }

    const orderNames = order.products.map((item) => item.name);
    const inNames = data.map((item: oderProducts) => item.name);

    data.forEach((inProduct: oderProducts, dataIndex: number) => {
      const orderIndex = orderNames.indexOf(inNames[dataIndex]);
      console.log(orderIndex);
      if (orderIndex !== -1) {
        console.log("if");
        order.products[orderIndex].count =
          order.products[orderIndex].count + inProduct.count;
      } else {
        console.log("else");
        order.products.push({ ...inProduct });
      }
    });

    order.total = 0;

    order.products.forEach((item) => {
      item.totalPrice = item.price * item.count;
      order.total = order.total + item.totalPrice;
    });

    await order.save({ validateBeforeSave: false });

    res.status(200).json({ data: order });
  } catch (err) {
    next(err);
  }
}

export async function upDeleteOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orderId = req.params.id;
    const data = req.body.data;
    const order = await Order.findById(orderId);

    if (!order) {
      return next(new ErrroResponse("no order found", 400));
    }

    const orderNames = order.products.map((item) => item.name);
    const inNames = data.map((item: oderProducts) => item.name);

    data.forEach((inProduct: oderProducts, dataIndex: number) => {
      const orderIndex = orderNames.indexOf(inNames[dataIndex]);
      if (orderIndex !== -1) {
        order.products[orderIndex].count =
          order.products[orderIndex].count - inProduct.count;

        if (order.products[orderIndex].count === 0) {
          order.products.splice(orderIndex, 1);
        }
      }
    });

    order.total = 0;

    order.products.forEach((item) => {
      item.totalPrice = item.price * item.count;
      order.total = order.total + item.totalPrice;
    });

    await order.save({ validateBeforeSave: false });

    res.status(200).json({ data: order });
  } catch (err) {
    next(err);
  }
}

export async function showOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate({
      path: "table",
    });

    if (!order) {
      return next(new ErrroResponse("No order found", 400));
    }

    res.status(200).json({ data: order });
  } catch (err) {
    next(err);
  }
}
