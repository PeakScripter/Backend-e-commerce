import express from 'express';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.mjs';
import {newOrder} from '../controllers/odercontroller.mjs';
const router = express.Router();
router.route("/order/new").post(isAuthenticatedUser, newOrder);



export default router;