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
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU4MGFkYjBjMzJhMTc1ZDk1MGExYzE5MDFjMTgyZmMxNzM0MWRkYzQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAyOTg4OTU5MTEyNzczNzgxMzA1IiwiZW1haWwiOiJqYWNreWNob3BjaG9wQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiQ2w5SlpwT2duamdfcmZUeGxjRkdnZyIsImlhdCI6MTY1NTcyNzI1NiwiZXhwIjoxNjU1NzMwODU2LCJqdGkiOiI4ZDM2NmNjZWQwMGQ0NjM3NDczOWU5MmEyNjFlZWJkOWI4ZTY2MWQzIn0.krXBTWX0ADUsIVjqzHV3kL2PtZ-p0b_Xzu25CgoUJ-HIKvqmqq0FSZQl335kD3rRWY64xt4IjZISHXPAbkN3_Y3FSmyUxgC8jKTSPl2DtnRfpuNvcJNobmKzWMA-iRqD56HxtzW9JK6Nvjp_FgEcwt0vhYrcurv6uONNeB3yrxChU6qUENTnQQH6rBHWc60HmSlWPUKa0NMbp0LCwF9qf0a4lQdoIxESIVUs7yyqASvwFeHVfdK1XV9RVcICVYp2SRkntZam4zPNFxhU6aKQud8TBL9LHlax7mhjRAB_N3OnVWiNDBW--GvJMlmVHIeQHz4N3dg1kMEFzuk5HXimaQ";
  // axios.post(url, data, options)
  // data: { 'key': 'value' } Aqui lo importante
  // options: { headers: { ... } } //Dentro de headers necesitaremos dos objetos: Authorization y Content-Type, en priincipio no necesitamos mas dentro de aqui

  // Recibir arbol mas cercano y sus coordenadas
  const test = await axios
    .post(
      `https://us-central1-allergies-349815.cloudfunctions.net/nearestTree`,
      newCoords,
      {
        headers: {
          Authorization: "Bearer " + authorization,
          "Content-Type": "application/json",
        },
      }
    )
    .then((val) => val.data)
    .catch((err) => {
      console.log(err.message);
    }); //Dentro de los corchetes {} hacer lo que haga falta con los datos

  /////////////////////////////////////////////////
  // //// PREDICCION DE IMAGEN
  // predictionReq = {
  //     'instances': [{ 
  //         'content': imagen (string en base64),
  //     }],
  //     'parameters': {
  //         'confidenceTreshold': 0-1,
  //         'maxPredictions': 2
  //     }
  // }

  //PARA OBTENER ESTE TOKEN USAR EN GOOGLE CLOUD LA COMANDA gcloud auth print-access-token
  const predictionAuthorization = `Bearer ya29.A0ARrdaM_7TBKhZF9EStRkIVdRb66TQdqgu9y4oSchz2y4bMdCytogGenWF9mS9huSJ_n3r7WB5M2u-tm-cQHKgHuDJlYBTQmld6t_AvcS4bpAQ1OKhFgCsqtGqpgrCU5wOGxU92doStRuiuR0tEb3aInrnayQyVhR_L9Z3IpoRRfCuOtLsvTPoQo9xMxIT0OCUz9n2HdtV5yiyn2hJj7nTNyrg9UyT7HGWdn8pVbSOFRPFqS9OTGIM6kLGuGI_yX8zVQaW04YUNnWUtBVEFTQVRBU0ZRRl91NjFWX3FjOW5DcFA4SDlCYWFOVXJ4NE1KZw0270`;

  let treeName = await axios
    .post(
      `https://europe-west4-aiplatform.googleapis.com/v1/projects/allergies-349815/locations/europe-west4/endpoints/4317104863113641984:predict`,
      {
        instances: [
          {
            content: req.body.image.replace(`data:image/jpeg;base64,`, ""),
          },
        ],
        parameters: {
          confidenceThreshold: 0.5,
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

  ////////////////////////////////////////////
  // // AÑADIR A UN BUCKET IMAGENES
  //    Hay que mandar un buffer de la imagen usando pipes
  //     const storage = new Storage();
  //     const bucket = storage.bucket('test_bucket_85632945672984')

  //     const blob = bucket.file('name.jpg');
  //     const blobStream = blob.createWriteStream()
  //     let buf = Buffer.from(req.body.image, 'base64');
  //     blobStream.on('finish', () => {
  //         const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
  //     })
  //     blobStream.end(buf);
  //

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
