require("dotenv").config();
const express = require("express");
const conectarDB = require("../config/db");
const errorHandler = require("../middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/swagger.yaml");

const app = express();

app.use(express.json());
app.use("/comments", require("../routes/comment.routes"));
app.use("/users", require("../routes/user.routes"));
app.use("/posts", require("../routes/post.routes"));
app.use("/tags", require("../routes/tag.routes"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: { defaultModelsExpandDepth: -1 }
}));app.use(errorHandler);

const iniciar = async () => {
  console.log("UnaHur - Anti-Social net AGDM");
  await conectarDB();
  app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
  });
};

iniciar();