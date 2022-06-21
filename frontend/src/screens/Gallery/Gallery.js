import { GoogleMap, useLoadScript,LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

import GalleryGrid from "../../components/GalleryGrid/GalleryGrid";
import MainScreen from "../../components/MainScreen/MainScreen";
import Template from "../../components/Template/Template";

import "./Gallery.css";

function Map({ data }) {
  let cent = { lat: 41.5000758, lng: 2.1058671 };

  //const markerTest = useMemo(() => ({ lat: 41.5000758, lng: 2.1058671 }), []);
  const markerTest = { lat: 41.492330124680805, lng: 2.146739759210027 };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyC7sUH5S7cl5Ls-fS2My5IOkPp7_2rR2FI"
      onLoad={() => console.log("Maps loaded successfully.")}
      onError={() => console.log("Maps returned an error.")}
    >
      <GoogleMap zoom={10} center={cent} mapContainerClassName="map-container">
        <Marker
          onLoad={() => console.log("MArker loaded successfully.")}
          onError={() => console.log("Marker returned an error.")}
          title={"The marker`s title will appear as a tooltip."}
          name={"SOMA"}
          key={1}
          position={markerTest}
        />
      </GoogleMap>
    </LoadScript>
  );
}

const Gallery = () => {
  /*const mapsState = useLoadScript({
    googleMapsApiKey: "AIzaSyC7sUH5S7cl5Ls-fS2My5IOkPp7_2rR2FI",
  });*/

  const [data, setData] = useState(null);
  useEffect(() => {
    axios
      .get("/fotos")
      .then((data) => setData({ data: data.data }))
      .catch((error) => setData({ error }));
  }, []);

  // Error handling.
  if (/*mapsState.loadError ||*/ data !== null && data.error) {
    let errors = [];
    /*if (mapsState.loadError)
      errors.push(<li>Google Maps: {mapsState.loadError}</li>);*/
    if (data.error) errors.push(<li>Backend API: {data.error}</li>);

    // TODO: Move error rendering into MainScreen and Template.
    return (
      <div>
        An error has occurred:
        <ul>{errors}</ul>
      </div>
    );
  }

  // Rendering.
  return (
    <MainScreen title="Galería">
      <Template title="Foto 1">
        {/*mapsState.isLoaded &&*/ data !== null ? (
          <>
            <Map data={data.data} />
            <GalleryGrid data={data.data} />
          </>
        ) : (
          <div>Loading...</div>
        )}
      </Template>
    </MainScreen>
  );
};

export default Gallery;
