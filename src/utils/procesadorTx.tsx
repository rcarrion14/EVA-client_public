//Los datos vienen en 3 grupos. pagosRentabilidad - quemasEva - transferenciasAdmin
//Necesitamos etiquetar cada dato, ponerlos en una misma lista y ordenar por timestamp

import { AreaData, Time } from "lightweight-charts";
import { AllTransactionsData, OrderedTransactions } from "./Interfaces";
import { UTCTimestamp } from "lightweight-charts";
import { ethers } from "ethers";

export const procesadorTx = (txListFromServer: AllTransactionsData) => {
  const newTxList: OrderedTransactions[] = [];

  txListFromServer.pagosRentabilidad.forEach((pago) => {
    newTxList.push({ ...pago, tipo: "pagoRentabilidad" });
  });

  txListFromServer.quemasEva.forEach((quema) => {
    if (
      quema.to == "0xa311ff8c542e4e85e8a1ca9b3ddd08aeb9b4d224" &&
      quema.from == "0x0000000000000000000000000000000000000000"
    ) {
      newTxList.push({ ...quema, tipo: "mint" });
    } else {
      newTxList.push({ ...quema, tipo: "quemasEva" });
    }
  });

  txListFromServer.transferenciasAdmin.forEach((transferencia) => {
    newTxList.push({ ...transferencia, tipo: "transferenciaAdmin" });
  });

  txListFromServer.wbtcAUsuarios.forEach((envio) => {
    newTxList.push({ ...envio, tipo: "wbtcAUsuario" });
  });

  const sortedTx = newTxList.sort((a, b) => {
    return Number(a.timeStamp) - Number(b.timeStamp);
  });

  console.log({ sortedLenght: sortedTx.length, newTxList: newTxList.length });
  //NO HAY PERDIDAS DE INFO

  const tstampDeployEva = 1720736121;

  const orderedTx: OrderedTransactions[][] = []; //Cada elemento de la lista es una lista de transacciones cuyo indice es la semana correspondiente.

  let transaccionesDeLaSemana: any = [];
  let indiceSemanaActual = 0;

  sortedTx.forEach((transaccion) => {
    const numero = Math.floor(
      (Number(transaccion.timeStamp) - tstampDeployEva) / (60 * 60 * 24 * 7)
    );

    if (numero === indiceSemanaActual) {
      transaccionesDeLaSemana.push(transaccion);
    } else {
      orderedTx[indiceSemanaActual] = transaccionesDeLaSemana;
      transaccionesDeLaSemana = [];
      transaccionesDeLaSemana.push(transaccion);
      indiceSemanaActual = numero;
    }
  });

  orderedTx[indiceSemanaActual] = transaccionesDeLaSemana;

  let count = 0;
  orderedTx.forEach((week) => {
    count += week.length;
  });

  return orderedTx;
};

const toUTCTimestamp = (timestamp: number): UTCTimestamp => {
  return Math.floor(timestamp / 1000) as UTCTimestamp;
};

export const rentabilidadSemanalParaGrafico = (
  orderedTx: OrderedTransactions[][] | undefined
) => {
  //const data2: AreaData[] = [{ time: "2021-01-23" as Time, value: 0.01 }];
  if (!orderedTx) return [{ time: "2021-01-23" as Time, value: 0.01 }];

  const dataGrafico: AreaData[] = [];

  let totalSupplyEva = 0;
  let btcEntregados = 0;
  let evaQuemadosAcum = 0;
  let ingresosBtc = 0;

  orderedTx.forEach((weekTxs, index) => {
    for (let i = 0; i < weekTxs.length; i++) {
      const tx = weekTxs[i];

      if (tx.tipo == "mint") totalSupplyEva = 21000000;

      if (tx.tipo == "pagoRentabilidad" || tx.tipo == "transferenciaAdmin")
        ingresosBtc += Number(ethers.formatUnits(tx.value, 8));
      if (tx.tipo == "quemasEva")
        evaQuemadosAcum += Number(ethers.formatUnits(tx.value, 18));
      if (tx.tipo == "wbtcAUsuario")
        btcEntregados += Number(ethers.formatUnits(tx.value, 8));
    }

    const tstampDeployEva = 1720736121;

    const rentabilidadSemana =
      ((ingresosBtc - btcEntregados) / (totalSupplyEva - evaQuemadosAcum)) *
      100000000;
    const fecha = (tstampDeployEva + 60 * 60 * 24 * 7 * index) * 1000;

    dataGrafico[index] = {
      time: toUTCTimestamp(fecha),
      value: rentabilidadSemana,
    };
  });

  console.log(dataGrafico);

  return dataGrafico;
};
