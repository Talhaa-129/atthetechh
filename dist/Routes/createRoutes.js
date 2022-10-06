"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRouter = void 0;
const express_1 = __importDefault(require("express"));
const Client_1 = require("../Entities/Client");
const Blogs_1 = require("../Entities/Blogs");
const s3_1 = require("../s3");
const CurrentDate_1 = require("../CurrentDate");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: "uploads/" });
const router = express_1.default.Router();
exports.ClientRouter = router;
router.get("/check", (req, res) => {
    res.json("Hello How r u");
});
router.post("/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, email, number, message } = req.body;
        const client = Client_1.Client.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: number,
            message: message,
        });
        yield client.save();
        return res.status(200).send({ message: "Submit" });
    }
    catch (err) {
        res.status(400).send({ message: "Error" });
    }
}));
router.get("/fetchcontact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allContact = yield Client_1.Client.find();
        return res.json(allContact);
    }
    catch (err) {
        res.status(400).send({ message: "Error" });
    }
}));
router.delete("/deletecontact/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ID = req.params.id;
        yield Client_1.Client.delete({ id: ID });
        return res.status(200).send({ message: "Deleted" });
    }
    catch (err) {
        res.status(400).send({ message: "Error" });
    }
}));
router.post("/blogform", upload.array("image", 3), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req) {
            const file = req.files;
            const data = JSON.parse(req.body.formValues);
            const result = yield (0, s3_1.UploadImage)(file);
            const { heading, category, content, tags } = data;
            const keylist = result === null || result === void 0 ? void 0 : result.map((values) => {
                return values.Key;
            });
            const date = (0, CurrentDate_1.formatDate)(new Date());
            const blogsubmit = Blogs_1.Blog.create({
                heading: heading,
                tags: tags,
                category: category,
                Key: keylist,
                content: content,
                created_date: date,
            });
            yield blogsubmit.save();
            return res.json(blogsubmit).send({ message: "Submit Done" });
        }
    }
    catch (err) {
        res.status(400).send({ message: "Error" });
    }
}));
router.get("/images/:key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = req.params.key;
    const readStream = yield (0, s3_1.getFileStream)(key);
    readStream.pipe(res);
}));
router.get("/getblogs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBlog = yield Blogs_1.Blog.find();
        if (allBlog)
            return res.json(allBlog);
    }
    catch (err) {
        res.status(400).send({ message: "Error" });
    }
}));
