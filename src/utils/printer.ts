import { printer, types } from "node-thermal-printer";

export async function ipPrinter (text:string){
    console.log('printer')
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
        impresora.print('hello'); 
        impresora.openCashDrawer(); 
        impresora.cut();
        await impresora.execute(); 
      }
      
      imprimir();

}


