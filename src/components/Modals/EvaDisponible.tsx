import { useState } from "react";
import { useGeneralData } from "../../Context/GeneralDataContext";
import { bigIntBalanceToFront } from "../../utils";
import Cronometro from "./Cronometro";

const EvaDisponible: React.FC = () => {
  let { marketBalance_Eva, api_marketBalance_Eva } = useGeneralData();

  const [isVisible, setIsVisible] = useState(true);

  const [showCrono, _setShowCrono] = useState(false);

  const newSaleString = "2024-09-01T13:50:00";

  const cronometro = (
    <>
      <div className="titulo-evaDisp">No EVAs Available for Sale Right Now</div>
      <div className="text-evaDisp">The next sale round starts in:</div>
      <Cronometro newSaleString={newSaleString} />
      <div className="text-evaDisp">
        Join our <span>Telegram Channel</span> and follow us on{" "}
        <span
          onClick={() => {
            window.open("https://twitter.com/evervaluecoin");
          }}
          className="linkNaranja"
        >
          Twitter
        </span>{" "}
        to be the first to know!
      </div>
    </>
  );

  const availableForSale = (
    <>
      <div className="titulo-evaDisp">EVAs Available for Sale: </div>
      <div className="number-evaDisp">
        {api_marketBalance_Eva
          ? bigIntBalanceToFront(
              BigInt(marketBalance_Eva ?? Number(api_marketBalance_Eva)),
              18,
              0
            )
          : "-"}

        <img src="coinEV.png" className="logoEvaDisp" alt="" />
      </div>
    </>
  );

  const infoToShow = () => {
    if (showCrono) return cronometro;
    if (Number(api_marketBalance_Eva) > 0) {
      return availableForSale;
    } else {
      return cronometro;
    }
  };

  const closeClass = () => {
    if (isVisible) return "close-evaDisp";
    if (!isVisible && !showCrono) return "close-evaDisp hiddenBalance";
    if (!isVisible && showCrono) return "close-evaDisp hiddenCrono";
  };

  return (
    <div className={"container-evaDisp"}>
      <div
        onClick={() => {
          setIsVisible(!isVisible);
        }}
        className={closeClass()}
      >
        <img src="greater.png" style={{ width: "10px" }} alt="" />
      </div>
      <div className={`content-evaDisp ${isVisible ? "visible" : "hidden"}`}>
        {infoToShow()}
      </div>
    </div>
  );
};

export default EvaDisponible;
