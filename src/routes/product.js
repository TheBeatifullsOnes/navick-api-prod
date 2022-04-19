const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");

router.get("/", productController.getProducts);
router.get("/:idProduct", productController.getProduct);
router.post("/", productController.insertProduct);
router.put("/", productController.updateProduct);
router.delete("/:idProduct", productController.deleteProduct);

module.exports = router; 