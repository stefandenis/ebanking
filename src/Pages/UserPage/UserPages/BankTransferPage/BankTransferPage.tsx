import React from "react";
import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DepositPage from "../DepositPage/DepositPage";
import ExchangeRatePage from "../ExchangeRatePage/ExchangeRatePage";
import HistoryPage from "../HistoryPage/HistoryPage";
import HomePage from "../HomePage/HomePage";
import BetweenOwnAccountsPage from "./BetweenOwnAccountsPage/BetweenOwnAccountsPage";
import SupplierPaymentPage from "./SupplierPaymentPage/SupplierPaymentPage";
import TowardAFriendPage from "./TowardAFriendPage/TowardAFriendPage";
import "./BankTransferPage.css";

function BankTransferPage() {
    return (
        <Router>
            <div className="HomePage-content">
                <div className="BankTransferPage-navbar">
                    <Link
                        className={`BankTransferPage-navbar__link`}
                        to="/transfer/intre-conturile-mele"
                    >
                        INTRE CONTURILE MELE
                    </Link>
                    <Link
                        className="BankTransferPage-navbar__link"
                        to="/transfer/catre-un-prieten"
                    >
                        CATRE UN PRIETEN
                    </Link>
                    <Link
                        className="BankTransferPage-navbar__link"
                        to="/transfer/plata-furnizor"
                    >
                        PLATA FURNIZOR
                    </Link>
                </div>

                <Switch>
                    <Route
                        path="/transfer/intre-conturile-mele"
                        exact
                        component={BetweenOwnAccountsPage}
                    />
                    <Route
                        path="/transfer/catre-un-prieten"
                        component={TowardAFriendPage}
                    />
                    <Route
                        path="/transfer/plata-furnizor"
                        component={SupplierPaymentPage}
                    />
                </Switch>
            </div>
        </Router>
    );
}

export default BankTransferPage;
