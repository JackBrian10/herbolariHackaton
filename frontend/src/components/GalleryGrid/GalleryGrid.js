import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const GalleryGrid = ({ data }) => {
  return (
   

    <Row xs={1} md={4} className="g-4">
      {data.map((plant, index) => (
        <Col key={index}>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Card border="light" style={{ width: "80%" }}>
              <Card.Img variant="top" src={plant.image} />
              <Card.Body>
                <Card.Title>{plant.name || "unknown name"}</Card.Title>
                <Card.Text>
                  {plant.location.latitude}
                  {plant.location.longitude}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Date:{plant.date}</small>
              </Card.Footer>
            </Card>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default GalleryGrid;
