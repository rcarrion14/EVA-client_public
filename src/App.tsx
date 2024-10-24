import React from "react";
import Navbar from "../src/components/Navbar";
import "../styles/normalize.css";
import "../styles/styles.css";
import Home from "./components/Home";
import Mining from "./components/Mining";
import Footer from "./components/Footer";
import { ContractProvider } from "./Context/ContractContext";
import { GeneralDataProvider } from "./Context/GeneralDataContext";
import { UserDataProvider } from "./Context/UserDataContext";
import { ConnectionProvider } from "./Context/ConnectionContext";
import Dashboard from "./components/Dashboard/Dashboard";

const App: React.FC = () => {
  return (
    <ConnectionProvider>
      <ContractProvider>
        <GeneralDataProvider>
          <UserDataProvider>
            <div className="scrollSnapMainCointainer">
              <Navbar />
              <Home />
              <Mining />
              <Dashboard />
            </div>
            <Footer />
          </UserDataProvider>
        </GeneralDataProvider>
      </ContractProvider>
    </ConnectionProvider>
  );
};

export default App;
