import Order, { IOrder, oderProducts } from "./oder.model";
import User, { IUser } from "../user/user.model";
import { Request, Response, NextFunction } from "express";
import Table, { ITable } from "../table/table.model";
import ErrroResponse from "../../utils/errorResponse";

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
      status: data.status,
      location: data.location?{...data.location}:{}
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

    res.status(200).json({ data: order });
    next()
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

    if (order.status === "pagada") {
      return res.status(200).send("order payed already");
    }

    const orderNames = order.products.map((item) => item.name);
    const inNames = data.map((item: oderProducts) => item.name);

    data.forEach((inProduct: oderProducts, dataIndex: number) => {
      const orderIndex = orderNames.indexOf(inNames[dataIndex]);
      if (orderIndex !== -1) {
        order.products[orderIndex].count =
          order.products[orderIndex].count + inProduct.count;
      } else {
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

    const table = await Table.findById(order.table)
    if (!table){
      return 
    }
    req.body.table = table.number
    next()
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
    let inValid = false

    if (!order) {
      return next(new ErrroResponse("no order found", 400));
    }

    if (order.status === "pagada") {
      return res.status(200).send("order payed already");
    }

    const orderNames = order.products.map((item) => item.name);
    const inNames = data.map((item: oderProducts) => item.name);

    inNames.forEach((item:string)=>{
      const searchIndex = orderNames.indexOf(item)
      if (searchIndex === -1) inValid = true
    })

    if(inValid) return next(new ErrroResponse('Algun producto no se encuentra en la orden',400))

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
    const table = await Table.findById(order.table)
    if (!table){
      return 
    }
    req.body.table = table.number
    next()
    next()
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
    const order = await Order.findById(orderId)
      .populate({
        path: "table",
      })
      .populate({
        path: "user",
      });

    if (!order) {
      return next(new ErrroResponse("No order found", 400));
    }

    res.status(200).json({ data: order });
  } catch (err) {
    next(err);
  }
}

export async function showStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const status = req.query.status;
    const orders = await Order.find({ status })
      .populate({
        path: "table",
      })
      .populate({
        path: "user",
      });
    res.status(200).json({ data: orders });
  } catch (err) {
    next(err);
  }
}

export async function updatePay(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orderId = req.params.id;
    console.log("body", req.body);
    const order = await Order.findByIdAndUpdate(orderId, req.body, {
      new: true,
    });
    if (!order) {
      return next(new ErrroResponse("no orders found", 400));
    }
    const table = await Table.updateOne(
      { _id: order.table },
      { $unset: { order: 1 } }
    );
    if (!table) {
      return next(new ErrroResponse("no tables found", 400));
    }
    res.status(200).json({ data: order });
  } catch (err) {
    next(err);
  }
}

export async function orderDay(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const status = req.query.status
    let date = [new Date(req.body.date), new Date(req.body.date)];
    date[1] = new Date(date[1].getTime() + 60 * 60 * 24 * 1000)
    console.log(date);
    let updateDay = {
      $dateToString: {
        date: "$updatedAt",
        timezone: "-05",
      },
    };

    const orders = await Order.find({
      $expr: {
        $and: [
          { $lte: [date[0], { $dateFromString: { dateString: updateDay } }] },
          { $gte: [date[1], { $dateFromString: { dateString: updateDay } }] },
          { $eq: [status, "$status"] },
        ],        
      },
    }).sort({
      'updatedAt':-1
    })
      .populate({
        path: "table",
      })
      .populate({
        path: "user",
      });

    res.status(202).json({ data: orders });
  } catch (err) {
    next(err);
  }
}

export async function orderReport(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.body.dates);
    let date = [new Date(req.body.dates[0]), new Date(req.body.dates[1])];
    date[1] = new Date(date[1].getTime() + 60 * 60 * 24 * 1000)
    console.log(date);
    let updateDay = {
      $dateToString: {
        date: "$updatedAt",
        timezone: "-05",
      },
    };

    const orders = await Order.find({
      $expr: {
        $and: [
          { $lte: [date[0], { $dateFromString: { dateString: updateDay } }] },
          { $gte: [date[1], { $dateFromString: { dateString: updateDay } }] },
        ],        
      },
    }).sort({
      'updatedAt':1
    })
      .populate({
        path: "table",
      })
      .populate({
        path: "user",
      });

      const totalPayed = orders.reduce((prev,current)=>{return prev+current.total},0)

    res.status(200).json({ data: orders, totalPayed });
  } catch (err) {
    next(err);
  }
}

export async function printResume(
  req: Request,
  res: Response,
  next: NextFunction
){
  try{
    const orderId = req.params.id
    const order = await Order.findById(orderId)
    .populate({
      path: "table",
    })
    .populate({
      path: "user",
    });
    if(!order){
      return next(new ErrroResponse('No order found',400))
    }
    req.body.data = order
    res.sendStatus(200)
    next()
  } catch(err){
    next()
  }
}

export async function orderMap (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const status = req.query.status
    let date = [new Date(req.body.date), new Date(req.body.date)];
    date[1] = new Date(date[1].getTime() + 60 * 60 * 24 * 1000)
    console.log(date);
    let updateDay = {
      $dateToString: {
        date: "$updatedAt",
        timezone: "-05",
      },
    };

    const orders = await Order.find({
      $expr: {
        $and: [
          { $lte: [date[0], { $dateFromString: { dateString: updateDay } }] },
          { $gte: [date[1], { $dateFromString: { dateString: updateDay } }] },
          { $eq: [status, "$status"] },
        ],        
      },
    }).sort({
      'updatedAt':1
    })
      .populate({
        path: "table",
        match:{type:{$eq:'delivery'}}
      })
      .populate({
        path: "user",
      });

      const newOrders = orders.filter(item=>item.table)

    res.status(200).json({ data: newOrders });
  } catch(err){

  }
}