import React, { useEffect, useState } from "react";
import ChartComponent_preciosUsd from "./ChartComponent_preciosUsd";
import ChartComponent_burnPrice from "./ChartComponent_burnPrice";
import { ServerDataType } from "../../utils/Interfaces";
import axios from "axios";

const Dashboard: React.FC = () => {
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

  return (
    <>
      <div id="dashboard" className="seccion dashboard">
        <div className="dashboard-container">
          <ChartComponent_burnPrice paymentsList={paymentsList} />{" "}
        </div>
      </div>
      <div id="dashboard" className="seccion dashboard">
        <div className="dashboard-container">
          <ChartComponent_preciosUsd paymentsList={paymentsList} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
