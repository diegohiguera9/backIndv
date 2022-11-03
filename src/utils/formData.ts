import busboy from 'busboy'
import cloud from 'cloudinary'
import { Request, Response, NextFunction } from "express";
const cloudinary = cloud.v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUD,
  api_secret: process.env.CLUD_SECRET,
});

const formData = (
  req: Request,
  res: Response,
  next: NextFunction
)=>{
    let img: Array<string> = [];
    let uploadingFile = false;
    let uploadingCount = 0;
  
    const done = () => {
      if (uploadingFile) return;
      if (uploadingCount > 0) return;
      next();
    };
  
    const bb = busboy({ headers: req.headers });
    req.body = {};
  
    bb.on("field", (key, val) => {
      if (key === 'price'){
        const price = parseFloat(val)
        req.body.price = price
      } else {
        req.body[key] = val;
      }          
    });
  
    bb.on("file", (key, stream) => {
      uploadingFile = true;
      uploadingCount++;
      const cloud = cloudinary.uploader.upload_stream(
        { upload_preset: "top24" },
        (err, res) => {
          if (err) {
            next(err);
          }
  
          // req.body[key] = res.secure_url
          delete req.body[key];
          if (res){
            img.push(res.secure_url);
          }
          req.body.images = img;
          uploadingFile = false;
          uploadingCount--;
          done();
        }
      );
  
      stream.on("data", (data) => {
        cloud.write(data);
      });
  
      stream.on("end", () => {
        cloud.end();
      });
    });
  
    bb.on("finish", () => {
      done();
    });
  
    req.pipe(bb);
}

export default formData