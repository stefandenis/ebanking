import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { appContext } from "../../context/app.context";
import LoginPage from "../LoginPage/LoginPage";
import "./UserPage.css";
import BankTransferPage from "./UserPages/BankTransferPage/BankTransferPage";
import DepositPage from "./UserPages/DepositPage/DepositPage";
import ExchangeRatePage from "./UserPages/ExchangeRatePage/ExchangeRatePage";
import HistoryPage from "./UserPages/HistoryPage/HistoryPage";
import HomePage from "./UserPages/HomePage/HomePage";
const BASE_URL = process.env.REACT_APP_BASE_URL;

function ClientPage() {
    const { jwt, username, setJwt } = useContext(appContext);
    const [displayName, setDisplayName] = useState<string>("");

    useEffect(() => {
        axios
            .get(`${BASE_URL}/user/get/${username}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })
            .then((user) => {
                console.log(user.data);
                setDisplayName(user.data.name);
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 403) {
                    setJwt(null);
                }
            });
    }, []);

    return (
        <Router>
            <div className="HomePage-container">
                <div className="HomePage-navbar">
                    <Link to="/" className="HomePage-navbar__username">
                        {displayName}
                    </Link>
                    <div className="HomePage-navbar__links">
                        <Link
                            className={`HomePage-navbar__link`}
                            to="/transfer/intre-conturile-mele"
                        >
                            TRANSFER
                        </Link>
                        <Link
                            className="HomePage-navbar__link"
                            to="/schimb-valutar"
                        >
                            SCHIMB VALUTAR
                        </Link>
                        <Link className="HomePage-navbar__link" to="/depozite">
                            DEPOZITE
                        </Link>
                        <Link className="HomePage-navbar__link" to="/istoric">
                            ISTORIC
                        </Link>
                        <p
                            onClick={() => {
                                setJwt(null);
                                localStorage.removeItem("jwt");
                            }}
                            className="HomePage-navbar__link"
                        >
                            LOG OUT
                        </p>
                    </div>
                </div>

                <Switch>
                    <Route path="/" exact component={HomePage} />
                    <Route
                        path="/transfer/intre-conturile-mele"
                        component={BankTransferPage}
                    />
                    <Route
                        path="/schimb-valutar"
                        component={ExchangeRatePage}
                    />
                    <Route path="/depozite" component={DepositPage} />
                    <Route path="/istoric" component={HistoryPage} />
                </Switch>
            </div>
        </Router>
    );
}

export default ClientPage;
