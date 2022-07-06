import Webcam from "react-webcam";
import axios from "axios";
import MainScreen from "../../components/MainScreen/MainScreen";
import { Button } from "react-bootstrap";
import React from "react";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "environment"
}

const Camera = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null)

  const [nombreArbol, setNombreArbol] = React.useState("")
  const [posibleArbol, setPosibleArbol] = React.useState("")

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    },
    [webcamRef, setImgSrc]
  );

  const findMe = () => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  })

  const envio = async () => {
    const cords = await findMe();
    sendImg(cords);
  }

  const sendImg = async (position) => {
    console.log('Sending image...')
    const res = await axios.post('/api/users/camera',
      {
        image: imgSrc.toString(),
        coords: {
          lat: position.coords.latitude,
          long: position.coords.longitude
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!("tree" in res.data)) {
      setNombreArbol("No he podido saber que arbol es.\n")
      setPosibleArbol("El arbol mas cercano a tu posicion que conocemos es " + res.data.closestTree.nameTree)
    } else {

      setNombreArbol("Este arbol es un " + res.data.tree)

      console.log(res.data)
      if (res.data.tree === res.data.closestTree.nameTree) {
        setPosibleArbol("")
      } else {
        setPosibleArbol("El arbol mas cercano a tu posicion que conocemos es " + res.data.closestTree.nameTree)
      }
    } 


  }
  

  return (
    <MainScreen title="Fer Foto">
      {(imgSrc != null) ?
        <div class="text-center">
          <img src={imgSrc} alt="image1" class="rounded"></img>
          <br></br>
          <Button variant ="primary" >Leaf Recognition</Button>
          <Button variant="primary" onClick={envio} > Tree Recognition </Button>
          <Button variant="primary" onClick={(e) => { e.preventDefault(); setImgSrc(null) }}> Try again </Button>
          <br></br>
          
          
          <h3>
          {(nombreArbol == null) ? "" : nombreArbol} <br/>
          {posibleArbol}
          
          </h3>
        </div>
        :
        <div class="text-center">

          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            videoConstraints={videoConstraints}
          />
          <br></br>
          <Button variant="primary" onClick={capture}>Capture photo</Button>

        </div>}
    </MainScreen>
  );
};

export default Camera;
