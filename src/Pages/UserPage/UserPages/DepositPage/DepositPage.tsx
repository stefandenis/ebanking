import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Table from "../../../../Components/Table/Table";
import { appContext } from "../../../../context/app.context";
import { DepositDataTable } from "../../../../Models/accountData";
import "./DepositPage.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function DepositPage() {
    const [accountsData, setAccountsData] = useState<DepositDataTable[]>([]);
    const { jwt, setJwt, username } = useContext(appContext);
    const [showDepositCreation, setShowDepositCreation] =
        useState<boolean>(false);
    const [currency, setCurrency] = useState<string>("RON");
    const [accountNo, setAccountNo] = useState<string>("");
    const [time, setTime] = useState<number>();
    const [interest, setInterest] = useState<number>();
    const [amount, setAmount] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [hasError, setHasError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        axios
            .get(`${BASE_URL}/user/get/${username}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })
            .then((user) => {
                console.log(user.data);
                axios
                    .get(`${BASE_URL}/account/get/deposit/${user.data.id}`, {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    })
                    .then((deposits) => {
                        console.log("deposits:", deposits.data);
                        var depositsDTO: DepositDataTable[] = [];
                        for (let deposit of deposits.data) {
                            depositsDTO.push({
                                accountNo: deposit.accountNo,
                                type: deposit.type,
                                currency: deposit.currency,
                                amount: deposit.amount,
                                time: deposit.time,
                                interest: deposit.interest,
                            });
                        }

                        setAccountsData(depositsDTO);
                        console.log(depositsDTO);
                    })
                    .catch((error) => {
                        console.log(error);
                        if (error.response.status === 403) {
                            setJwt(null);
                        }
                        console.log(error);
                    });
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    setJwt(null);
                }
                console.log(error);
            });
    }, []);

    function deposit() {
        axios
            .get(`${BASE_URL}/user/get/${username}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })
            .then((user) => {
                axios
                    .post(
                        `${BASE_URL}/account/save`,
                        {
                            accountNo: accountNo,
                            type: "ECONOMII",
                            currency: currency,
                            user: {
                                id: user.data.id,
                            },
                            deposit: {
                                amount: amount,
                                time: time,
                                interest: interest,
                                remained_time: time,
                            },
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${jwt}`,
                            },
                        }
                    )
                    .then((responseAccountSave) => {
                        console.log(
                            "responseAccountSave:",
                            responseAccountSave
                        );
                        setShowDepositCreation(false);
                        setSuccess(true);
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
            });
    }
    return (
        <div className="HomePage-content">
            <h1>DEPOZIT</h1>
            <Table
                tableHeaders={[
                    "CONT",
                    "TIP",
                    "VALUTA",
                    "SUMA",
                    "TERMEN",
                    "DOBANDA",
                ]}
                tableRows={accountsData}
            ></Table>
            <button
                className="DepositPage-deposit"
                onClick={() => {
                    setShowDepositCreation(true);
                }}
            >
                Adauga depozit
            </button>
            {hasError ? <p style={{ color: "red" }}>{errorMessage}</p> : <></>}
            {success ? (
                <p style={{ color: "green" }}>
                    Depozitul a fost adaugat cu succes
                </p>
            ) : (
                <></>
            )}
            {showDepositCreation ? (
                <div className="DepositPage-depositInfo">
                    <div className="DepositPage-createDeposit">
                        <p style={{ marginTop: 20, marginBottom: 0 }}>
                            Valuta:
                        </p>
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
                                setAccountNo(currency + "E" + `${Date.now()}`);
                            }}
                        >
                            Genereaza cont
                        </button>

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
                                deposit();
                            }}
                        >
                            Adauga
                        </button>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}

export default DepositPage;
