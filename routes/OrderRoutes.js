const express = require("express");
const orderController = require("../controller/OrderController");
const router = express.Router();
const verifyUser = require("../middleware/AuthMiddlewear");
router.post("/create",verifyUser,orderController.create);
router.get("/find-by-id",verifyUser,orderController.findById);
router.delete("/delete-by-id",verifyUser,orderController.deleteById);
router.put("/update",verifyUser,orderController.deleteById);
router.get("/find-all",verifyUser,orderController.findAll);
router.get("/find-order-counts",verifyUser,orderController.findOrderCounts);
router.get("/find-income",verifyUser,orderController.findIncome);

module.exports = router;
