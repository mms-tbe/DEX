import React from "react";
import ParticleBackground from "./particlebackground";
import cryptoicons from "./cryptos.png";
import { Link } from "react-router-dom";

const style = {
  main: {
    background: "rgba(245, 245, 245, 0.5)",
    backdropFilter: "blur(4px)",
    width: "700px",
  },
};

function Home() {
  return (
    <div style={{ marginTop: "200px" }}>
      <div className="wrapper p-5" style={style.main}>
        <div className="d-flex">
          <div class="mb-5 mb-lg-0 text-center text-lg-start">
            <h1 style={{ fontFamily: "Newsreader" }} class="display-4 lh-1 m-0">
              ChainBlock
            </h1>
            <p class="lead fw-normal text-muted">
              Transfer and exchange your crypto!
            </p>
            <div class="d-flex flex-column flex-lg-row align-items-center mt-4">
              <Link to="/dex" className="btn btn-primary btn-lg me-3">
                Exchange
              </Link>
              <Link to="/transfer" className="btn btn-outline-primary btn-lg">
                Transfer
              </Link>
            </div>
          </div>
          <div>
            <img className="crypto-icons" src={cryptoicons} width="300px" />
          </div>
        </div>
      </div>
      <ParticleBackground />
    </div>
  );
}

export default Home;
