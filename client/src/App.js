import React, { useState } from "react";
import Header from "./components/Header";
import Jumbotron from "./components/Jumbotron";
import PaletteButton from "./components/PaletteButton";
import ModalComponent from "./components/Modal";

function App() {
  // state variables
  const [showModal, setShowModal] = useState(false);

  // event handlers
  const handleCloseModal = () => setShowModal(false);
  const handleOpenModal = () => setShowModal(true);

  return (
    <div className="main">
      <Header />
      <Jumbotron />
      <PaletteButton handleOpenModal={handleOpenModal} />
      <ModalComponent
        showModal={showModal}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
}

export default App;
