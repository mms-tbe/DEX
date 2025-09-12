const particlesConfig = {
  fullScreen: {
    enable: true, // enabling this will make the canvas fill the entire screen, it's enabled by default
    zIndex: -1, // this is the z-index value used when the fullScreen is enabled, it's 0 by default
  },
  interactivity: {
    events: {
      onClick: {
        enable: false, // enables the click event
        mode: "push", // adds the particles on click
      },
    },
    modes: {
      push: {
        quantity: 3, // number of particles to add on click
      },
      repulse: {
        distance: 100, // distance of the particles from the cursor
      },
    },
  },
  particles: {
    number: {
      density: {
        enable: true,
      },
      value: 8,
    },
    links: {
      enable: true, // enabling this will make particles linked together
      distance: 200, // maximum distance for linking the particles
      color: "#282828",
      opacity: 0.2,
    },
    move: {
      enable: true, // enabling this will make particles move in the canvas
      speed: { min: 1, max: 2 }, // using a range in speed value will make particles move in a random speed between min/max values, each particles have its own value, it won't change in time by default
    },
    opacity: {
      value: { min: 0.1, max: 0.2 }, // using a different opacity, to have some semitransparent effects
    },
    size: {
      value: { min: 30, max: 34 }, // let's randomize the particles size a bit
    },
    shape: {
      options: {
        character: {
          fill: false,
          font: "Verdana",
          style: "",
          value: "*",
          weight: "400",
        },
        char: {
          fill: false,
          font: "Verdana",
          style: "",
          value: "*",
          weight: "400",
        },
        polygon: {
          sides: 5,
        },
        star: {
          sides: 5,
        },
        image: [
          {
            src: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
            width: 32,
            height: 32,
          },

          {
            src: "https://cryptologos.cc/logos/cardano-ada-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/tezos-xtz-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/solana-sol-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/nlmmg7qyfwczxruahvjk",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/algorand-algo-logo.png",
            width: 32,
            height: 32,
          },
        ],
        images: [
          {
            src: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
            width: 32,
            height: 32,
          },

          {
            src: "https://cryptologos.cc/logos/cardano-ada-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/tezos-xtz-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/solana-sol-logo.png",
            width: 32,
            height: 32,
          },
          {
            src: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/nlmmg7qyfwczxruahvjk",
            width: 32,
            height: 32,
          },
          {
            src: "https://cryptologos.cc/logos/algorand-algo-logo.png",
            width: 32,
            height: 32,
          },
        ],
      },
      type: "image",
    },
  },
};

export default particlesConfig;
