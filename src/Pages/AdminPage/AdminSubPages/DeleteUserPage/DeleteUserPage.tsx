import axios from "axios";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { appContext } from "../../../../context/app.context";
const BASE_URL = process.env.REACT_APP_BASE_URL;
interface Props {}

function DeleteUserPage({}: Props): ReactElement {
    const [phone, setPhone] = useState<string>("");
    const [hasError, setHasError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { jwt, setJwt } = useContext(appContext);
    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState<string>("");
    const [userId, setUserId] = useState<string>("");

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

    function deleteUser() {
        axios
            .get(`${BASE_URL}/user/delete/account/${userId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })
            .then((deleteResponse) => {
                console.log("deleteResponse:", deleteResponse);
                setSuccess(true);
            })
            .catch((error) => {
                console.log(error);
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
                <h1>Sterge utilizator</h1>
                <input
                    placeholder="Nume"
                    className="AUP-input"
                    type="text"
                    readOnly
                    value={name}
                ></input>
                <p style={{ marginBottom: 0 }}>Telefon</p>
                <select
                    style={{
                        marginBottom: 20,
                    }}
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
                <button
                    style={{
                        width: "53%",
                    }}
                    onClick={() => {
                        deleteUser();
                    }}
                >
                    Sterge user
                </button>
                {hasError ? (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                ) : (
                    <></>
                )}
                {success ? (
                    <p style={{ color: "green" }}>Utilizatorul a fost sters</p>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export default DeleteUserPage;
