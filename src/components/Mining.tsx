import React, { useEffect, useState } from "react";

import Paginator from "./Paginator";
import {
  formatHash,
  formatHashMobile,
  formatTimestamp,
  formatTimestampMobile,
} from "../utils";
import axios from "axios";
import { dataPagosInterface } from "../utils/Interfaces";
import { ethers } from "ethers";

const Mining: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [paymentsList, setPaymentsList] = useState<
    dataPagosInterface[] | undefined
  >();

  const perPage: number = 6;
  const offset: number = currentPage * perPage;

  const paginatedList = () => {
    if (paymentsList) {
      const newList = paymentsList.slice(offset, offset + perPage);
      if (newList.length < perPage) {
        const rowsToAdd = perPage - newList.length;

        for (let i = 0; i < rowsToAdd; i++) {
          newList.push({ pago: "", txHash: "", tstamp: "" });
        }
      }
      return newList;
    } else {
      return [{ pago: "", txHash: "", tstamp: "" }];
    }
  };

  useEffect(() => {
    axios
      .get(
        "https://lyo9arzxxh.execute-api.us-east-1.amazonaws.com/default/getPagos-EVA"
      )
      .then((response) => {
        console.log(response);

        const rawList_pagos = response.data.dataFromDynamo;
        const orderedList = rawList_pagos.sort(
          (a: any, b: any) => b.tstamp - a.tstamp
        );
        setPaymentsList(orderedList);
      });
  }, []);

  return (
    <div id="mining" className="seccion mining">
      <div className="mining-container">
        <div className="mining-subheader">MINING</div>
        <div className="mining-header">Check our daily BTC income</div>

        <div className="flex-centered">
          <div className="table desktop">
            <div className="tableHeader">TRANSACTION HASH</div>
            <div className="tableHeader">BTC INCOME</div>
            <div className="tableHeader">DATE TIME (UTC)</div>

            {paginatedList().map((pago: dataPagosInterface, index: any) => {
              return (
                <>
                  <div
                    onClick={() => {
                      window.open(
                        "https://www.blockchain.com/explorer/transactions/btc/" +
                          pago.txHash
                      );
                    }}
                    key={"td1Desktop" + index}
                    className="hashDesktop"
                  >
                    {formatHash(pago.txHash)}
                  </div>
                  <div key={"td2Desktop" + index}>
                    {pago.pago == ""
                      ? ""
                      : ethers.formatUnits(pago.pago, 8) + " BTC"}
                  </div>
                  <div key={"td3Desktop" + index}>
                    {formatTimestamp(pago.tstamp)}
                  </div>
                </>
              );
            })}
          </div>

          <div className="table mobile">
            <div className="tableHeader">BTC INCOME</div>
            <div className="tableHeader">TX HASH</div>

            {paginatedList().map((pago: dataPagosInterface, index: any) => {
              return (
                <>
                  {pago.pago != "" ? (
                    <div className="a">
                      <div className="containerBitcoinBlanco">
                        <img
                          src="/iconBitcoin.png"
                          className="iconBitcoinBlanco"
                          alt=""
                        />
                      </div>
                      <div className="flexTabla">
                        <div key={"td2" + index}>
                          {pago.pago == ""
                            ? ""
                            : ethers.formatUnits(pago.pago, 8) + " BTC"}
                        </div>
                        <div key={"td3" + index}>
                          {formatTimestampMobile(pago.tstamp)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  <div key={"td1" + index}>
                    {pago.pago != "" ? (
                      <div
                        onClick={() => {
                          window.open(
                            "https://www.blockchain.com/explorer/transactions/btc/" +
                              pago.txHash
                          );
                        }}
                        className="hashMobile"
                      >
                        {formatHashMobile(pago.txHash)}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </>
              );
            })}
          </div>
          <Paginator
            currentPage={currentPage + 1}
            totalPages={
              paymentsList ? Math.ceil(paymentsList.length / perPage) : 0
            }
            onPageChange={(n) => {
              setCurrentPage(n - 1);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Mining;
