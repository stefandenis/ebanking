import axios from "axios";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { appContext } from "../../../../context/app.context";
import { AccountsData } from "../../../../Models/accountData";
import "./AddFoundsPage.css";
interface Props {}
const BASE_URL = process.env.REACT_APP_BASE_URL;

function AddFoundsPage({}: Props): ReactElement {
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
    const [creditorId, setCreditorId] = useState<string>("");
    const [accountsDataCreditor, setAccountsDataCreditor] = useState<
        AccountsData[]
    >([]);

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
                setUsers(
                    users.data.filter((user: User) => {
                        return user.name != "admin";
                    })
                );
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 403) {
                    setJwt(null);
                }
            });
    }, []);

    function addFounds() {
        axios
            .post(
                `${BASE_URL}/transactions/save`,
                {
                    creditor: {
                        id: creditorId,
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

    return (
        <div className="HomePage-content">
            <div className="AUP-content">
                <h1>Adauga fonduri</h1>
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
                        getAccountsForUser(e.target.value);
                    }}
                    value={userId}
                >
                    {users?.map((user: User) => {
                        return <option value={user.id}>{user.phone}</option>;
                    })}
                </select>

                <p style={{ marginBottom: 0 }}>In contul</p>
                <select
                    style={{ marginBottom: 20 }}
                    onChange={(e) => {
                        setCreditorId(e.target.value);
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
                        addFounds();
                    }}
                >
                    Adauga fonduri
                </button>
                {hasError ? (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                ) : (
                    <></>
                )}
                {success ? (
                    <p style={{ color: "green" }}>Suma a fost adaugata</p>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export default AddFoundsPage;
