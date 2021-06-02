import axios from "axios";
import { type } from "os";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { appContext } from "../../../../context/app.context";
import "./AddAccountPage.css";
const BASE_URL = process.env.REACT_APP_BASE_URL;

interface Props {}

function AddAccountPage({}: Props): ReactElement {
    const [name, setName] = useState<string>("");

    const [phone, setPhone] = useState<string>("");

    const [accountNo, setAccountNo] = useState<string>("");
    const [type, setType] = useState<string>("CURENT");
    const [currency, setCurrency] = useState<string>("RON");
    const [amount, setAmount] = useState<string>("");
    const { jwt, setJwt } = useContext(appContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [hasError, setHasError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);
    const [isDeposit, setIsDeposit] = useState<boolean>(false);
    const [time, setTime] = useState<number>();
    const [interest, setInterest] = useState<number>();
    const [depositAmount, setDepositAmount] = useState<number>();
    const history = useHistory();

    useEffect(() => {
        axios
            .get(`${BASE_URL}/user/users`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })
            .then((users) => {
                console.log(users.data);
                setUsers(users.data);
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 403) {
                    setJwt(null);
                }
            });
    }, []);

    function addAccount() {
        var account = {};
        if (isDeposit) {
            account = {
                accountNo: accountNo,
                type: type,
                currency: currency,
                user: {
                    id: userId,
                },
                deposit: {
                    amount: amount,
                    time: time,
                    interest: interest,
                    remained_time: time,
                },
            };
        } else {
            account = {
                accountNo: accountNo,
                type: type,
                currency: currency,
                user: {
                    id: userId,
                },
                amount: amount,
            };
        }
        axios
            .post(`${BASE_URL}/account/save`, account, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })
            .then((responseAccountSave) => {
                console.log("responseAccountSave:", responseAccountSave);
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
                        console.log("transaction: ", transaction.data.id);
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
                console.log(error);
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
                <h1>Adauga cont</h1>
                <input
                    placeholder="Nume"
                    className="AUP-input"
                    type="text"
                    readOnly
                    value={name}
                ></input>

                <p style={{ marginBottom: 0 }}>Telefon</p>
                <select
                    onChange={(e) => {
                        setUserId(e.target.value);
                        var displayName = users.filter((user: User) => {
                            return user.id == e.target.value;
                        });
                        console.log(displayName[0].name);
                        setName(displayName[0].name);
                    }}
                    value={userId}
                >
                    {users?.map((user: User) => {
                        return <option value={user.id}>{user.phone}</option>;
                    })}
                </select>

                <p style={{ marginBottom: 0 }}>Tipul contului:</p>
                <select
                    style={{
                        marginBottom: 20,
                    }}
                    onChange={(e) => {
                        setType(e.target.value);
                        if (e.target.value == "ECONOMII") {
                            setIsDeposit(true);
                        } else setIsDeposit(false);
                    }}
                    value={type}
                >
                    <option value="CURENT">CURENT</option>
                    <option value="ECONOMII">ECONOMII</option>
                </select>

                {isDeposit ? (
                    <div className="AAP-deposit">
                        <input
                            placeholder="Timp"
                            type="number"
                            className="AUP-input"
                            onChange={(e) => {
                                setTime(parseInt(e.target.value));
                            }}
                        ></input>
                        <input
                            placeholder="Rata"
                            type="number"
                            className="AUP-input"
                            onChange={(e) => {
                                setInterest(parseInt(e.target.value));
                            }}
                        ></input>
                    </div>
                ) : (
                    <></>
                )}

                <p style={{ marginTop: 20, marginBottom: 0 }}>Valuta:</p>
                <select
                    onChange={(e) => {
                        setCurrency(e.target.value);
                    }}
                    value={currency}
                    style={{ marginBottom: 20 }}
                >
                    <option value="RON">RON</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                </select>

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
                        setAccountNo(
                            currency +
                                (type[0] == "E" ? "E" : "") +
                                `${Date.now()}`
                        );
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

                <button
                    style={{
                        width: "53%",
                    }}
                    onClick={() => {
                        addAccount();
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
                        Contul a fost adaugat cu succes
                    </p>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export default AddAccountPage;
