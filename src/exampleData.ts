export interface Transaction {
  txHash: string;
  btc: number | string;
  date: number | string;
}

export const exampleList: Transaction[] = [];

for (let i = 0; i < 555; i++) {
  const data: Transaction = {
    txHash: "0x0000087" + (i * 17) ** 2,
    btc: 0.001 + Math.random(),
    date: Date.now() + i * 6875,
  };

  exampleList.push(data);
}
