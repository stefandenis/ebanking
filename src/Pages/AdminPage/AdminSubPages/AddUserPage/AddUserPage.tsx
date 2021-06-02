import axios from "axios";
import React, { ReactElement, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { appContext } from "../../../../context/app.context";

import "./AddUserPage.css";
const BASE_URL = process.env.REACT_APP_BASE_URL;
interface Props {}

function AddUserPage({}: Props): ReactElement {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [accountNo, setAccountNo] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const { jwt, setJwt } = useContext(appContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [hasError, setHasError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [supplier, setSupplier] = useState<boolean>(false);
    const history = useHistory();
    function addUser() {
        axios
            .post(
                `${BASE_URL}/user/save`,
                {
                    name: name,
                    email: email,
                    phone: phone,
                    address: address,
                    supplier: supplier,
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            .then((responseUserSave) => {
                console.log(responseUserSave.data);
                axios
                    .post(
                        `${BASE_URL}/account/save`,
                        {
                            accountNo: accountNo,
                            type: "CURENT",
                            currency: "RON",
                            user: {
                                id: responseUserSave.data.id,
                            },
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${jwt}`,
                            },
                        }
                    )
                    .then((responseAccountSave) => {
                        axios
                            .post(
                                `${BASE_URL}/user/credentials`,
                                {
                                    username: username,
                                    password: password,
                                    authority: "user",
                                    active: 1,
                                    user: {
                                        id: responseUserSave.data.id,
                                    },
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${jwt}`,
                                    },
                                }
                            )
                            .then((responseUserCredentials) => {
                                console.log(
                                    "responseUserCredentials: ",
                                    responseUserCredentials
                                );
                                axios
                                    .post(
                                        `${BASE_URL}/transactions/save`,
                                        {
                                            creditor: {
                                                id: responseAccountSave.data.id,
                                            },
                                            debtor: {
                                                id: 1,
                                            },
                                            amountCreditor: amount,
                                            amountDebtor: amount,
                                        },
                                        {
                                            headers: {
                                                Authorization: `Bearer ${jwt}`,
                                            },
                                        }
                                    )
                                    .then((transaction) => {
                                        console.log(
                                            "transaction: ",
                                            transaction.data.id
                                        );
                                        setSuccess(true);
                                    })
                                    .catch((error) => {
                                        if (error.response.status === 403) {
                                            setJwt(null);
                                        }
                                        setHasError(true);
                                        setErrorMessage(error);
                                        console.log(error);
                                    });
                            })
                            .catch((error) => {
                                if (error.response.status === 403) {
                                    setJwt(null);
                                }
                                console.log(error);
                                setHasError(true);
                                setErrorMessage(error);
                            });
                        console.log(responseUserSave.data.id);
                    })
                    .catch((error) => {
                        if (error.response.status === 403) {
                            setJwt(null);
                        }
                        console.log(error);
                        setHasError(true);
                        setErrorMessage(error);
                    });
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    setJwt(null);
                }
                console.log(error);
                setHasError(true);
                setErrorMessage(error);
            });
    }

    return (
        <div className="HomePage-content">
            <div className="AUP-content">
                <h1>Adauga utilizator</h1>
                <input
                    placeholder="Nume"
                    className="AUP-input"
                    type="text"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                ></input>

                <input
                    placeholder="Email"
                    type="text"
                    className="AUP-input"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                ></input>

                <input
                    placeholder="Telefon"
                    type="text"
                    className="AUP-input"
                    onChange={(e) => {
                        setPhone(e.target.value);
                        setUsername(e.target.value);
                    }}
                ></input>

                <input
                    placeholder="Adresa"
                    type="text"
                    className="AUP-input"
                    onChange={(e) => {
                        setAddress(e.target.value);
                    }}
                ></input>

                <input
                    type="checkbox"
                    id="supplier"
                    value="Bike"
                    checked={supplier}
                    onChange={() => {
                        setSupplier((prevState) => {
                            console.log(!prevState);
                            return !prevState;
                        });
                    }}
                />
                <span> Furnizor</span>

                <hr
                    style={{
                        color: "black",
                        backgroundColor: "black",
                        height: 1,
                        width: "100%",
                        marginBottom: 15,
                    }}
                />
                <input
                    placeholder="Cont"
                    readOnly
                    type="text"
                    className="AUP-input"
                    value={accountNo}
                ></input>

                <button
                    style={{
                        width: "53%",
                        marginBottom: 20,
                    }}
                    onClick={() => {
                        setAccountNo("RON" + `${Date.now()}`);
                    }}
                >
                    Genereaza cont
                </button>
                <input
                    placeholder="Suma"
                    type="number"
                    className="AUP-input"
                    onChange={(e) => {
                        setAmount(e.target.value);
                    }}
                ></input>
                <hr
                    style={{
                        color: "black",
                        backgroundColor: "black",
                        height: 1,
                        width: "100%",
                        marginBottom: 15,
                    }}
                />
                <input
                    placeholder="Username"
                    type="text"
                    readOnly
                    className="AUP-input"
                    value={username}
                ></input>

                <input
                    placeholder="Parola"
                    type="password"
                    className="AUP-input"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                ></input>

                <button
                    style={{
                        width: "53%",
                    }}
                    onClick={() => {
                        addUser();
                    }}
                >
                    Adauga
                </button>
                {hasError ? (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                ) : (
                    <></>
                )}
                {success ? (
                    <p style={{ color: "green" }}>
                        Utilizatorul a fost adaugat cu succes
                    </p>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export default AddUserPage;
