const mongoose = require("mongoose");

// Conexion a la base de datos. Tener en cuenta que el enlace mongodb va
// cambiando cada vez que se enciende la maquina virtual donde tenemos la BBDD en docker.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://34.175.217.85:27017/test");
    //         //useUnifiedTopolgy: true,
    useNewUrlParser: true,
      //         //useCreateIndex: true,
      console.log(
        `****************************MongoDB Connnected: ${conn.connection.host}`
      );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
