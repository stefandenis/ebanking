import axios from "axios";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import Table from "../../../../Components/Table/Table";
import { appContext } from "../../../../context/app.context";
import "./HistoryPage.css";
const BASE_URL = process.env.REACT_APP_BASE_URL;
interface Props {}

function HistoryPage({}: Props): ReactElement {
    const [transactions, setTransactions] = useState<object[]>([]);
    const { jwt, setJwt, username } = useContext(appContext);

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
                    .then((accounts) => {
                        console.log("accounts:", accounts.data);
                        axios
                            .post(
                                `${BASE_URL}/transactions/getAllByUser`,
                                accounts.data,
                                {
                                    headers: {
                                        Authorization: `Bearer ${jwt}`,
                                    },
                                }
                            )
                            .then((transactions) => {
                                console.log(transactions.data);
                                var transactionsDTO = [];
                                for (let transaction of transactions.data) {
                                    transactionsDTO.push({
                                        creditor: transaction.creditor,
                                        debtor: transaction.debtor,
                                        amount: transaction.amount,
                                        details: transaction.details,
                                        invoiceNo:
                                            transaction.invoiceNo == null
                                                ? "-"
                                                : transaction.invoiceNo,
                                    });
                                }

                                setTransactions(transactionsDTO);
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                        if (error.response.status === 403) {
                            setJwt(null);
                        }
                    });
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 403) {
                    setJwt(null);
                }
            });
    }, []);
    return (
        <div className="HomePage-content">
            <h1>Istoric</h1>
            <Table
                tableHeaders={[
                    "CREDITOR",
                    "DEBTOR",
                    "SUMA",
                    "DETALII",
                    "NR. FACTURA",
                ]}
                tableRows={transactions}
            ></Table>
        </div>
    );
}

export default HistoryPage;
