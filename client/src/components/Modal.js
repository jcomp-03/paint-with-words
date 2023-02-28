import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FormComponent from "./Form";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";

const ModalComponent = ({ showModal, handleCloseModal, handleOpenModal }) => {

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        style={{
          color: "white",
          border: "solid 2px white",
          backgroundColor: "green",
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal__body">
          <p className="modal__body__p">
            Ready to paint with just words? This web app is simple, and fun! All
            you have to do is click the record button when you're ready, say
            what you wish to have painted or drawn, and then stop the recording.
            Aftewards, select a few options below like the image size and the
            number of distinct images you wish to render.
          </p>
          
        <FormComponent />
        </Modal.Body>
        <Modal.Footer>
          Modal footer
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalComponent;
