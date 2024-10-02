//@ts-nocheck

import img from "../../../public/coinEV_fondo.png";

import { addrEva, addrWbtc } from "../../contracts/addresses";

interface IProps {
  setIsModalOpen: any;
}

const addTokenToWallet = async (token: "eva" | "btc") => {
  const tokenAddress = token == "eva" ? addrEva : addrWbtc;
  const tokenSymbol = token == "eva" ? "EVA" : "wBTC";
  const tokenDecimals = token == "eva" ? 18 : 8;
  const tokenImage =
    token == "eva"
      ? "https://evervaluecoin.com/wp-content/uploads/2024/06/cropped-favicon-192x192.png"
      : null;

  if (window.ethereum) {
    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Tipo del token
          options: {
            address: tokenAddress, // Dirección del contrato del token
            symbol: tokenSymbol, // Símbolo del token
            decimals: tokenDecimals, // Decimales del token
            image: tokenImage, // Imagen del token
          },
        },
      });

      if (wasAdded) {
        console.log("Token añadido correctamente a la wallet");
      } else {
        console.log("El usuario rechazó la solicitud para añadir el token");
      }
    } catch (error) {
      console.error("Error al añadir el token", error);
    }
  }
};

const AddTokens: React.FC<IProps> = ({ setIsModalOpen }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-addTokens">
        <div className="addTitle">Click to add tokens to your wallet:</div>
        {/* <div className="container-notice"> */}
        <div
          onClick={() => {
            setIsModalOpen(false);
          }}
          className="closeX_notice-addTokens"
        >
          &times;
        </div>
        <div onClick={() => addTokenToWallet("btc")} className="addContainer">
          <img className="imgAddToken" src="./coinBTC.png" alt="" />
          wBTC
        </div>

        <div onClick={() => addTokenToWallet("eva")} className="addContainer">
          <img className="imgAddToken" src="./logoEVMetamask.png" alt="" />
          EVA
        </div>

        {/* </div> */}
      </div>
    </div>
  );
};

export default AddTokens;
