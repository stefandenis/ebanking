import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/LoginPage";
import UserPage from "./Pages/UserPage/UserPage";
import { appContext, authorityType } from "./context/app.context";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import AdminPage from "./Pages/AdminPage/AdminPage";
import jwt_decode from "jwt-decode";
import { Jwt } from "./Models/accountData";
const AppProvider = appContext.Provider;

function App() {
    const [username, setUsername] = useState<string>("");
    const [authority, setAuthority] = useState<authorityType>(null);
    const [jwt, setJwt] = useState<string | null>("");
    // let history = useHistory();

    useEffect(() => {
        var localStorageJwt = localStorage.getItem("jwt");
        if (localStorageJwt != null) {
            var decoded_jwt: Jwt = jwt_decode(localStorageJwt);
            setAuthority(decoded_jwt.Authority);
            setUsername(decoded_jwt.sub);
            setJwt(localStorageJwt);
        } else {
            setJwt(null);
        }
    }, []);

    useEffect(() => {
        console.log("jwt", jwt);
        if (jwt) {
            localStorage.setItem("jwt", jwt);
            var decoded_jwt: Jwt = jwt_decode(jwt);
            setAuthority(decoded_jwt.Authority);
            setUsername(decoded_jwt.sub);
            console.log(decoded_jwt);
            console.log(decoded_jwt.Authority);
        }
    }, [jwt]);
    return (
        <AppProvider value={{ username, authority, jwt, setJwt }}>
            <Router>{returnSwitches()}</Router>
        </AppProvider>
    );

    function returnSwitches() {
        if (jwt) {
            if (authority == "admin") {
                return (
                    <Switch>
                        <Route path="/" exact component={AdminPage} />
                    </Switch>
                );
            } else if (authority == "user") {
                return (
                    <Switch>
                        <Route path="/" exact component={UserPage} />
                    </Switch>
                );
            }
        } else if (jwt == "") {
            return <div></div>;
        } else {
            return (
                <Switch>
                    <Route exact path="/">
                        <LoginPage
                            setJwt={(jwt: string) => {
                                setJwt(jwt);
                            }}
                        />
                    </Route>
                </Switch>
            );
        }
    }
}

export default App;
