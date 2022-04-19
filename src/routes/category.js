const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/category");

router.get("/", categoriesController.getCategories);
router.get("/:idCategory", categoriesController.getCategory);
router.put("/", categoriesController.updateCategory);
router.post("/", categoriesController.insertCategory);
router.delete("/:idCategory", categoriesController.deleteCategory);


module.exports = router;