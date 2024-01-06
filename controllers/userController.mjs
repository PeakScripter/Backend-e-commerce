import ErrorHander from "../utils/errorhander.mjs";
import catchAsyncErrors from "../middleware/catchAsyncErrors.mjs";
import User from "../models/userModel.mjs";
import sendToken from "../utils/jwtToken.mjs";
import sendEmail from "../utils/sendEmail.mjs";

const registerUser = catchAsyncErrors(async (req, res, next)=>{
    const {name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"public_id",
            url:"url"
        },
    });

    sendToken(user,201,res);
})


const loginUser = catchAsyncErrors(async (req, res, next)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHander("Please enter email & password", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHander("Invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid email or password", 401));
    }
    sendToken(user,200,res);
}
)

const logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged out"
    })
});

//forgot password
const forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({ email: req.body.email});
    if(!user){
        return next(new ErrorHander("User not found with this email", 404));
    }
    //get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    //create reset password url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
    try{
        await sendEmail({
            email:user.email,
            subject:"Legendify Password Recovery",
            message
        });
        res.status(200).json({
            success:true,
            message:`Email sent to: ${user.email}`
        })
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHander(error.message, 500));
    }
});

const resetPassword = catchAsyncErrors(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });
    if(!user){
        return next(new ErrorHander("Password reset token is invalid or has been expired", 400));
    };
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHander("Password does not match", 400));
    };
    //setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user,200,res);
})

const getUserdetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
})
const updateUserPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    //check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched){
        return next(new ErrorHander("Old password is incorrect", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHander("Password does not match", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user,200,res);

})


export {registerUser, loginUser, logout, forgotPassword, resetPassword, getUserdetails, updateUserPassword};