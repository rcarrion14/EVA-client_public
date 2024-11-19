import React, { useEffect, useRef } from "react";
import {
  ColorType,
  createChart,
  IChartApi,
  ISeriesApi,
  AreaData,
  CrosshairMode,
  Time,
} from "lightweight-charts";

import { ServerDataType } from "../../utils/Interfaces";
import {
  precioBTCDiario,
  precioEVADiario,
} from "../../utils/generadorDatosGrafica";

const ChartComponent_preciosUsd: React.FC<{
  paymentsList: ServerDataType | undefined;
  btcPrices: { tstamp: number; price: number }[] | undefined;
}> = ({ paymentsList, btcPrices }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

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
        title: "EVA",
        priceFormat: {
          type: "price",
          minMove: 0.01,
          precision: 2,
        },
      });

      const data1: AreaData[] =
        !paymentsList || !btcPrices
          ? [{ time: "2021-01-23" as Time, value: 0.01 }]
          : precioEVADiario(paymentsList, btcPrices);

      // Segunda serie de datos
      const areaSeries2: ISeriesApi<"Area"> = chart.addAreaSeries({
        lineColor: "rgb(252, 146, 1)",
        topColor: "rgba(255, 146, 1, 0.2)",
        bottomColor: "rgba(25, 25, 25, 0.1)",
        priceScaleId: "left",
        lineWidth: 3,
        title: "BTC",
        priceFormat: {
          type: "price",
          minMove: 1,
          precision: 0,
        },
      });

      const data2: AreaData[] =
        !paymentsList || !btcPrices
          ? [{ time: "2021-01-23" as Time, value: 0.01 }]
          : precioBTCDiario(btcPrices);

      areaSeries2.setData(data2);
      areaSeries1.setData(data1);

      console.log(data1);

      const firstPoint = data2[0].time;
      const lastPoint = data2[data2.length - 1].time;

      chart.timeScale().setVisibleRange({
        from: firstPoint,
        to: lastPoint,
      });

      chart.applyOptions({
        handleScale: {
          axisPressedMouseMove: false,
          mouseWheel: false,
        },
        handleScroll: {
          pressedMouseMove: false,
        },
      });

      areaSeries2.applyOptions({
        autoscaleInfoProvider: () => ({
          priceRange: {
            minValue: 55000,
            maxValue: 85000,
          },
        }),
      });

      areaSeries1.applyOptions({
        autoscaleInfoProvider: () => ({
          priceRange: {
            minValue: -0.1,
            maxValue: 0.5,
          },
        }),
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
          Price BTC (USD)
        </div>
        <div onClick={() => {}}>
          <span className="dot btc"></span>
          Price EVA (USD)
        </div>
      </div>
      <div
        ref={chartContainerRef}
        style={{ width: "900px", height: "400px" }}
        className="grafica"
      ></div>
      <div className="graph-description">
        EVA not only follows BTC, but it also performs even better during price
        increases. When BTC rises, EVA tends to increase even more, and when BTC
        drops, EVA is less affected. This provides extra security for investors,
        offering greater appreciation potential and lower risk during downturns,
        making EVA a profitable and stable option in the long run.
      </div>
    </>
  );
};

export default ChartComponent_preciosUsd;
