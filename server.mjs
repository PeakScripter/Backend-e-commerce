import app from "./app.mjs";
import dotenv from "dotenv"
import connectdatabase from "./config/database.mjs";"./config/database.mjs"

//uncaught exception
process.on("uncaughtException", (err)=>{
    console.log(`error: ${err.message}`);
    console.log("shutting down server due to uncaught exception");
    process.exit(1);
});

//config
dotenv.config({path:"backend/config/config.env"});
connectdatabase()


//server
const server = app.listen(process.env.PORT || 3000,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})

//unhandled promise rejection
process.on("unhandledRejection", (err)=>{
    console.log(`error: ${err.message}`);
    console.log("shutting down server due to unhandled rejection");
    server.close(()=>{
        process.exit(1);
    });
});