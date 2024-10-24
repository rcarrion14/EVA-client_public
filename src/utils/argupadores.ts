import { ServerDataType, TransactionType } from "./Interfaces";

const ordenadorCronologicoDetTx = (
  dataFromServer: ServerDataType | undefined
) => {
  if (!dataFromServer) return [];

  const auxList = [
    ...dataFromServer.transfersEva_null,
    ...dataFromServer.transfersWbtc_burnVault,
  ];

  const sortedTx = auxList.sort((a, b) => {
    return Number(a.timeStamp) - Number(b.timeStamp);
  });

  return sortedTx;
};

export const agruparTxs = (dataFromServer: ServerDataType, lapso: number) => {
  const sortedTx = ordenadorCronologicoDetTx(dataFromServer);

  let indiceIntervaloActual = 0;
  const tstampDeployEva = 1720736121;

  const ordenamientoFinal: TransactionType[][] = [];

  let auxList: TransactionType[] = [];

  sortedTx.forEach((transaccion) => {
    const numero = Math.floor(
      (Number(transaccion.timeStamp) - tstampDeployEva) / lapso
    );

    if (numero === indiceIntervaloActual) {
      auxList.push(transaccion);
    } else {
      ordenamientoFinal[indiceIntervaloActual] = auxList;
      auxList = [];
      auxList.push(transaccion);
      indiceIntervaloActual = numero;
    }
  });

  ordenamientoFinal[indiceIntervaloActual] = auxList;

  //PUEDE GENERAR INDICES VACIOS

  return ordenamientoFinal as (TransactionType | null)[][];
};
