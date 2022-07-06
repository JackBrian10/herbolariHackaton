const mongoose = require("mongoose");

// Conexion a la base de datos. Tener en cuenta que el enlace mongodb va
// cambiando cada vez que se enciende la maquina virtual donde tenemos la BBDD.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
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
