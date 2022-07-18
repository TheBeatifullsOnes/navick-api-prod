import * as pm from "../models/product.js";
// import logger from "../utils/logger.js";

export const getProducts = (req, res) => {
  pm.getProducts()
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

export const getProduct = (req, res) => {
  const { idProduct } = req.params;
  pm.getProduct(idProduct)
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
export const insertProduct = (req, res) => {
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
  pm.insertProduct(
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

export const updateProduct = (req, res) => {
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
  pm.updateProduct(
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

export const deleteProduct = (req, res) => {
  const { idProduct } = req.params;
  pm.deleteProduct(idProduct)
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
