const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const categoriesController = require("../controllers/category");

router.get("/", auth.ensureAuthenticated, categoriesController.getCategories);
router.get(
  "/:idCategory",
  auth.ensureAuthenticated,
  categoriesController.getCategory
);
router.put("/", auth.ensureAuthenticated, categoriesController.updateCategory);
router.post("/", auth.ensureAuthenticated, categoriesController.insertCategory);
router.delete(
  "/:idCategory",
  auth.ensureAuthenticated,
  categoriesController.deleteCategory
);

module.exports = router;
