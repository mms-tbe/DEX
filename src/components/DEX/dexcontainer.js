import DEX from "./dex.js";
import React, { useState, useEffect, useMemo } from "react";

const nativeAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

const tokens = {
  eth: {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    logoURI:
      "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
  },
  bnb: {
    symbol: "BNB",
    name: "BNB",
    decimals: 18,
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    logoURI:
      "https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c_1.png",
  },
  matic: {
    symbol: "MATIC",
    name: "MATIC",
    decimals: 18,
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    logoURI:
      "https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
  },
};

export function ReturnDex({ chain }) {
  switch (chain) {
    case "eth":
      return <DEX chain="eth" fromTokenArg={tokens.eth} />;
    case "bsc":
      return <DEX chain="bsc" fromTokenArg={tokens.bnb} />;
    case "polygon":
      return <DEX chain="polygon" fromTokenArg={tokens.matic} />;
  }
}

function DexContainer({ customTokens = {} }) {
  const [chain, setChain] = useState("eth");

  return (
    <div style={{ marginTop: "130px" }}>
      <div className="d-flex justify-content-center">
        <ul style={{ fontSize: "14px" }} class="nav nav-tabs">
          <li class="nav-item">
            <button
              className={chain == "eth" ? "active nav-link" : "nav-link"}
              onClick={() => setChain("eth")}
            >
              Ethereum
            </button>
          </li>
          <li class="nav-item">
            <button
              className={chain == "bsc" ? "active nav-link" : "nav-link"}
              onClick={() => setChain("bsc")}
            >
              Binance Smart Chain
            </button>
          </li>
          <li class="nav-item">
            <button
              className={chain == "polygon" ? "active nav-link" : "nav-link"}
              onClick={() => setChain("polygon")}
            >
              Polygon
            </button>
          </li>
        </ul>
      </div>
      <ReturnDex chain={chain} />
    </div>
  );
}

export default DexContainer;
