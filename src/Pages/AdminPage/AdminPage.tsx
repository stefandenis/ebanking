import React, { ReactElement, useContext } from "react";
import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { appContext } from "../../context/app.context";
import BankTransferPage from "../UserPage/UserPages/BankTransferPage/BankTransferPage";
import DepositPage from "../UserPage/UserPages/DepositPage/DepositPage";
import ExchangeRatePage from "../UserPage/UserPages/ExchangeRatePage/ExchangeRatePage";
import HistoryPage from "../UserPage/UserPages/HistoryPage/HistoryPage";
import HomePage from "../UserPage/UserPages/HomePage/HomePage";
import "./AdminPage.css";
import AddAccountPage from "./AdminSubPages/AddAccountPage/AddAccountPage";
import AddFoundsPage from "./AdminSubPages/AddFoundsPage/AddFoundsPage";
import AddUserPage from "./AdminSubPages/AddUserPage/AddUserPage";
import AdminHomePage from "./AdminSubPages/AdminHomePage/AdminHomePage";
import DeleteUserPage from "./AdminSubPages/DeleteUserPage/DeleteUserPage";
interface Props {}

function AdminPage({}: Props): ReactElement {
    const { jwt, setJwt } = useContext(appContext);
    return (
        <Router>
            <div className="HomePage-container">
                <div className="HomePage-navbar">
                    <p className="HomePage-navbar__username"> Admin Panel </p>
                    <div className="HomePage-navbar__links">
                        <Link
                            className={`HomePage-navbar__link`}
                            to="/add-user"
                        >
                            ADAUGA USER
                        </Link>
                        <Link
                            className="HomePage-navbar__link"
                            to="/add-account"
                        >
                            ADAUGA CONT
                        </Link>
                        <Link
                            className="HomePage-navbar__link"
                            to="/delete-user"
                        >
                            STERGE USER
                        </Link>
                        <Link
                            className="HomePage-navbar__link"
                            to="/add-founds"
                        >
                            ADAUGA FONDURI
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
                    <Route path="/" exact component={AdminHomePage} />
                    <Route path="/add-user" component={AddUserPage} />
                    <Route path="/add-account" component={AddAccountPage} />
                    <Route path="/delete-user" component={DeleteUserPage} />
                    <Route path="/add-founds" component={AddFoundsPage} />
                </Switch>
            </div>
        </Router>
    );
}

export default AdminPage;
