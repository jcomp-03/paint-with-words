import React from "react";
import rainbowBackground from '../images/rainbow.png';


const Jumbotron = () => {
  
    return (
    <svg
      viewBox="0 0 500 250"
      className="svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="pattern"
          className="svg__pattern"
          viewBox="0 0 100 100"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <image className="svg__pattern--image" href={rainbowBackground} />
        </pattern>
      </defs>
      <path
        id="path"
        className="svg__path"
        d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97"
      />
      <text className="svg__text">
        <textPath href="#path">Paint With Words!</textPath>
      </text>
    </svg>
  );
};

export default Jumbotron;
