import React, { useEffect, useRef } from "react";
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

import { burnPriceSemanal } from "../../utils/generadorDatosGrafica";
import { ServerDataType } from "../../utils/Interfaces";

const ChartComponent_burnPrice: React.FC<{
  paymentsList: ServerDataType | undefined;
  btcPrices: { tstamp: number; price: number }[] | undefined;
}> = ({ paymentsList /* btcPrices */ }) => {
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

      const areaSeries: ISeriesApi<"Area"> = chart.addAreaSeries({
        lineColor: "rgb(252, 146, 1)",
        topColor: "rgba(255, 146, 1, 0.2)",
        bottomColor: "rgba(25, 25, 25, 0.1)",
        priceScaleId: "left",
        lineWidth: 3,
        title: "Burn price [Sats]",
      });

      const datos: AreaData[] = !paymentsList
        ? [{ time: "2021-01-23" as Time, value: 0.01 }]
        : burnPriceSemanal(paymentsList);

      areaSeries.setData(datos);

      // Ajusta el rango visible si los datos están descentrados

      const firstPoint = datos[0].time;
      const lastPoint = datos[datos.length - 1].time;

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

      return () => {
        chart.remove();
      };
    }
  }, [paymentsList]);

  return (
    <>
      <div className="leyenda" style={{ zIndex: "5" }}>
        <div onClick={() => {}}>
          <span className="dot eva"></span>
          EVA burn price (SATS)
        </div>
      </div>
      <div
        ref={chartContainerRef}
        style={{ width: "900px", height: "400px" }}
        className="grafica"
      ></div>
      <div className="graph-description">
        The Burn Price of EVA rises steadily as the wBTC collateral in the Burn
        Vault grows. This means that the value of each EVA token continuously
        appreciates against BTC. What sets EVA apart is that this appreciation
        is guaranteed by the daily increase in BTC collateral, providing
        protection for investors and ensuring growing value, resulting in even
        higher returns over time. With EVA, investors not only preserve their
        BTC value but multiply their capital securely.
      </div>
    </>
  );
};

export default ChartComponent_burnPrice;
