const express = require("express");
const plant_require = require("../models/userModel").plants;
const { registerUser, loginUser } = require("../controllers/userControllers");
const router = express.Router();
const axios = require("axios");
const { Storage } = require("@google-cloud/storage");
const { plant } = require("../models/userModel");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//Procesamos la imagen que recibimos desde el front end. Aqui se hace la prediccion
router.route("/camera").post(async (req, res) => {
  imagen = req.body.image;
  coordenadas = req.body.coords;
  newCoords = {
    latitude: coordenadas.lat,
    longitude: coordenadas.long,
  };

  //EJEMPLO DE PETICION A UNA CLOUD FUNCTION
  //COMO SACAR LA AUTHORIZATION? Desde google cloud, ir a la consola y poner este comando: gcloud auth print-identity-token

  let authorization =
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI2NTBhMmNlNDdiMWFiM2JhNDA5OTc5N2Y4YzA2ZWJjM2RlOTI4YWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAyOTg4OTU5MTEyNzczNzgxMzA1IiwiZW1haWwiOiJqYWNreWNob3BjaG9wQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiRU9LWWNkVkcxTlNiN3d0MjdyakFoZyIsImlhdCI6MTY1NzEyNTYwNiwiZXhwIjoxNjU3MTI5MjA2LCJqdGkiOiJlMDI2NzNjNDE0ZjFmMmZkMDRjZjYwYTA0MDkwODUyYmZlMTZkNGE1In0.dOT79LaqB56gokeYxV-BOSaE8h1qTFtxBU_whpoICBhWfWGPLt0RLq7ZpU15uXEt1rIbPeR8jJGcZRNGSo_LpD_nNk5E2HXvLU8UNtRGEa5YGaw1XVUJsT7aSdKSuVP899Z5cDZP1FJklM7_jMIR9Hwj7xNBWetXpuAD7cyUCd73VmGoVCrd7XMyL8J94DeaeS34Iq-oJsAh0YFC7S7n-wzK76WWTJeEr6hMZsvM08MdTxnnLyRnm17Au1gOyDUK6UgkMivbISkHlWBFEgGKPwVLLyJDb5Pdak-yTrTdySXDTUp3A_2TSL-V1KJahhs543xYUfMspGNP838R_1ZBTw";

  // Recibir arbol mas cercano y sus coordenadas
  const test = await axios
    .post(
      `https://europe-west3-allergies-349815.cloudfunctions.net/nerestTree`,
      newCoords,
      {
        headers: {
          Authorization: "Bearer " + authorization,
          "Content-Type": "application/json",
        },
      }
    )
    .then((val) => {
      return val.data;
    })

    .catch((err) => {
      console.log(err.message);
    });

  //PARA OBTENER ESTE TOKEN USAR EN GOOGLE CLOUD LA COMANDA gcloud auth print-access-token
  const predictionAuthorization = `Bearer ya29.a0ARrdaM9oaZ1IToyARoTLgx2f6IHt-PtuUVF0A_wva8M63g9crZLHt121Kpru27V6oo54HYdnwqM1iQ1ApnVhewAcboBgkh9B0-32qsRJ8aG-U9HLfuJhcdUUVxXvMWlaQABAe4HdKEbmjxKg-20QbOPq820Mrr1TsDhdCbPH0RGyA3KViELaaZkdopRpoysdcUEb_fu0mV9QM6QKhzwEWH6tplEngeenJXsg1HbCESp2xaHRNXrZ4lJw3IrOx-xn1Nsy0cU`;

  let treeName = await axios
    .post(
      `https://europe-west4-aiplatform.googleapis.com/v1/projects/allergies-349815/locations/europe-west4/endpoints/9032936622923972608:predict`,
      {
        instances: [
          {
            content: req.body.image.replace(`data:image/jpeg;base64,`, ""),
          },
        ],
        parameters: {
          confidenceThreshold: 0.6,
          maxPredictions: 1,
        },
      },
      {
        headers: {
          Authorization: predictionAuthorization,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(response.data.predictions);
      console.log(response.data.predictions[0].confidences);
      //Argmax porque el maxPredictions lo ignora
      let confidence = response.data.predictions[0].confidences;
      maxProbabilityIndex = confidence.indexOf(Math.max(...confidence));
      return response.data.predictions[0].displayNames[maxProbabilityIndex];
    })
    .catch((err) => {
      console.log(err.response.data);
    });

  if (treeName == undefined) {
    // Control de si la prediccion obtiene algun resultado segun el threshold o no
    console.log("Treename undefined, mandando " + test);
    res.status(200).json({ closestTree: test });
  } else {
    console.log(treeName);
    treeName = treeName.replace("_", " ");
    treeName = treeName.charAt(0).toUpperCase() + treeName.slice(1);

    res.status(200).json({ tree: treeName, closestTree: test });
  }

  let random_number = Math.random();
  //Export data to MongoDB:
  const new_plant = new plant_require({
    _id: random_number,
    name: treeName,
    image: imagen,
    date: new Date(),
    location: newCoords,
  });
  new_plant.save(function (err) {
    if (err) console.log(err);
    // saved!
  });
});

module.exports = router;
