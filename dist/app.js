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
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api", createRoutes_1.ClientRouter);
const Appdatasource = new typeorm_1.DataSource({
    type: "postgres",
    host: "44.204.88.193",
    // host:'localhost',
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
    app.listen(PORT, () => {
        console.log("Successfully Run on Port 5000.....");
    });
})
    .catch((err) => {
    console.error("Error Database Connected");
});
