import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter your name"]
    },
    email:{
        type:String,
        required:[true, "Please enter your email"],
        unique:true,
        validate:[validator.isEmail, "Please enter valid email address"]
    },
    password:{
        type:String,
        required:[true, "Please enter your password"],
        minlength:[6, "Password must be longer than 6 characters"],
        select:false
    },
    role:{
        type:String,
        default:"user"
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
    });

    userSchema.pre("save", async function(next){
        if(!this.isModified("password")){
            next();
        }
        this.password = await bcrypt.hash(this.password,10)
    });
    //jwt token
    userSchema.methods.getJwtToken = function(){
        return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRE
        });
    }

    //compare password
    userSchema.methods.comparePassword = async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password);
    }

    userSchema.methods.getResetPasswordToken = function(){
        //generate token
        const resetToken = crypto.randomBytes(20).toString("hex");

        //hash and set to resetPasswordToken
        this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        //set token expire time
        this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        return resetToken;
    }
    
export default mongoose.model("user", userSchema);