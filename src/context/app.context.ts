import React from "react";

export type authorityType = "admin" | "user" | null;

export interface AppContext {
    username: string | null;
    authority: authorityType;
    jwt: string | null;
    setJwt: (jwt: string | null) => void;
}

export const APP_DEFAULT_VALUE = {
    username: null,
    authority: null,
    jwt: null,
    setJwt: (jwt: string | null) => {
        return jwt;
    },
};

export const appContext = React.createContext<AppContext>(APP_DEFAULT_VALUE);
