// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedLoginStatus = sessionStorage.getItem("isLoggedIn");
        return storedLoginStatus ? JSON.parse(storedLoginStatus) : false;
    });

    // Helper function to check if user exists in DB
    const checkDB = async (userData) => {
        try {
            let { data: profiles, error } = await supabase
                .from("profiles")
                .select("email")
                .eq("email", userData.email);
            console.log('Profiles:', profiles);

            if (profiles.length === 0) {
                console.log("No user found, creating user in DB...");
                await supabase.from("profiles").insert([
                    { name: userData.name, email: userData.email }
                ]);
            } else {
                console.log("User found in DB");
            }
        } catch (error) {
            console.error("Error checking DB:", error);
        }
    };

    const login = (userData) => {
        console.log("AuthContext - login called with userData:", userData);
        checkDB(userData);
        setUser(userData);
        setIsLoggedIn(true);
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("isLoggedIn", true);
        console.log("AuthContext - After login: user:", userData, "isLoggedIn:", isLoggedIn);
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("isLoggedIn");
        console.log("AuthContext - logout called, isLoggedIn set to false");
    };

    useEffect(() => {
        console.log("AuthContext - isLoggedIn state changed:", isLoggedIn);
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
