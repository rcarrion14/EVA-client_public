import React from "react";
import ChartComponent from "./ChartComponent";
import ChartComponent_pronto from "./ChartComponent_pronto";

const Dashboard: React.FC = () => {
  return (
    <>
      <div id="dashboard" className="seccion dashboard">
        <ChartComponent_pronto /> {/* BURN PRICE Y BTC EN BAUL */}
      </div>
      <div id="dashboard" className="seccion dashboard">
        <ChartComponent /> {/* PRECIOS EN USD */}
      </div>
    </>
  );
};

export default Dashboard;
