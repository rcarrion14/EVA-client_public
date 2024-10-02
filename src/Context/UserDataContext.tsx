import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useContract } from "./ContractContext";
import { addrBurnVault, addrMarket } from "../contracts/addresses";
import { useConnection } from "./ConnectionContext";

interface UserDataContextType {
  allowanceMarket_Eva: bigint | undefined;
  //allowanceMarket_Usdt: bigint | undefined;
  allowanceMarket_Wbtc: bigint | undefined;
  allowanceBurnVault_Eva: bigint | undefined;
  userBalance_Eva: bigint | undefined;
  userBalance_Usdt: bigint | undefined;
  userBalance_Wbtc: bigint | undefined;
  getUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

// prettier-ignore
export const UserDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address, chainId} = useConnection();
  const { evaContract, usdtContract, wbtcContract } = useContract();

  // Estados:

  const [allowanceMarket_Eva, setAllowanceMarket_Eva] = useState<bigint | undefined>(undefined);
  //const [allowanceMarket_Usdt, setAllowanceMarket_Usdt] = useState<bigint | undefined>(undefined);
  const [allowanceMarket_Wbtc, setAllowanceMarket_Wbtc] = useState<bigint | undefined>(undefined);
  const [allowanceBurnVault_Eva, setAllowanceBurnVault_Eva] = useState<bigint | undefined>(undefined);
  const [userBalance_Eva, setUserBalance_Bett] = useState<bigint | undefined>(undefined);
  const [userBalance_Usdt, setUserBalance_Usdt] = useState<bigint | undefined>(undefined);
  const [userBalance_Wbtc, setUserBalance_Wbtc] = useState<bigint | undefined>(undefined);


  const getUserData = async () => {
    if (chainId == 42161 && address) {
      evaContract?.allowance(address, addrMarket).then((data) => setAllowanceMarket_Eva(data));
      //usdtContract?.allowance(userAccount, addrMarket).then((data) => setAllowanceMarket_Usdt(data));
      wbtcContract?.allowance(address, addrMarket).then((data) => setAllowanceMarket_Wbtc(data));
      evaContract?.allowance(address, addrBurnVault).then((data) => setAllowanceBurnVault_Eva(data));
      evaContract?.balanceOf(address).then((data) => setUserBalance_Bett(data));
      usdtContract?.balanceOf(address).then(data => setUserBalance_Usdt(data))
      wbtcContract?.balanceOf(address).then(data => setUserBalance_Wbtc(data))
    }
  };

  useEffect(() => {
    getUserData();
    
    
  }, [chainId, evaContract]);

  return (
    <UserDataContext.Provider
      value={{
        allowanceMarket_Eva,
        //allowanceMarket_Usdt,
        allowanceMarket_Wbtc,
        allowanceBurnVault_Eva,
        userBalance_Eva,
        userBalance_Usdt,
        userBalance_Wbtc,
        getUserData
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error(
      "useBlochainData must be used within a BlochainDataProvider"
    );
  }
  return context;
};
