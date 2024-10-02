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

export interface dataPagosInterface {
  pago: number | string;
  tstamp: number | string;
  txHash: string;
}
