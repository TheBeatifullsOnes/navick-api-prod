const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const productController = require("../controllers/product");

router.get("/", auth.ensureAuthenticated, productController.getProducts);
router.get(
  "/:idProduct",
  auth.ensureAuthenticated,
  productController.getProduct
);
router.post("/", auth.ensureAuthenticated, productController.insertProduct);
router.put("/", auth.ensureAuthenticated, productController.updateProduct);
router.delete(
  "/:idProduct",
  auth.ensureAuthenticated,
  productController.deleteProduct
);

module.exports = router;
