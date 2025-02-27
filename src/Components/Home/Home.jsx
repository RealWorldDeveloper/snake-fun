import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="home">
      <Link to={"/game"}>
        <img
          src="/start-button.png
       "
          alt=""
        />
      </Link>
    </div>
  );
}

export default Home;
