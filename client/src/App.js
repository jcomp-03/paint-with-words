import React from "react";
import Header from "./components/Header";
import Jumbotron from "./components/Jumbotron";
import PaletteButton from "./components/PaletteButton";

function App() {
  return (
    <div className="main">
      <Header />
      <Jumbotron />
      <PaletteButton />
    </div>
  );
}

export default App;
