const productModel = require("../models/product");

exports.getProducts = (req, res) => {
  productModel
    .getProducts()
    .then((response) => {
      if (response.length > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: response,
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "No hay Artículos por mostrar",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};

exports.getProduct = (req, res) => {
  const { idProduct } = req.params;
  productModel
    .getProduct(idProduct)
    .then((response) => {
      if (response.length > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: response,
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "Artículo Inexistente",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};
exports.insertProduct = (req, res) => {
  const {
    idProduct,
    description,
    idCategory,
    purchasePrice,
    catalogueDate,
    movementDate,
    modificationDate,
    idUserModification,
    status,
  } = req.body;
  productModel
    .insertProduct(
      idProduct,
      description,
      idCategory,
      purchasePrice,
      catalogueDate,
      movementDate,
      modificationDate,
      idUserModification,
      status
    )
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: response,
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "Error al Insertar Artículo",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};

exports.updateProduct = (req, res) => {
  const {
    idProduct,
    description,
    idCategory,
    purchasePrice,
    catalogueDate,
    movementDate,
    modificationDate,
    idUserModification,
    status,
  } = req.body;
  productModel
    .updateProduct(
      idProduct,
      description,
      idCategory,
      purchasePrice,
      catalogueDate,
      movementDate,
      modificationDate,
      idUserModification,
      status
    )
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: response,
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "Artículo Inexistente",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};

exports.deleteProduct = (req, res) => {
  const { idProduct } = req.params;
  productModel
    .deleteProduct(idProduct)
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: "Artículo eliminado correctamente",
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "Error al eliminar Artículo",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};
