"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const createRoutes_1 = require("./Routes/createRoutes");
const Client_1 = require("./Entities/Client");
const Blogs_1 = require("./Entities/Blogs");
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
// const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api", createRoutes_1.ClientRouter);
const Appdatasource = new typeorm_1.DataSource({
    type: "postgres",
    host: "44.201.130.220",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "atthetechdb",
    entities: [Client_1.Client, Blogs_1.Blog],
    // entities: ["src/Entities/*{.ts,.js}"],  web build karny sy pehly is ko use kry for local developing
    synchronize: true,
    logging: true,
});
Appdatasource.initialize()
    .then(() => {
    console.log("Database Connected Successfully...");
    https_1.default
        .createServer({
        key: fs_1.default.readFileSync("attech.pem"),
        cert: fs_1.default.readFileSync("cert.pem"),
    }, app)
        .listen(5000, () => {
        console.log("Successfully Run on Port 5000.....");
    });
})
    .catch((err) => {
    console.error("Error Database Connected");
});
// https
// .createServer(
//   {
//     key: fs.readFileSync("attech.pem"),
//     cert: fs.readFileSync("cert.pem"),
//   },
//   app
// )
// .listen(5000, () => {
//   console.log("Successfully Run on Port 5000.....");
// });
