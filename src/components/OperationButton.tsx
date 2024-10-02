import { useState } from "react";
import { useContract } from "../Context/ContractContext";
import { addrBurnVault, addrMarket } from "../contracts/addresses";
import { useUserData } from "../Context/UserDataContext";
import { ContractTransactionResponse } from "ethers";
import { numberParser } from "../utils";
import LoadingSpinner from "../utils/Spinner";
import { useGeneralData } from "../Context/GeneralDataContext";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { useConnection } from "../Context/ConnectionContext";

interface OperationsButtonProps {
  operationType: "buy" | "sell" | "burnVault";
  amountDecimalSpend: string;
  amountDecimalReceive: string;
}

const OperationsButton: React.FC<OperationsButtonProps> = ({
  operationType,
  amountDecimalSpend,
  amountDecimalReceive,
}) => {
  const { evaContract, burnVaultContract, marketContract, wbtcContract } =
    useContract();

  const { isConnected } = useConnection();
  const {
    allowanceMarket_Wbtc,
    allowanceMarket_Eva,
    allowanceBurnVault_Eva,
    getUserData,
  } = useUserData();
  const {
    marketBalance_Wbtc,
    marketBalance_Eva,
    getGeneralData,
    getDataFromScanner,
  } = useGeneralData();
  const [executing, setExecuting] = useState(false);
  const { open } = useWeb3Modal();

  const buttonMessage = () => {
    if (
      typeof allowanceMarket_Wbtc == "bigint" &&
      typeof allowanceBurnVault_Eva == "bigint" &&
      typeof allowanceMarket_Eva == "bigint" &&
      typeof marketBalance_Wbtc == "bigint" &&
      typeof marketBalance_Eva == "bigint" &&
      isConnected
    ) {
      if (operationType == "buy") {
        if (marketBalance_Eva < numberParser(amountDecimalReceive, "eva")) {
          return "NOT ENOUGH EVA FOR SALE";
        }
        if (allowanceMarket_Wbtc < numberParser(amountDecimalSpend, "btc")) {
          return "APPROVE";
        } else {
          return "BUY";
        }
      }

      if (operationType == "sell") {
        if (marketBalance_Wbtc < numberParser(amountDecimalReceive, "btc")) {
          return "NOT ENOUGH WBTC FOR SALE";
        }
        if (allowanceMarket_Eva < numberParser(amountDecimalSpend, "eva")) {
          return "APPROVE";
        } else {
          return "SELL";
        }
      }

      if (operationType == "burnVault") {
        if (allowanceBurnVault_Eva < numberParser(amountDecimalSpend, "eva")) {
          return "APPROVE";
        } else {
          return "BURN";
        }
      }
    } else {
      return "CONNECT WALLET";
    }
  };

  const handleTransaction = async (
    method: Promise<ContractTransactionResponse> | undefined
  ) => {
    setExecuting(true);
    if (method)
      method
        .then(async (data: any) => {
          await data.wait();
          await Promise.all([
            getUserData(),
            getGeneralData(),
            getDataFromScanner(),
          ]);
          setExecuting(false);
        })
        .catch((data) => {
          console.log(data);
          setExecuting(false);
        });
  };

  const buttonOperation = async () => {
    if (
      typeof allowanceMarket_Wbtc == "bigint" &&
      typeof allowanceBurnVault_Eva == "bigint" &&
      typeof allowanceMarket_Eva == "bigint"
    ) {
      if (operationType == "buy") {
        if (allowanceMarket_Wbtc < numberParser(amountDecimalSpend, "btc")) {
          handleTransaction(wbtcContract?.approve(addrMarket, "99999999999"));
        } else {
          handleTransaction(
            marketContract?.buy(numberParser(amountDecimalSpend, "btc"))
          );
        }
      }

      if (operationType == "sell") {
        if (allowanceMarket_Eva < numberParser(amountDecimalSpend, "eva")) {
          handleTransaction(
            evaContract?.approve(addrMarket, "99999999999999999999999999999")
          );
        } else {
          handleTransaction(
            marketContract?.sell(numberParser(amountDecimalSpend, "eva"))
          );
        }
      }

      if (operationType == "burnVault") {
        if (allowanceBurnVault_Eva < numberParser(amountDecimalSpend, "eva")) {
          handleTransaction(
            evaContract?.approve(addrBurnVault, "99999999999999999999999999999")
          );
        } else {
          handleTransaction(
            burnVaultContract?.backingWithdraw(
              numberParser(amountDecimalSpend, "eva")
            )
          );
        }
      }
    }
  };

  return (
    <>
      <button
        disabled={
          buttonMessage() == "NOT ENOUGH EVA FOR SALE" ||
          buttonMessage() == "NOT ENOUGH WBTC FOR SALE"
        }
        onClick={isConnected ? buttonOperation : () => open()}
        className="executeButton"
      >
        {executing ? <LoadingSpinner /> : buttonMessage()}
      </button>
    </>
  );
};

export default OperationsButton;
