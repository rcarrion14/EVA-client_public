//Los datos vienen en 3 grupos. pagosRentabilidad - quemasEva - transferenciasAdmin
//Necesitamos etiquetar cada dato, ponerlos en una misma lista y ordenar por timestamp

import { AreaData } from "lightweight-charts";
import { UTCTimestamp } from "lightweight-charts";
import { ethers } from "ethers";
import { ServerDataType } from "./Interfaces";
import { agruparTxs } from "./argupadores";
import { precioBtc, retornarPrecioBTC } from "./precioBTC";

/* const ADDR_EVA = "0x45D9831d8751B2325f3DBf48db748723726e1C8c";
const ADDR_WBTC = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
const ADDR_PAYER = "0xDa28ec8E23E10bF4252e3E7c4B2922aDF419Bc6E"; */

const ADDR_BURNVAULT = "0xA89d65deF0A001947d8D5fDda93F9C4f8453902e";

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

const tstampDeployEva = 1720736121;

const toUTCTimestamp = (timestamp: number): UTCTimestamp => {
  return Math.floor(timestamp / 1000) as UTCTimestamp;
};

export const burnPriceSemanal = (dataFromServer: ServerDataType) => {
  const milisegundos1Semana = 60 * 60 * 24 * 7;

  const transaccionesAgrupadas = agruparTxs(
    dataFromServer,
    milisegundos1Semana
  );

  const dataGrafico: AreaData[] = [];

  let totalSupplyEva = 0;
  let btcEntregados = 0;
  let evaQuemadosAcum = 0;
  let ingresosBtc = 0;

  for (let i = 0; i < transaccionesAgrupadas.length; i++) {
    let txSemana_i = transaccionesAgrupadas[i]; // Puede hacer un lapso de tiempo donde no hubo tx

    if (!txSemana_i) {
      const fecha = (tstampDeployEva + milisegundos1Semana * i) * 1000;

      dataGrafico[i] = {
        time: toUTCTimestamp(fecha),
        value: dataGrafico[i - 1].value,
      };
    } else {
      txSemana_i.forEach((tx) => {
        if (tx?.from == NULL_ADDRESS) totalSupplyEva = 21000000;

        if (tx?.to == NULL_ADDRESS)
          evaQuemadosAcum += Number(ethers.formatUnits(tx.value, 18));

        if (tx?.to == ADDR_BURNVAULT.toLowerCase())
          //PAGOS DE RENTABILIDAD O TRANSDIRECTAS
          ingresosBtc += Number(ethers.formatUnits(tx.value, 8));

        if (tx?.from.toLowerCase() === ADDR_BURNVAULT.toLowerCase())
          btcEntregados += Number(ethers.formatUnits(tx.value, 8));
      });

      const rentabilidadSemana =
        ((ingresosBtc - btcEntregados) / (totalSupplyEva - evaQuemadosAcum)) *
        100000000;
      const fecha = (tstampDeployEva + milisegundos1Semana * i) * 1000;

      dataGrafico[i] = {
        time: toUTCTimestamp(fecha),
        value: rentabilidadSemana,
      };
    }
  }
  dataGrafico.splice(0, 7);
  console.log({ dataGrafico });

  return dataGrafico;
};

export const wbtcEnBaulSemanal = (dataFromServer: ServerDataType) => {
  const milisegundos1Semana = 60 * 60 * 24 * 7;

  const transaccionesAgrupadas = agruparTxs(
    dataFromServer,
    milisegundos1Semana
  );

  const dataGrafico: AreaData[] = [];

  let ingresosBtc = 0;

  for (let i = 0; i < transaccionesAgrupadas.length; i++) {
    let txSemana_i = transaccionesAgrupadas[i]; // Puede hacer un lapso de tiempo donde no hubo tx

    if (!txSemana_i) {
      const fecha = (tstampDeployEva + milisegundos1Semana * i) * 1000;

      dataGrafico[i] = {
        time: toUTCTimestamp(fecha),
        value: dataGrafico[i - 1].value,
      };
    } else {
      txSemana_i.forEach((tx) => {
        if (tx?.to == ADDR_BURNVAULT.toLowerCase())
          //PAGOS DE RENTABILIDAD O TRANSDIRECTAS
          ingresosBtc += Number(ethers.formatUnits(tx.value, 8));
      });

      const fecha = (tstampDeployEva + milisegundos1Semana * i) * 1000;

      dataGrafico[i] = {
        time: toUTCTimestamp(fecha),
        value: ingresosBtc,
      };
    }
  }
  dataGrafico.splice(0, 7);
  console.log({ wbtc: dataGrafico });

  return dataGrafico;
};

export const precioEVADiario = (dataFromServer: ServerDataType) => {
  const milisegundos1Dia = 60 * 60 * 24;

  const transaccionesAgrupadas = agruparTxs(dataFromServer, milisegundos1Dia);

  const dataGrafico: AreaData[] = [];

  let totalSupplyEva = 0;
  let btcEntregados = 0;
  let evaQuemadosAcum = 0;
  let ingresosBtc = 0;

  for (let i = 0; i < transaccionesAgrupadas.length; i++) {
    let txSemana_i = transaccionesAgrupadas[i]; // Puede hacer un lapso de tiempo donde no hubo tx

    if (!txSemana_i) {
      const fecha = (tstampDeployEva + milisegundos1Dia * i) * 1000;

      dataGrafico[i] = {
        time: toUTCTimestamp(fecha),
        value: dataGrafico[i - 1].value,
      };
    } else {
      txSemana_i.forEach((tx) => {
        if (tx?.from == NULL_ADDRESS) totalSupplyEva = 21000000;

        if (tx?.to == NULL_ADDRESS)
          evaQuemadosAcum += Number(ethers.formatUnits(tx.value, 18));

        if (tx?.to == ADDR_BURNVAULT.toLowerCase())
          //PAGOS DE RENTABILIDAD O TRANSDIRECTAS
          ingresosBtc += Number(ethers.formatUnits(tx.value, 8));

        if (tx?.from.toLowerCase() === ADDR_BURNVAULT.toLowerCase())
          btcEntregados += Number(ethers.formatUnits(tx.value, 8));
      });

      const rentabilidadSemana =
        ((ingresosBtc - btcEntregados) / (totalSupplyEva - evaQuemadosAcum)) *
        100000000;
      const fecha = (tstampDeployEva + milisegundos1Dia * i) * 1000;

      dataGrafico[i] = {
        time: toUTCTimestamp(fecha),
        value: (retornarPrecioBTC(fecha) / 100000000) * rentabilidadSemana,
      };
    }
  }
  dataGrafico.splice(0, 65);
  //console.log({ dataGrafico });

  return dataGrafico;
};

export const precioBTCDiario = () => {
  const dataGrafico: AreaData[] = [];
  const tstampDeployEva = 1720736121 * 1000;

  precioBtc.forEach((precio, index) => {
    dataGrafico[index] = {
      time: toUTCTimestamp(tstampDeployEva + index * 60 * 60 * 24 * 1000),
      value: precio,
    };
  });

  dataGrafico.splice(0, 65);
  return dataGrafico;
};
