import React, { useEffect, useRef, useState } from "react";
import {
  ColorType,
  createChart,
  IChartApi,
  ISeriesApi,
  AreaData,
  /*   Time, */
  CrosshairMode,
  Time,
} from "lightweight-charts";

import axios from "axios";

import { ServerDataType } from "../../utils/Interfaces";
import {
  precioBTCDiario,
  precioEVADiario,
} from "../../utils/generadorDatosGrafica";

const ChartComponent: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const [paymentsList, setPaymentsList] = useState<
    ServerDataType | undefined
  >();

  useEffect(() => {
    axios
      .get("https://api.evervaluecoin.com/getAllTransactions")
      .then((response: any) => {
        setPaymentsList(response.data.body);
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
          borderVisible: false,
          // Si el margen inferior afecta la visualización de los datos, ajusta esto
          scaleMargins: {
            top: 0.2, // Ajusta este valor para agregar más espacio en la parte superior
            bottom: 0.1, // Ajusta este valor para agregar más espacio en la parte inferior
          },
        },
        leftPriceScale: {
          visible: true,
          borderVisible: false,
        },
        timeScale: {
          borderColor: "#d1d4dc",
          timeVisible: true,
          rightOffset: 10, // Ajusta este valor para agregar más espacio a la derecha
          barSpacing: 35, // Ajusta el espacio entre barras, disminúyelo si las barras están muy separadas
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

      // Primera serie de datos
      const areaSeries1: ISeriesApi<"Area"> = chart.addAreaSeries({
        lineColor: "rgba(32, 67, 250, 0.7)",
        topColor: "rgba(32, 67, 250, 0.5)", // Custom rgba color for better transparency
        bottomColor: "rgba(25, 25, 25, 0.1)", // Custom rgba color for better transparency
        priceScaleId: "right",
        lineWidth: 3,
        title: "EVA usd",
        priceFormat: {
          type: "price",
          minMove: 0.01,
          precision: 2,
        },
      });

      const data1: AreaData[] = !paymentsList
        ? [{ time: "2021-01-23" as Time, value: 0.01 }]
        : precioEVADiario(paymentsList);

      // Segunda serie de datos
      const areaSeries2: ISeriesApi<"Area"> = chart.addAreaSeries({
        lineColor: "rgb(255, 165, 0)",
        topColor: "rgba(255, 165, 0, 0.2)",
        bottomColor: "rgba(25, 25, 25, 0.1)",
        priceScaleId: "left",
        lineWidth: 3,
        title: "BTC usd",
        priceFormat: {
          type: "price",
          minMove: 1,
          precision: 0,
        },
      });

      const data2: AreaData[] = !paymentsList
        ? [{ time: "2021-01-23" as Time, value: 0.01 }]
        : precioBTCDiario();

      areaSeries2.setData(data2);
      areaSeries1.setData(data1);

      console.log({ data1 });

      const firstPoint = data2[0].time;
      const lastPoint = data2[data2.length - 1].time;

      chart.timeScale().setVisibleRange({
        from: firstPoint,
        to: lastPoint,
      });

      return () => {
        chart.remove();
      };
    }
  }, [paymentsList]);

  return (
    <>
      <div className="leyenda" style={{ zIndex: "5" }}>
        <div>
          <span className="dot eva"></span>
          precio BTC
        </div>
        <div onClick={() => {}}>
          <span className="dot btc"></span>
          Precio eva diario
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
