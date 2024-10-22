//import { addrBurnVault } from "../contracts/addresses";

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

export interface ServerData {
  allTransactionsData: AllTransactionsData;
  evaPayments: DataPagosInterface[];
}

export interface AllTransactionsData {
  pagosRentabilidad: PagosRentabilidadType[];
  quemasEva: QuemasEvaType[];
  transferenciasAdmin: TransferenciasAdminType[];
  wbtcAUsuarios: WbtcAUsuariosType[];
}

export interface PagosRentabilidadType {
  blockHash: string;
  blockNumber: string;
  timeStamp: string;
  tokenSymbol: "WBTC";
  value: string;
  from: string;
}

export interface QuemasEvaType {
  blockHash: string;
  blockNumber: string;
  timeStamp: string;
  tokenSymbol: "EVA";
  value: string;
  from: string;
  to: string;
}

export interface TransferenciasAdminType {
  blockHash: string;
  blockNumber: string;
  timeStamp: string;
  tokenSymbol: "WBTC";
  value: string;
  from: string;
}

export interface WbtcAUsuariosType {
  blockHash: string;
  blockNumber: string;
  timeStamp: string;
  tokenSymbol: "WBTC";
  value: string;
  from: "0xA89d65deF0A001947d8D5fDda93F9C4f8453902e";
}

export interface DataPagosInterface {
  pago: number | string;
  tstamp: number | string;
  txHash: string;
}

export type OrderedTransactions =
  | (PagosRentabilidadType & { tipo: "pagoRentabilidad" })
  | (QuemasEvaType & { tipo: "quemasEva" | "mint" })
  | (TransferenciasAdminType & { tipo: "transferenciaAdmin" })
  | (WbtcAUsuariosType & { tipo: "wbtcAUsuario" });
