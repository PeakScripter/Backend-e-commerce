import express from "express";
import product from "./routes/productroute.mjs";
import user from "./routes/userroute.mjs"
import errorMiddleware from "./middleware/error.mjs";
import cookieParser from "cookie-parser";
import order from "./routes/orderRoute.mjs";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use(errorMiddleware);
app.use("/api/v1",order)
export default app;