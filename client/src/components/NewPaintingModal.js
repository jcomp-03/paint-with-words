import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import GeneratePaintingForm from "./FormGeneratePainting";

function NewPaintingModal() {
  const [showModal, setShowModal] = useState(false);
  
  const handleOnCloseModal = () => {
    console.log("onClose event ran");
    setShowModal(false);
  };
  
  const handleOnHideModal = () => {
    console.log("onHide event ran");
    setShowModal(false);
  };

  // set showModal state to true after the initial rendering (mounting)
  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <>
      <Modal
        className="modal__container"
        show={showModal}
        animation={true}
        onHide={handleOnHideModal}
        backdrop="static"
      >
        <Modal.Header className="modal__header">
          <Button onClick={handleOnCloseModal}>
            <i className="fa-solid fa-xmark"></i>
          </Button>
        </Modal.Header>
        <Modal.Body className="modal__body">
          <p className="modal__body__p">
            Ready to paint with just words? This web app is simple, and fun! All
            you have to do is click the record button when you're ready, say
            what you wish to have painted or drawn, and then stop the recording.
            Aftewards, select a few options below like the image size and the
            number of distinct images you wish to render.
          </p>
          <GeneratePaintingForm />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewPaintingModal;
