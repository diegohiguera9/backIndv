import { printer, types } from "node-thermal-printer";
import { Request, Response, NextFunction } from "express";
import { oderProducts } from "../api/order/oder.model";

export async function ipPrinterDel(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const products = req.body.data  
  const table = req.body.table

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
      
    impresora.setTextDoubleHeight()
    impresora.setTextDoubleWidth();
    impresora.bold(true);  
    impresora.print(`Mesa ${table}\n`)
    impresora.print('Eliminacion Productos\n')
    impresora.print('\n')
    impresora.setTextNormal();  
    impresora.drawLine(); 
    impresora.setTextDoubleHeight()
    impresora.setTextDoubleWidth();
    products.forEach((item:oderProducts)=>{
      impresora.print(item.name+':    '+ item.count)
      impresora.newLine(); 
      impresora.newLine();   
    })
    impresora.openCashDrawer();
    impresora.cut();
    await impresora.execute();
  }

  imprimir();
}
