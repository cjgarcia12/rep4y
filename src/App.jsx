import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// CSS Imports
import './App.css';

// Component Imports
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Callback from "./components/Callback";
import Terms from "./components/Terms.jsx";
import { AuthProvider, useAuth } from "@/context/AuthContext.jsx";
import PaymentSuccess from "@/components/PaymentSuccess.jsx";

// Protected Route component to enforce login status
function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth();
    console.log("ProtectedRoute - isLoggedIn:", isLoggedIn);
    return isLoggedIn ? children : <Navigate to="/" />;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Default to login page */}
                    <Route path="/" element={<Login />} />

                    {/* Callback route for handling PayPal login response */}
                    <Route path="/callback" element={<Callback />} />

                    {/* Route for successful payment */}
                    <Route path="/pay-confirm" element={<PaymentSuccess />} />

                    {/* Route for TOS */}
                    <Route path="/terms" element={<Terms />}  />

                    {/* Protected dashboard route */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
export default App;
