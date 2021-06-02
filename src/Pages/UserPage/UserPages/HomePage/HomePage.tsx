import React, { ReactElement, useState, useEffect, useContext } from "react";
import "./HomePage.css";
import Table from "../../../../Components/Table/Table";
import { AccountsDataTable } from "../../../../Models/accountData";
import axios from "axios";
import { appContext } from "../../../../context/app.context";
const BASE_URL = process.env.REACT_APP_BASE_URL;
interface Props {}

function HomePage({}: Props): ReactElement {
    const [accountsData, setAccountsData] = useState<AccountsDataTable[]>([]);
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
                        console.log("transactions:", accounts.data);
                        var accountsDTO: AccountsDataTable[] = [];
                        for (let account of accounts.data) {
                            accountsDTO.push({
                                accountNo: account.accountNo,
                                type: account.type,
                                currency: account.currency,
                                amount: account.amount,
                            });
                        }

                        setAccountsData(accountsDTO);
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
                console.log(error);
                if (error.response.status === 403) {
                    setJwt(null);
                }
            });
    }, []);
    return (
        <div className="HomePage-content">
            <h1>HOME</h1>
            <Table
                tableHeaders={["CONT", "TIP", "VALUTA", "SUMA"]}
                tableRows={accountsData}
            ></Table>
        </div>
    );
}

export default HomePage;
