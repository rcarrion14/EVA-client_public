export interface FrontEndObjectsInterface_Home {
  inputSpend: {
    text: string;
    img: string;
    coin: string;
    handleChange: (n: string) => string;
    balance: string;
    handle100: () => void;
    priceInDollars: string;
  };
  inputReceive: {
    img: string;
    coin: string;
    handleChange: (n: string) => string;
    balance: string;
    priceInDollars: string;
  };
}

export type TransactionType = {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  tokenSymbol: "EVA" | "WBTC";
  value: string;
  from: string;
  to: string;
};

export type ServerDataType = {
  transfersEva_null: TransactionType[];
  transfersWbtc_burnVault: TransactionType[];
};

export interface DataPagosInterface {
  pago: number | string;
  tstamp: number | string;
  txHash: string;
}
