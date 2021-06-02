import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { appContext } from "../../../../context/app.context";
import { AccountsData } from "../../../../Models/accountData";
import "./ExchangeRatePage.css";
const BASE_URL = process.env.REACT_APP_BASE_URL;

function ExchangeRatePage() {
    const [accountsDataDebitor, setAccountsDataDebitor] = useState<
        AccountsData[]
    >([]);
    const [accountsDataCreditor, setAccountsDataCreditor] = useState<
        AccountsData[]
    >([]);

    const [error, setError] = useState();
    const [debitorId, setDebitorId] = useState<number>();
    const [creditorId, setCreditorId] = useState<number>();
    const [amountDebited, setAmountDebited] = useState<string>();
    const [amountCredited, setAmountCredited] = useState<string>();
    const [currencyDebited, setCurrencyDebited] = useState<string>();
    const [currencyCredited, setCurrencyCredited] = useState<string>();
    const [details, setDetails] = useState<string>();
    const [friendUsers, setFriendUsers] = useState<User[]>([]);
    const { jwt, setJwt, username } = useContext(appContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [hasError, setHasError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [friendId, setFriendId] = useState<string>("");

    useEffect(() => {
        console.log("amountCredited: ", amountCredited);
        console.log("amountDebited: ", amountDebited);
    }, [amountCredited, amountDebited]);
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
                        setCurrencyDebited(
                            transactions.data[0].accountNo.substring(0, 3)
                        );
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

        var currency = e.target.options[e.target.selectedIndex].text.substring(
            0,
            3
        );
        console.log(currency);
        setCurrencyDebited(currency);
    }

    function getFriendUser(e: any) {
        setFriendId(e.target.value);
        getAccountsForUser(e.target.value);
    }
    function getAccountDataCreditor(e: any) {
        setCreditorId(e.target.value);
        console.log(e.target.value);
        var currency = e.target.options[e.target.selectedIndex].text.substring(
            0,
            3
        );
        console.log(currency);
        setCurrencyCredited(currency);
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
                if (accounts.data.length != 0) {
                    setCreditorId(accounts.data[0].id);
                    setCurrencyCredited(
                        accounts.data[0].accountNo.substring(0, 3)
                    );
                }
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
                    amountCreditor: amountCredited,
                    amountDebtor: amountDebited,
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

    function exchangeRate(amount: any) {
        axios
            .get(
                "http://api.exchangeratesapi.io/v1/latest?access_key=161b98301d0e3f31e5eeb91cad645858&symbols=USD,RON"
            )
            .then((response) => {
                var usd = response.data.rates.USD;
                var ron = response.data.rates.RON;
                console.log(usd);
                var finalAmount;
                if (currencyDebited == "RON") {
                    if (currencyCredited == "RON") {
                        setAmountCredited(amount);
                    } else if (currencyCredited == "EUR") {
                        finalAmount = amount / ron;
                        setAmountCredited(finalAmount.toString());
                    } else if (currencyCredited == "USD") {
                        finalAmount = (amount * usd) / ron;
                        setAmountCredited(finalAmount.toString());
                    }
                }

                if (currencyDebited == "EUR") {
                    if (currencyCredited == "RON") {
                        finalAmount = amount * ron;
                        setAmountCredited(finalAmount.toString());
                    } else if (currencyCredited == "EUR") {
                        setAmountCredited(amount);
                    } else if (currencyCredited == "USD") {
                        finalAmount = amount * usd;
                        setAmountCredited(finalAmount.toString());
                    }
                }

                if (currencyDebited == "USD") {
                    if (currencyCredited == "RON") {
                        finalAmount = (amount * ron) / usd;
                        setAmountCredited(finalAmount.toString());
                    } else if (currencyCredited == "EUR") {
                        finalAmount = amount / usd;
                        setAmountCredited(finalAmount.toString());
                    } else if (currencyCredited == "USD") {
                        setAmountCredited(amount);
                    }
                }
            });
    }
    return (
        <div className="HomePage-content">
            <div className="AUP-content">
                <h1>Schimb valutar</h1>
                <div className="TAFP-selectFrom">
                    <p>Din contul</p>
                    <select
                        onChange={(e) => {
                            getAccountDataDebitor(e);
                            setAmountDebited("");
                            setAmountCredited("");
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
                            setAmountDebited("");
                            setAmountCredited("");
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

                <hr
                    style={{
                        color: "black",
                        backgroundColor: "black",
                        height: 1,
                        width: "100%",
                        marginBottom: 15,
                    }}
                />
                <p
                    style={{
                        marginBottom: 0,
                    }}
                >
                    Suma trimisa in {currencyDebited}
                </p>
                <input
                    placeholder="Suma"
                    className="TAFP-amount"
                    type="number"
                    onChange={(e) => {
                        setAmountDebited(e.target.value);
                        exchangeRate(e.target.value);
                    }}
                    value={amountDebited}
                ></input>

                <p
                    style={{
                        marginBottom: 0,
                    }}
                >
                    Suma primita in {currencyCredited}
                </p>
                <input
                    placeholder="Suma"
                    className="TAFP-amount"
                    type="number"
                    readOnly
                    value={amountCredited}
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
                <textarea
                    placeholder="Detaliile tranzactiei..."
                    className="TAFP-details"
                    value={details}
                    onChange={(e) => {
                        setDetails(e.target.value);
                    }}
                    style={{
                        marginBottom: 10,
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
                {hasError ? (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                ) : (
                    <></>
                )}
                {success ? (
                    <p style={{ color: "green" }}>
                        Tranzactia a fost efectuata cu succes
                    </p>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export default ExchangeRatePage;
