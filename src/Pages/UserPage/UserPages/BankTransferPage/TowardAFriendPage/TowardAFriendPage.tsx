import axios from "axios";
import React, { ReactElement, useState, useEffect, useContext } from "react";
import { appContext } from "../../../../../context/app.context";
import { AccountsData } from "../../../../../Models/accountData";
import "./TowardAFriendPage.css";
const BASE_URL = process.env.REACT_APP_BASE_URL;
interface Props {}

function TowardAFriendPage({}: Props): ReactElement {
    const [accountsDataDebitor, setAccountsDataDebitor] = useState<
        AccountsData[]
    >([]);
    const [accountsDataCreditor, setAccountsDataCreditor] = useState<
        AccountsData[]
    >([]);

    const [error, setError] = useState();
    const [debitorId, setDebitorId] = useState<number>();
    const [creditorId, setCreditorId] = useState<number>();
    const [amount, setAmount] = useState<string>();
    const [details, setDetails] = useState<string>();
    const [friendUsers, setFriendUsers] = useState<User[]>([]);
    const { jwt, setJwt, username } = useContext(appContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [hasError, setHasError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [friendId, setFriendId] = useState<string>("");

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
                    .get(
                        `${BASE_URL}/account/get/${user.data.id}`,

                        {
                            headers: {
                                Authorization: `Bearer ${jwt}`,
                            },
                        }
                    )
                    .then((transactions) => {
                        console.log("transactions:", transactions.data);
                        setAccountsDataDebitor(transactions.data);
                        setDebitorId(transactions.data[0].id);
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
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 403) {
                    setJwt(null);
                }
                setHasError(true);
                setErrorMessage(error);
            });

        axios
            .get(`${BASE_URL}/user/users`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })
            .then((users) => {
                console.log("users: ", users.data);
                setFriendUsers(
                    users.data.filter((user: User) => {
                        return user.name != "admin";
                    })
                );
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    setJwt(null);
                }
            });
    }, []);

    function getAccountDataDebitor(e: any) {
        setDebitorId(e.target.value);
    }

    function getFriendUser(e: any) {
        setFriendId(e.target.value);
        getAccountsForUser(e.target.value);
    }
    function getAccountDataCreditor(e: any) {
        setCreditorId(e.target.value);
    }

    function getAccountsForUser(id: string) {
        axios
            .get(
                `${BASE_URL}/account/get/${id}`,

                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            .then((accounts) => {
                console.log("accounts:", accounts.data);
                setAccountsDataCreditor(accounts.data);
                if (accounts.data.length != 0)
                    setCreditorId(accounts.data[0].id);
            })
            .catch((error) => {
                console.log(error);
                // if (error.response.status === 403) {
                //     setJwt(null);
                // }
            });
    }
    function transferAmount() {
        axios
            .post(
                `${BASE_URL}/transactions/save`,
                {
                    creditor: {
                        id: creditorId,
                    },
                    debtor: {
                        id: debitorId,
                    },
                    amountCreditor:
                        amount != undefined ? parseInt(amount) : amount,
                    amountDebtor:
                        amount != undefined ? parseInt(amount) : amount,
                    details: details,
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
    }

    return (
        <div className="BankTransfer-content TAFP-content">
            <div className="TAFP-selectFrom">
                <p>Din contul</p>
                <select
                    onChange={(e) => {
                        getAccountDataDebitor(e);
                    }}
                    value={debitorId}
                >
                    {accountsDataDebitor.map((accountData) => {
                        return (
                            <option value={accountData.id}>
                                {accountData.accountNo}
                            </option>
                        );
                    })}
                </select>
            </div>

            <div className="TAFP-selectCATRE">
                <p>Catre</p>
                <select
                    onChange={(e) => {
                        getFriendUser(e);
                    }}
                    value={friendId}
                >
                    {friendUsers.map((friendUser) => {
                        return (
                            <option value={friendUser.id}>
                                {friendUser.name}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="TAFP-selectTo">
                <p>In contul</p>
                <select
                    onChange={(e) => {
                        getAccountDataCreditor(e);
                    }}
                    value={creditorId}
                >
                    {accountsDataCreditor.map((accountData) => {
                        return (
                            <option value={accountData.id}>
                                {accountData.accountNo}
                            </option>
                        );
                    })}
                </select>
            </div>
            <input
                placeholder="Suma"
                className="TAFP-amount"
                type="number"
                onChange={(e) => {
                    setAmount(e.target.value);
                }}
            ></input>
            <textarea
                placeholder="Detaliile tranzactiei..."
                className="TAFP-details"
                value={details}
                onChange={(e) => {
                    setDetails(e.target.value);
                }}
            ></textarea>

            <button
                className="TAFP-transfer-amount"
                onClick={() => {
                    transferAmount();
                }}
            >
                Transfera
            </button>
            {hasError ? <p style={{ color: "red" }}>{errorMessage}</p> : <></>}
            {success ? (
                <p style={{ color: "green" }}>
                    Tranzactia a fost efectuata cu succes
                </p>
            ) : (
                <></>
            )}
        </div>
    );
}

export default TowardAFriendPage;
