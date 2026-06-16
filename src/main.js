require("dotenv").config();
const express = require("express");
const conectarDB = require("../config/db");

const app = express();
app.use(express.json());

const iniciar = async () => {
  console.log("UnaHur - Anti-Social net AGDM");
  await conectarDB();
  app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado en el puerto ${process.env.PORT}`);
  });
};

iniciar();