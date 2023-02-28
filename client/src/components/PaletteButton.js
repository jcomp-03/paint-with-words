import React from "react";

const PaletteButton = ({ handleOpenModal }) => {
  return (
    <button
      onClick={handleOpenModal}
      className="main__button"
      id="main-button"
    ></button>
  );
};

export default PaletteButton;
