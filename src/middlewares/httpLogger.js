// const morgan = require("morgan");
import morgan from "morgan";
// const logger = require("../utils/logger");
import logger from "../utils/logger.js";

logger.stream = {
  write: (message) =>
    logger.info(message.substring(0, message.lastIndexOf("\n"))),
};

// module.exports =

export default morgan(
  ":method :url :status :response-time ms - :res[content-length]",
  { stream: logger.stream }
);
