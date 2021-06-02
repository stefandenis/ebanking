import { authorityType } from "../context/app.context";

interface AccountsData {
    id: number;
    accountNo: string;
    type: string;
    currency: string;
    amount: number;
}

interface AccountsDataTable {
    accountNo: string;
    type: string;
    currency: string;
    amount: number;
}

interface DepositDataTable {
    accountNo: string;
    type: string;
    currency: string;
    amount: number;
    time: string;
    interest: number;
}

interface Jwt {
    Authority: authorityType;
    sub: string;
    exp: number;
}
