import React, { useRef, useState } from "react";

import { ethers } from "ethers";
import { useGeneralData } from "../Context/GeneralDataContext";
import OperationsButton from "./OperationButton";

import { useUserData } from "../Context/UserDataContext";
import { FrontEndObjectsInterface_Home } from "../utils/Interfaces";
import {
  bigIntBalanceToFront,
  btcToBurnedEva,
  btcToEva,
  btcToUsd,
  burnedEvaToBtc,
  evaToBtc,
  evaToUsd,
} from "../utils";
import EvaDisponible from "./Modals/EvaDisponible";
import AddTokens from "./Modals/AddTokens";
import { useConnection } from "../Context/ConnectionContext";

const Home: React.FC = () => {
  const [operationType, setOperationType] = useState<
    "buy" | "sell" | "burnVault"
  >("buy");
  const [inputSpendValue, setInputSpendValue] = useState("");
  const inputSpendRef = useRef<HTMLInputElement>(null);

  const [inputReceiveValue, setInputReceiveValue] = useState("");
  const inputReceiveRef = useRef<HTMLInputElement>(null);
  const [isAddVisible, setIsAddVisible] = useState(false);

  const {
    satsPerEva,
    api_satsPerEva,
    fee,
    backingRate,
    vaultBalance_Wbtc,
    totalSupply_Eva,
    priceBtcUsd,
    api_vaultBalance_Wbtc,
    api_fee,
    api_totalSupply_Eva,
  } = useGeneralData();
  const { userBalance_Eva, userBalance_Wbtc } = useUserData();

  const { isConnected } = useConnection();

  const frontEndObjects = (): FrontEndObjectsInterface_Home => {
    if (operationType == "buy") {
      const inputSpend = {
        text: "pay:",
        img: "./coinBTC.png",
        coin: "wBTC",
        handleChange: (n: string) =>
          btcToEva(
            n,
            satsPerEva ?? api_satsPerEva,
            fee ?? api_fee,
            operationType
          ),
        balance: bigIntBalanceToFront(userBalance_Wbtc, 8, 6),
        handle100: () => {
          if (userBalance_Wbtc) {
            setInputSpendValue(ethers.formatUnits(userBalance_Wbtc, 8));
            setInputReceiveValue(
              btcToEva(
                ethers.formatUnits(userBalance_Wbtc, 8),
                satsPerEva ?? api_satsPerEva,
                fee ?? api_fee,
                "buy"
              )
            );
          }
        },
        priceInDollars: btcToUsd(inputSpendValue, priceBtcUsd),
      };
      const inputReceive = {
        img: "./coinEV.png",
        coin: "EVA",
        handleChange: (n: string) =>
          evaToBtc(
            n,
            satsPerEva ?? api_satsPerEva,
            fee ?? api_fee,
            operationType
          ),
        balance: bigIntBalanceToFront(userBalance_Eva, 18, 2),
        priceInDollars: evaToUsd(
          inputReceiveValue,
          satsPerEva ?? api_satsPerEva,
          fee ?? api_fee,
          priceBtcUsd
        ),
      };
      return { inputSpend, inputReceive };
    }
    if (operationType == "sell") {
      const inputSpend = {
        text: "sell:",
        img: "./coinEV.png",
        coin: "EVA",
        handleChange: (n: string) =>
          evaToBtc(
            n,
            satsPerEva ?? api_satsPerEva,
            fee ?? api_fee,
            operationType
          ),
        balance: bigIntBalanceToFront(userBalance_Eva, 18, 2),
        handle100: () => {
          if (userBalance_Eva) {
            setInputSpendValue(ethers.formatUnits(userBalance_Eva, 18));
            setInputReceiveValue(
              evaToBtc(
                ethers.formatUnits(userBalance_Eva, 18),
                satsPerEva ?? api_satsPerEva,
                fee ?? api_fee,
                "sell"
              )
            );
          }
        },
        priceInDollars: evaToUsd(
          inputSpendValue,
          satsPerEva ?? api_satsPerEva,
          fee ?? api_fee,
          priceBtcUsd
        ),
      };
      const inputReceive = {
        img: "./coinBTC.png",
        coin: "wBTC",
        handleChange: (n: string) =>
          btcToEva(
            n,
            satsPerEva ?? api_satsPerEva,
            fee ?? api_fee,
            operationType
          ),
        balance: bigIntBalanceToFront(userBalance_Wbtc, 8, 6),
        priceInDollars: btcToUsd(inputReceiveValue, priceBtcUsd),
      };
      return { inputReceive, inputSpend };
    } else {
      // BURN
      const inputSpend = {
        text: "burn:",
        img: "./coinEV.png",
        coin: "EVA",
        handleChange: (n: string) =>
          burnedEvaToBtc(n, totalSupply_Eva, vaultBalance_Wbtc),
        balance: bigIntBalanceToFront(userBalance_Eva, 18, 2),
        handle100: () => {
          if (userBalance_Eva) {
            setInputSpendValue(ethers.formatUnits(userBalance_Eva, 18));
            setInputReceiveValue(
              burnedEvaToBtc(
                ethers.formatUnits(userBalance_Eva, 18),
                totalSupply_Eva,
                vaultBalance_Wbtc
              )
            );
          }
        },
        priceInDollars: evaToUsd(
          inputSpendValue,
          satsPerEva ?? api_satsPerEva,
          fee ?? api_fee,
          priceBtcUsd
        ),
      };
      const inputReceive = {
        img: "./coinBTC.png",
        coin: "wBTC",
        handleChange: (n: string) => btcToBurnedEva(n, backingRate),
        balance: bigIntBalanceToFront(userBalance_Wbtc, 8, 5),
        priceInDollars: btcToUsd(inputReceiveValue, priceBtcUsd),
      };
      return { inputSpend, inputReceive };
    }
  };
  const [oneToShow, setoneToShow] = useState<"EVA" | "SATS">("EVA");

  const priceToShow = () => {
    const priceCalc = () => {
      if (operationType == "burnVault") {
        return (
          <div>
            {oneToShow == "EVA"
              ? ethers.parseUnits(
                  burnedEvaToBtc(
                    "1",
                    BigInt(Number(api_totalSupply_Eva)),
                    BigInt(Number(api_vaultBalance_Wbtc))
                  ),
                  8
                ) + " SATS"
              : (
                  1 /
                  Number(
                    ethers.parseUnits(
                      burnedEvaToBtc(
                        "1",
                        BigInt(Number(api_totalSupply_Eva)),
                        BigInt(Number(api_vaultBalance_Wbtc))
                      ),
                      8
                    )
                  )
                ).toFixed(3) + " EVA"}
          </div>
        );
      }
      if (operationType == "buy") {
        return (
          <div>
            {oneToShow == "EVA" && (satsPerEva || api_satsPerEva)
              ? (satsPerEva! ?? api_satsPerEva).toString() + " SATS"
              : (1 / Number(satsPerEva! ?? api_satsPerEva)).toFixed(5) + " EVA"}
          </div>
        );
      }
      if (operationType == "sell") {
        return (
          <div>
            {oneToShow == "EVA" && (satsPerEva || api_satsPerEva)
              ? (
                  ((satsPerEva! ?? api_satsPerEva) * (1000n - api_fee!)) /
                  1000n
                ).toString() + " SATS"
              : (
                  1 /
                  Number(
                    ((satsPerEva! ?? api_satsPerEva) * (1000n - api_fee!)) /
                      1000n
                  )
                ).toFixed(5) + " EVA"}
          </div>
        );
      }
    };

    return (
      <>
        <div>1 {oneToShow}</div>
        <img className="icon-price" src="arrows.png" alt="" />
        {priceCalc()}
      </>
    );
  };

  return (
    <div id="home" className="seccion home">
      <EvaDisponible />
      <div
        className={operationType != "burnVault" ? "opaco" : "transparent"}
      ></div>
      <div className="exchange-container">
        <div className="selection-container">
          <div
            className={
              operationType == "buy" || operationType == "sell"
                ? "operation active"
                : "operation"
            }
            onClick={() => {
              setInputReceiveValue("");
              setInputSpendValue("");
              setOperationType("buy");
            }}
          >
            Market
          </div>

          <div
            className={
              operationType == "burnVault" ? "operation active" : "operation"
            }
            onClick={() => {
              setInputReceiveValue("");
              setInputSpendValue("");
              setOperationType("burnVault");
            }}
          >
            Burn Vault
          </div>
          <div
            onClick={() => setIsAddVisible(true)}
            className="addToken operation"
          >
            Add tokens
          </div>
        </div>
        {isAddVisible ? (
          <AddTokens setIsModalOpen={() => setIsAddVisible(false)} />
        ) : null}
        <div className="input-container">
          {operationType == "buy" || operationType == "sell" ? (
            <div
              onClick={() => {
                setInputSpendValue("");
                setInputReceiveValue("");

                if (operationType == "buy") {
                  setOperationType("sell");
                } else {
                  setOperationType("buy");
                }
              }}
              className="G tooltip"
            >
              <img className="arrow" src="/exchange.png" alt="" />

              {/*  <span className="tooltiptext">
                <div className="marginforText">There is no WBTC for sale.</div>
                <div>Plese proceed to our Burn Vault.</div>
              </span> */}
            </div>
          ) : null}
          <div className="youPay-container">
            You {frontEndObjects().inputSpend.text}
          </div>
          <div className="input-row">
            <input
              placeholder="0"
              ref={inputSpendRef}
              type="number"
              onChange={(e) => {
                if (e.target.value != "") {
                  setInputSpendValue(e.target.value);
                  setInputReceiveValue(
                    frontEndObjects()
                      .inputSpend.handleChange(e.target.value)
                      .toString()
                  );
                } else {
                  setInputReceiveValue("");
                  setInputSpendValue("");
                }
              }}
              value={inputSpendValue}
            />
            <div className="coin-container">
              <img src={frontEndObjects().inputSpend.img} />
              <div>{frontEndObjects().inputSpend.coin}</div>
            </div>
          </div>
          <div className="balance-row">
            <div>$ {frontEndObjects().inputSpend.priceInDollars}</div>
            {isConnected ? (
              <div className="balance-number">
                <div>Balance: {frontEndObjects().inputSpend.balance}</div>
                <div
                  onClick={() => {
                    frontEndObjects().inputSpend.handle100();
                  }}
                  className="cienPor100"
                >
                  Max
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ zIndex: "0" }} className="input-container">
          <div className="youPay-container">You receive:</div>
          <div className="input-row">
            <input
              placeholder="0"
              disabled={operationType == "burnVault"}
              ref={inputReceiveRef}
              type="number"
              onChange={(e) => {
                if (Number(e.target.value) >= 0) {
                  setInputReceiveValue(e.target.value);
                  setInputSpendValue(
                    frontEndObjects()
                      .inputReceive.handleChange(e.target.value)
                      .toString()
                  );
                } else {
                  setInputReceiveValue("");
                  setInputSpendValue("");
                }
              }}
              value={inputReceiveValue}
            />
            <div className="coin-container">
              <img src={frontEndObjects().inputReceive.img} />
              <div>{frontEndObjects().inputReceive.coin}</div>
            </div>
          </div>
          <div className="balance-row">
            <div>$ {frontEndObjects().inputReceive.priceInDollars}</div>
            {isConnected ? (
              <div className="balance-number">
                <div>Balance: {frontEndObjects().inputReceive.balance}</div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="precio-container">
          <div className="naranja">Price:</div>
          <div className="textoPrecio">
            {priceToShow()}
            <img
              onClick={() => {
                if (oneToShow == "EVA") setoneToShow("SATS");
                if (oneToShow == "SATS") setoneToShow("EVA");
              }}
              className="icon-price"
              src="circle.png"
              alt=""
            />
          </div>
        </div>
        <OperationsButton
          operationType={operationType}
          amountDecimalSpend={inputSpendValue}
          amountDecimalReceive={inputReceiveValue}
        />
        <div className="containerTotalSupply">
          <div className="precio-container">
            <div>
              <span className="textoTotalSupply">EVA total supply:</span>{" "}
              <span className="numberTotalSupply">
                {api_totalSupply_Eva
                  ? bigIntBalanceToFront(
                      BigInt(Number(api_totalSupply_Eva)),
                      18,
                      0
                    )
                  : "-"}
              </span>
            </div>
            <div
              onClick={() => {
                window.open(
                  "https://arbiscan.io/token/0x45D9831d8751B2325f3DBf48db748723726e1C8c"
                );
              }}
              className="checkExplorer"
            >
              Check on the explorer
            </div>
          </div>
          <div className="precio-container">
            <div>
              <span className="textoTotalSupply">wBTC in Vault:</span>{" "}
              <span className="numberTotalSupply">
                {api_vaultBalance_Wbtc
                  ? bigIntBalanceToFront(
                      BigInt(Number(api_vaultBalance_Wbtc)),
                      8,
                      5
                    )
                  : "-"}
              </span>
            </div>
            <div
              onClick={() => {
                window.open(
                  "https://arbiscan.io/address/0xA89d65deF0A001947d8D5fDda93F9C4f8453902e#tokentxns"
                );
              }}
              className="checkExplorer"
            >
              Check on the explorer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

/*import ReactPixel from "react-facebook-pixel";
const FACEBOOK_PIXEL_ID = "828217105410053";
ReactPixel.trackCustom("ButtonClick_better");
ReactPixel.track("ButtonClicked"); 

ReactPixel.init(FACEBOOK_PIXEL_ID, undefined, {
  autoConfig: false,
  debug: true,

    useEffect(() => {
    ReactPixel.pageView();
    ReactPixel.track("ViewContent", {
      content_name: "example content",
    });
  }, []);

});*/
