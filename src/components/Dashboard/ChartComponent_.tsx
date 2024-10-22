import React, { useEffect, useRef } from "react";
import {
  ColorType,
  createChart,
  IChartApi,
  ISeriesApi,
  AreaData,
  Time,
  CrosshairMode,
} from "lightweight-charts";

const ChartComponent: React.FC = () => {
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
          tickMarkFormatter: (time: Time) => {
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
          },
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

      // Primera serie de datos
      const areaSeries1: ISeriesApi<"Area"> = chart.addAreaSeries({
        lineColor: "rgba(32, 67, 250, 0.7)",
        topColor: "rgba(32, 67, 250, 0.5)", // Custom rgba color for better transparency
        bottomColor: "rgba(25, 25, 25, 0.1)", // Custom rgba color for better transparency
        priceScaleId: "right",
        lineWidth: 3,
        title: "BTC",
        priceFormat: {
          type: "price",
          precision: 0,
          minMove: 100,
        },
      });

      const data1: AreaData[] = [
        { time: "2021-01-03" as Time, value: 32000 },
        { time: "2021-02-05" as Time, value: 25000 },
        { time: "2021-03-27" as Time, value: 35000 },
        { time: "2021-05-22" as Time, value: 12352 },
        { time: "2021-07-23" as Time, value: 21200 },
        { time: "2021-09-04" as Time, value: 21200 },
        { time: "2021-11-03" as Time, value: 8123 },
        { time: "2021-12-23" as Time, value: 13250 },
      ];

      areaSeries1.setData(data1);

      // Segunda serie de datos
      const areaSeries2: ISeriesApi<"Area"> = chart.addAreaSeries({
        lineColor: "rgb(255, 165, 0)",
        topColor: "rgb(255, 165, 0, 0.2)",
        bottomColor: "rgba(25, 25, 25, 0.1)",
        priceScaleId: "left",
        lineWidth: 3,
        title: "EVA",
      });

      const data2: AreaData[] = [
        { time: "2021-01-23" as Time, value: 0.01 },
        { time: "2021-01-29" as Time, value: 0.021 },
        { time: "2021-02-04" as Time, value: 0.015 },
        { time: "2021-05-15" as Time, value: 0.2 },
        { time: "2021-06-23" as Time, value: 0.22 },
        { time: "2021-09-14" as Time, value: 0.09 },
        { time: "2021-10-15" as Time, value: 0.15 },
        { time: "2021-12-02" as Time, value: 0.3 },
      ];

      areaSeries2.setData(data2);

      return () => {
        chart.remove();
      };
    }
  }, []);

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
