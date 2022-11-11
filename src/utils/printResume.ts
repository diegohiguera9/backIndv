import { printer, types } from "node-thermal-printer";
import { Request, Response, NextFunction } from "express";
import { oderProducts } from "../api/order/oder.model";

export async function ipPrinterResume(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const order = req.body.data;

  let impresora = new printer({
    type: types.EPSON, // Printer type: 'star' or 'epson'
    interface: "tcp://192.168.0.188:9100", // Printer interface
    characterSet: "SLOVENIA", // Printer character set - default: SLOVENIA
    removeSpecialCharacters: false, // Removes special characters - default: false
    lineCharacter: "=", // Set character for lines - default: "-"
    options: {
      // Additional options
      timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
    },
  });

  async function imprimir() {
    impresora.setTextDoubleHeight();
    impresora.setTextDoubleWidth();
    impresora.bold(true);
    impresora.print(`Mesa ${order.table.number}\n`);
    if (order.location){
        if (order.location.address){
            impresora.print("\n");
            impresora.print(order.location.address)
        }
    }
    impresora.print("\n");
    impresora.setTextNormal();
    impresora.drawLine();
    order.products.forEach((item: oderProducts) => {
      impresora.newLine();
      impresora.leftRight(
        item.name + ":    " + item.count + " ",
        `$ ${new Intl.NumberFormat("de-DE").format(item.totalPrice)}`
      );
      impresora.newLine();
    });
    impresora.newLine();
    impresora.bold(true);
    impresora.setTextDoubleHeight();
    impresora.setTextDoubleWidth();
    impresora.print(
      `TOTAL: $ ${new Intl.NumberFormat("de-DE").format(order.total)}`
    );
    impresora.openCashDrawer();
    impresora.cut();
    await impresora.execute();
  }

  imprimir();
}
