import { model, Schema, Document, models } from "mongoose";
import ErrroResponse from "../../utils/errorResponse";
import bcrypt from "bcrypt";

const emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
const passwordRegex = new RegExp(
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,14}$/
);

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: string;
  googleId?:string;
  __v?: number;
  _id?: string;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [emailRegex, "Not valid email"],
      validate: [
        {
          async validator(email: string) {
            try {
              const user = await models.User.findOne({ email });
              return !user;
            } catch (err) {
              return false;
            }
          },
          message: "Email already exist",
        },
      ],
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ["admin", "basic", "cashier"],
        message: "Invalid rol",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  if (!user.password) {
    return next()
  }

  if (!passwordRegex.test(user.password)) {
    return next(
      new ErrroResponse(
        "Password must have at least a symbol, upper and lower case letters and a number",
        400
      )
    );
  }

  user.password = await bcrypt.hash(user.password, 8);

  return next();
});


export default model<IUser>("User", userSchema); // funciones genericas