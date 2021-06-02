import axios from "axios";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { appContext } from "../../../../../context/app.context";
import { AccountsData } from "../../../../../Models/accountData";
import "./SupplierPaymentPage.css";
interface Props {}
const BASE_URL = process.env.REACT_APP_BASE_URL;

function SupplierPaymentPage({}: Props): ReactElement {
    const [accountsDataDebitor, setAccountsDataDebitor] = useState<
        AccountsData[]
    >([]);
    const [accountsDataCreditor, setAccountsDataCreditor] = useState<
        AccountsData[]
    >([]);

    const [suppliers, setSuppliers] = useState<User[]>([]);
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
    const [supplierId, setSupplierId] = useState<string>("");
    const [invoiceNo, setInvoiceNo] = useState<string>("");

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
            .get(`${BASE_URL}/user/suppliers`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })
            .then((suppliers) => {
                console.log("users: ", suppliers.data);
                setSuppliers(suppliers.data);
                if (suppliers.data != 0) {
                    getAccountsForSupplier(suppliers.data[0].id);
                    setCreditorId(suppliers.data[0].id);
                }
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

    function getSupplier(e: any) {
        setSupplierId(e.target.value);
        getAccountsForSupplier(e.target.value);
    }
    function getAccountDataCreditor(e: any) {
        setCreditorId(e.target.value);
    }

    function getAccountsForSupplier(id: string) {
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
                    invoiceNo: invoiceNo,
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
                        getSupplier(e);
                    }}
                    value={supplierId}
                >
                    {suppliers.map((supplier: any) => {
                        return (
                            <option value={supplier.id}>{supplier.name}</option>
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
                    value={debitorId}
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
                placeholder="Numarul facturii"
                className="TAFP-amount"
                type="text"
                onChange={(e) => {
                    setInvoiceNo(e.target.value);
                }}
            ></input>

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

export default SupplierPaymentPage;
