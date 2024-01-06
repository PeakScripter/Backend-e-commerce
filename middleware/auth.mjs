import ErrorHander from "../utils/errorhander.mjs";
import catchAsyncErrors from "./catchAsyncErrors.mjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.mjs";

const isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHander("Login first to access this resource.", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
        next();
})


const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHander(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();
    };
  };


export {isAuthenticatedUser, authorizeRoles};