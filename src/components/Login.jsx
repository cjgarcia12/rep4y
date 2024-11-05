import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import logo from "../assets/logo.png";
import "./login.css";
import { AuthContext } from "@/context/AuthContext";
import PaypalLoginButton from "@/components/PaypalLoginButton.jsx";
import Terms from "@/components/Terms.jsx";

function Login() {
    const { login } = useContext(AuthContext);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Capture the user data returned from PayPal and login
    const handlePaypalLogin = (userData) => {
        try {
            // Use the user data to log in via AuthContext
            login(userData);
            navigate("/dashboard");
        } catch (error) {
            setError("Failed to authenticate with PayPal. Please try again.");
        }
    };



    return (
        <>
            <div className="login-container">
                <Card className="login-card">
                    <CardHeader className="text-center">
                        <img className="logo-img" src={logo} alt="logo" />
                        <CardTitle className="title-text">ReP4y</CardTitle>
                        <CardDescription>Please log in with PayPal</CardDescription>
                    </CardHeader>
                    <CardContent className="login-content">
                        {/* Render PayPal Login Button and pass user data on successful login */}
                        <PaypalLoginButton onSuccess={handlePaypalLogin} />
                        {error && <p className="error-message">{error}</p>}
                    </CardContent>
                    <CardFooter className="footer">
                        <Terms />
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}

export default Login;
