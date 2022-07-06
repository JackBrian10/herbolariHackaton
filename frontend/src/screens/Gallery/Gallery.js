import GoogleMaps from "simple-react-google-maps";
import axios from "axios";
import React, { useEffect, useState } from "react";

import GalleryGrid from "../../components/GalleryGrid/GalleryGrid";
import MainScreen from "../../components/MainScreen/MainScreen";
import Template from "../../components/Template/Template";
import "./Gallery.css";

function Map({ data }) {
  return (
    <GoogleMaps
      apiKey={"AIzaSyC7sUH5S7cl5Ls-fS2My5IOkPp7_2rR2FI"}
      style={{ height: "600px", width: "100%" }}
      zoom={13}
      center={{ lat: 41.501965, lng: 2.105699 }}
      markers={data.map((plant) => ({
        lat: parseFloat(plant.location.latitude),
        lng: parseFloat(plant.location.longitude),
      }))}
    />
  );
}

const Gallery = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios
      .get("/fotos")
      .then((data) => setData({ data: data.data }))
      .catch((error) => setData({ error }));
  }, []);

  // Error handling.
  if (data !== null && data.error) {
    let errors = [];
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
      <Template title="Mapa">
        {data !== null ? (
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
