import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     axios.get("http://localhost:8080/auth/me", { withCredentials: true })
    //         .then(response => {
    //             if (response.data.email) {
    //                 setUser(response.data);
    //             }
    //         })
    //         .catch(() => setUser(null));
    // }, []);

    useEffect(() => {
    axios.get("http://localhost:8080/auth/me", { withCredentials: true })
        .then(response => {
            if (response.data && response.data.email) {
                setUser(response.data);
            }
        })
        .catch(() => setUser(null));
}, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
