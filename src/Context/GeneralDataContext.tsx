import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useContract } from "./ContractContext";
import {
  addrBurnVault,
  addrEva,
  addrMarket,
  addrWbtc,
} from "../contracts/addresses";
import { ethers } from "ethers";
import axios from "axios";
import { abiMarket } from "../contracts/Market/MarketAbi";
import { EVAMarketWbtc } from "../contracts/Market/Market";

interface GeneralDataContextType {
  satsPerEva: bigint | undefined;
  fee: bigint | undefined;
  marketBalance_Eva: bigint | undefined;
  marketBalance_Wbtc: bigint | undefined;
  vaultBalance_Wbtc: bigint | undefined;
  totalSupply_Eva: bigint | undefined;
  backingRate: bigint | undefined;
  getGeneralData: () => void;
  priceBtcUsd: number | undefined;

  api_marketBalance_Eva: string | undefined;
  api_vaultBalance_Wbtc: string | undefined;
  api_satsPerEva: bigint | undefined;
  api_fee: bigint | undefined;
  api_totalSupply_Eva: string | undefined;
  getDataFromScanner: () => void;
}

const GeneralDataContext = createContext<GeneralDataContextType | undefined>(
  undefined
);

// prettier-ignore
export const GeneralDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { marketContract, evaContract, wbtcContract } = useContract();

  // Estados

  const [satsPerEva, setSatsPerEva] = useState<bigint | undefined>(undefined);
  const [fee, setFee] = useState<bigint | undefined>(undefined);
  const [marketBalance_Eva, setMarketBalance_Eva] = useState<bigint | undefined>(undefined);
  const [marketBalance_Wbtc, setMarketBalance_Wbtc] = useState<bigint | undefined>(undefined);
  const [vaultBalance_Wbtc, setVaultBalance_Wbtc] = useState<bigint | undefined>(undefined);
  const [totalSupply_Eva, setTotalSupply_Eva] = useState<bigint | undefined>(undefined);
  const [backingRate, setBackingRate] = useState<bigint | undefined>(undefined);
  const [priceBtcUsd, setPriceBtcUsd] = useState<number| undefined>(undefined);

  const [api_marketBalance_Eva, setApi_marketBalance_Eva]= useState<string| undefined>(undefined);
  const [api_vaultBalance_Wbtc, setApi_vaultBalance_Wbtc] = useState<string| undefined>(undefined);
  const [api_satsPerEva, setApi_satsPerEva] = useState<bigint| undefined>(undefined);
  const [api_fee, setApi_fee] = useState<bigint| undefined>(undefined);
  const [api_totalSupply_Eva, setApi_totalSupply_Eva]= useState<string| undefined>(undefined);

  const getBackingRate =  async () => {
    const balanceVault_wbtc = await wbtcContract?.balanceOf(addrBurnVault) 
    const totalSupply_eva = await evaContract?.totalSupply()    

    if(balanceVault_wbtc&& totalSupply_eva){
      return totalSupply_eva /balanceVault_wbtc 
    }
    else return ethers.toBigInt("0")
  }

  const getGeneralData = () => {
    if(evaContract && marketContract && wbtcContract){    
    marketContract.marketTokenPerPrecisionEva().then((data) => setSatsPerEva(data));
    marketContract?.fee().then((data) => setFee(data));
    evaContract?.balanceOf(addrMarket).then((data) => setMarketBalance_Eva(data));
    wbtcContract.balanceOf(addrMarket).then((data) => setMarketBalance_Wbtc(data));
    wbtcContract?.balanceOf(addrBurnVault).then((data) => setVaultBalance_Wbtc(data));
    evaContract?.totalSupply().then((data) => setTotalSupply_Eva(data))}
    getBackingRate().then((data) => {setBackingRate(data)})
  };

  useEffect(() => { 
    getGeneralData();
  }, [evaContract, marketContract, wbtcContract]);

  useEffect(() => {
    axios.get("https://criptoya.com/api/btc/usd").then((response) => {      
      setPriceBtcUsd(response.data.banexcoin.bid)
    })    
  })

  const getDataFromScanner = () => {
    const apiKey = "HVC71G6IUVK2V7NR57R6S5ET4VKAHIQHE7";
  
    const url = `https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=${addrEva}&address=${addrMarket}&tag=latest&apikey=${apiKey}`;
    const url2 = `https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=${addrWbtc}&address=${addrBurnVault}&tag=latest&apikey=${apiKey}`;
    const url3 = `https://api.arbiscan.io/api?module=stats&action=tokensupply&contractaddress=${addrEva}&apikey=${apiKey}`
  
    axios.get(url).then((response) => {
      const data = response.data;  
      setApi_marketBalance_Eva(data.result);
    });

    axios.get(url2).then((response) => {
      const data = response.data;  
      setApi_vaultBalance_Wbtc(data.result);
    });

    axios.get(url3).then((response) => {
      const data = response.data;        
      setApi_totalSupply_Eva(data.result);
    });    
  }

  useEffect(() => {
    getDataFromScanner()    
  }, []);

  useEffect(() => {
    const infuraUrl =
      "https://arbitrum-mainnet.infura.io/v3/6da69bef5dc4415d95b2c93c2554ddf0";
  
    const provider = new ethers.JsonRpcProvider(infuraUrl);
  
    const market = new ethers.Contract(
      addrMarket,
      abiMarket,
      provider
    ) as unknown as EVAMarketWbtc;
  
    market.marketTokenPerPrecisionEva().then((data) => {
      setApi_satsPerEva(data);
    });
    market.fee().then((data) => {      
      setApi_fee(data);
    });
  }, []);
  

  return (
    <GeneralDataContext.Provider
      value={{
        satsPerEva,
        fee,
        marketBalance_Eva,
        marketBalance_Wbtc,
        vaultBalance_Wbtc,
        totalSupply_Eva,
        backingRate,
        getGeneralData,
        priceBtcUsd,
        api_marketBalance_Eva,
        api_vaultBalance_Wbtc,
        api_satsPerEva,
        api_fee,
        api_totalSupply_Eva,
        getDataFromScanner
      }}
    >
      {children}
    </GeneralDataContext.Provider>
  );
};

export const useGeneralData = () => {
  const context = useContext(GeneralDataContext);
  if (!context) {
    throw new Error(
      "useBlochainData must be used within a BlochainDataProvider"
    );
  }
  return context;
};
