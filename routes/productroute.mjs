import express from "express";
import { getAllProducts, createproduct, updateproduct, deleteproduct, singleproduct } from "../controllers/productcontroller.mjs";
import {isAuthenticatedUser, authorizeRoles} from "../middleware/auth.mjs";

const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/product/new").post(isAuthenticatedUser,createproduct, authorizeRoles("admin"));

router
    .route("/product/:id")
    .put( isAuthenticatedUser,updateproduct, authorizeRoles("admin"))
    .delete( isAuthenticatedUser,deleteproduct, authorizeRoles("admin"))
    .get(singleproduct);

export default router;