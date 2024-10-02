import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { JsonRpcSigner } from "ethers";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider } from "ethers";

interface ConnectionContextType {
  isConnected: boolean;
  chainId: number | undefined;
  signer: JsonRpcSigner | undefined;
  address: string | undefined;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);

  useEffect(() => {
    if (walletProvider) {
      const ethersProvider = new BrowserProvider(walletProvider);
      ethersProvider.getSigner().then((data) => {
        setSigner(data);
      });
    }
  }, [walletProvider]);

  return (
    <ConnectionContext.Provider
      value={{
        isConnected,
        signer,
        chainId,
        address,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};
