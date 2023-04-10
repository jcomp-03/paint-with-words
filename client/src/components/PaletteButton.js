import React from "react";

const PaletteButton = ({ handleOpenModal }) => {
  return (
    <button
      onClick={handleOpenModal}
      className="palette__button"
      id="palette-button"
    ></button>
  );
};

export default PaletteButton;
