import Product from "../models/productmodel.mjs";
import ErrorHander from "../utils/errorhander.mjs";
import catchAsyncErrors from "../middleware/catchAsyncErrors.mjs";
import ApiFeatures from "../utils/apifeatures.mjs";
//admin
const createproduct = catchAsyncErrors(async (req, res, next)=>{

    req.body.user = req.user.id

    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    });
});

const resultPerPage = 5;



//user
const getAllProducts = catchAsyncErrors(async (req,res)=>{

    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success:true,
        productCount,
        products
    })
});

//admin
const updateproduct = catchAsyncErrors(async (req,res)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true, useFindAndModify:true})
    res.status(200).json({
        success:true,
        product
    })});

//admin

const deleteproduct = catchAsyncErrors(async(req, res, next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }
    await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
});

//user
const singleproduct = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("Product not found", 404))
    }
    res.status(200).json({
        success:true,
        product
    })});

export { createproduct, getAllProducts, updateproduct, deleteproduct, singleproduct }