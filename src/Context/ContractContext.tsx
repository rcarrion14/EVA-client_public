import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ethers } from "ethers";
import { abiEva } from "../contracts/EVA/EverValueCoinAbi";
import { abiBurnVault } from "../contracts/BurnVault/BurnVaultAbi";
import { abiMarket } from "../contracts/Market/MarketAbi";
import { EverValueCoin } from "../contracts/EVA/EverValueCoin";
import { BTTBurnVault } from "../contracts/BurnVault/BurnVault";
import { EVAMarketWbtc } from "../contracts/Market/Market";
import {
  addrEva,
  addrBurnVault,
  addrMarket,
  addrUsdt,
  addrWbtc,
} from "../contracts/addresses";
import { useConnection } from "./ConnectionContext";

interface ContractContextType {
  evaContract: EverValueCoin | null;
  usdtContract: EverValueCoin | null;
  wbtcContract: EverValueCoin | null;
  burnVaultContract: BTTBurnVault | null;
  marketContract: EVAMarketWbtc | null;
}

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

export const ContractProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [evaContract, setEvaContract] = useState<EverValueCoin | null>(null);
  const [usdtContract, setUsdtContract] = useState<EverValueCoin | null>(null);
  const [wbtcContract, setWbtcContract] = useState<EverValueCoin | null>(null);

  const [burnVaultContract, setBurnVaultContract] =
    useState<BTTBurnVault | null>(null);
  const [marketContract, setMarketContract] = useState<EVAMarketWbtc | null>(
    null
  );

  const { signer } = useConnection();

  useEffect(() => {
    if (signer) {
      const evaCoin = new ethers.Contract(
        addrEva,
        abiEva,
        signer
      ) as unknown as EverValueCoin;
      setEvaContract(evaCoin);

      const usdt = new ethers.Contract(
        addrUsdt,
        abiEva,
        signer
      ) as unknown as EverValueCoin;
      setUsdtContract(usdt);

      const wbtc = new ethers.Contract(
        addrWbtc,
        abiEva,
        signer
      ) as unknown as EverValueCoin;
      setWbtcContract(wbtc);

      const burnVault = new ethers.Contract(
        addrBurnVault,
        abiBurnVault,
        signer
      ) as unknown as BTTBurnVault;
      setBurnVaultContract(burnVault);

      const market = new ethers.Contract(
        addrMarket,
        abiMarket,
        signer
      ) as unknown as EVAMarketWbtc;
      setMarketContract(market);
    } else {
      setEvaContract(null);
      setBurnVaultContract(null);
      setMarketContract(null);
    }
  }, [signer]);

  return (
    <ContractContext.Provider
      value={{
        evaContract,
        usdtContract,
        wbtcContract,
        burnVaultContract,
        marketContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
