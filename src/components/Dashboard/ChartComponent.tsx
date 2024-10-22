import React, { useEffect, useRef, useState } from "react";
import {
  ColorType,
  createChart,
  IChartApi,
  ISeriesApi,
  AreaData,
  /*   Time, */
  CrosshairMode,
} from "lightweight-charts";
import axios from "axios";
import { OrderedTransactions } from "../../utils/Interfaces";
import {
  procesadorTx,
  rentabilidadSemanalParaGrafico,
} from "../../utils/procesadorTx";

const ChartComponent: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const [paymentsList, setPaymentsList] = useState<OrderedTransactions[][]>();

  useEffect(() => {
    axios
      .get(
        "https://lyo9arzxxh.execute-api.us-east-1.amazonaws.com/default/getPagos-EVA"
      )
      .then((response) => {
        const rawTx = response.data.allTransactionsData;
        const orderedTx = procesadorTx(rawTx);
        setPaymentsList(orderedTx);
      });
  }, []);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: {
            type: ColorType.Solid,
            color: "#ffffff00",
          },
          textColor: "#FFFFFF",
          fontFamily: "'Be Vietnam Pro', sans-serif",
        },

        rightPriceScale: {
          visible: true,
          scaleMargins: {
            /*             top: 0.3, // Ajusta este valor para cambiar el margen superior
            bottom: 0.1, // Ajusta este valor para cambiar el margen inferior */
          },
          borderVisible: false,
        },

        leftPriceScale: {
          visible: true,
          borderVisible: false,
        },

        timeScale: {
          borderColor: "#d1d4dc",
          timeVisible: true,
          /*         tickMarkFormatter: (time: Time) => {
            const date = new Date(time as string);
            const months = [
              "JAN",
              "FEB",
              "MAR",
              "APR",
              "MAY",
              "JUN",
              "JUL",
              "AUG",
              "SEP",
              "OCT",
              "NOV",
              "DEC",
            ];
            return months[date.getMonth()];
          }, */
          rightOffset: 0, // Ajusta este valor para cambiar el espacio en el lado derecho
          barSpacing: 48, // Ajusta este valor para cambiar el espacio entre las barras
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { visible: false },
        },
        crosshair: {
          vertLine: {
            labelVisible: false,
          },
          mode: CrosshairMode.Normal,
        },
      });

      chartRef.current = chart;

      // Segunda serie de datos
      const areaSeries2: ISeriesApi<"Area"> = chart.addAreaSeries({
        lineColor: "rgb(255, 165, 0)",
        topColor: "rgb(255, 165, 0, 0.2)",
        bottomColor: "rgba(25, 25, 25, 0.1)",
        priceScaleId: "left",
        lineWidth: 3,
        title: "EVA",
      });

      //const data2: AreaData[] = [{ time: "2021-01-23" as Time, value: 0.01 }];

      const data2: AreaData[] = rentabilidadSemanalParaGrafico(paymentsList);

      areaSeries2.setData(data2);

      return () => {
        chart.remove();
      };
    }
  }, [paymentsList]);

  return (
    <>
      <div className="leyenda">
        <div>
          <span className="dot btc"></span>
          Bitcoin
        </div>
        <div>
          <span className="dot eva"></span>
          EverValue
        </div>
      </div>
      <div
        ref={chartContainerRef}
        style={{ width: "900px", height: "400px" }}
        className="grafica"
      ></div>
    </>
  );
};

export default ChartComponent;
