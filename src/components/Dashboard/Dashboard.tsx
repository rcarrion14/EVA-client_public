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

  const [whichGraph, setWhichGraph] = useState<"burnPrice" | "preciosUsd">(
    "burnPrice"
  );

  return (
    <div id="dashboard" className="seccion dashboard">
      <div id="aa" className="dashboard-container">
        <div className="dashboard-subheader">DASHBOARD</div>{" "}
        <div className="dashboard-header">
          <span
            className={
              whichGraph == "burnPrice" ? undefined : "inactive-graphText"
            }
            onClick={() => setWhichGraph("burnPrice")}
          >
            Burn Price
          </span>
          {" - "}
          <span
            className={
              whichGraph == "preciosUsd" ? undefined : "inactive-graphText"
            }
            onClick={() => setWhichGraph("preciosUsd")}
          >
            Price Comparison: EVA vs. BTC
          </span>
        </div>
        {whichGraph == "burnPrice" ? (
          <ChartComponent_burnPrice paymentsList={paymentsList} />
        ) : (
          <ChartComponent_preciosUsd paymentsList={paymentsList} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

/*     <>
      <div id="dashboard" className="seccion dashboard">
        <div id="aa" className="dashboard-container">
          <div className="dashboard-subheader">DASHBOARD</div>   
            <div className="dashboard-header">
                <span
                  className={
                    whichGraph == "burnPrice" ? undefined : "inActiveGraphText"
                  }
                  onClick={() => setWhichGraph("burnPrice")}
                >
                  Burn Price
                </span>
                <span
                  className={
                    whichGraph == "burnPrice" ? undefined : "inActiveGraphText"
                  }
                  onClick={() => setWhichGraph("preciosUsd")}
                >
                  Price Comparison: EVA vs. BTC
                </span>
            </div>

            {whichGraph == "burnPrice" ?}
              <ChartComponent_burnPrice paymentsList={paymentsList} />
            </>
          ) : (
            <ChartComponent_preciosUsd paymentsList={paymentsList} />
            </div>
            </div>
            </> )} */
