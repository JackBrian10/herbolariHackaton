const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const { getUserHistory } = require("./controllers/userControllers");

/* IMPORTANTE:
 * Para que funcione el proyecto se necesita:
 * 1. Se necesita tener la conexion MongoDB. Esto significa que hay que encender la maquina virtual y poner el IP externo en config/db.js
 * 2. Se necesita la el token de identidad. Este se consigue desde cloud, usando la comanda:     gcloud auth print-identity-token.
 *    El valor que te da hay que ponerlo en routes/userRoutes.js linea 23: let authorization = `...`
 * 3. Se necesita el token de acceso a VertexAI. Se obtiene con la comanda     gcloud auth print-access-token
 *    Añadir token en routes/userRoutes.js linea 52 const predictionAuthorization = `Bearer TOKEN`
 * 3.1 Hay que activar el extremo en Vertex AI, este contiene el modelo entrenado y el enlace para poder utilizar la llamada API.
 */
dotenv.config();

const app = express();

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);


connectDB(); // Lo comento por ahora pero esto funciona bien

app.get("/", async (req, res) => {
  res.send("API is running...");
});
app.get("/Camera", async (req, res) => {   
  res.json(await getUserHistory());
});
app.get("/fotos", async (req, res) => {
  res.json(await getUserHistory());
});

app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));

//app.listen(process.env.PORT,console.log("server started"))
