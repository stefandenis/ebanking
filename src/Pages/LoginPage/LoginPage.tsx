import React, { useState } from "react";
import "./LoginPage.css";
import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL = process.env.REACT_APP_BASE_URL;
console.log(process.env);
interface Props {
    setJwt(jwt: string): any;
}
function LoginPage(props: Props) {
    const [username, setUsername] = useState<String>();
    const [password, setPassword] = useState<String>();

    function logIn() {
        axios
            .post(`${BASE_URL}/authenticate`, {
                username: username,
                password: password,
            })
            .then(
                (response) => {
                    var jwt = response.data.jwt;
                    var decoded_jwt = jwt_decode(jwt);
                    props.setJwt(jwt);
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    return (
        <div className="LoginPage-container">
            <div className="LoginPage-window">
                <p className="window__title">Logheaza-te in contul tau</p>
                <input
                    className="LoginPage-window__input"
                    type="text"
                    placeholder="Username..."
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <input
                    className="LoginPage-window__input"
                    type="password"
                    placeholder="Password..."
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <button
                    onClick={() => {
                        logIn();
                    }}
                >
                    Log in
                </button>
            </div>
        </div>
    );
}

export default LoginPage;
