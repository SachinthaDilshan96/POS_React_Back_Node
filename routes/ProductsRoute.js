const express = require("express");
const productController = require("../controller/ProductController");
const router = express.Router();
const verifyUser = require("../middleware/AuthMiddlewear");
router.post("/create",verifyUser,productController.create);
router.get("/find-by-id/:id",verifyUser,productController.findById);
router.delete("/delete-by-id/:id",verifyUser,productController.deleteById);
router.put("/update/:id",verifyUser,productController.deleteById);
router.get("/find-all",verifyUser,productController.findAll);
router.get("/find-all-min",verifyUser,productController.findAllMin);
router.get("/find-all-count",verifyUser,productController.findAllCount);


module.exports = router;
