import React, {createContext, useContext, useState, useEffect} from "react";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUser(null);
        setLoading(false);
    }, []);

    const login = async () => {
        setUser({id: "1", name: "Admin", isAdmin: true});
    };

    const logout = () => {
        setUser(null);
    };

    const isAdmin = !!(user && user.isAdmin);

    return <AuthContext.Provider value={{user, loading, login, logout, isAdmin}}>{children}</AuthContext.Provider>;
}

// named hook
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
export default AuthProvider;
