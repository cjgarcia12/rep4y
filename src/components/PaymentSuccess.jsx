// PaymentSuccess.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// CSS Import
import "./paymentsuccess.css";

function PaymentSuccess() {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/');
    };

    return (
        <div className="payment-success-container">
            <Card className="payment-success-card">
                <CardHeader>
                    <CardTitle>
                        <h1>Payment Successful</h1>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Your payment was successful! You can log in to check the progress in your active payments.</p>
                </CardContent>
                <CardFooter>
                    <button className="login-button" onClick={handleLoginRedirect}>
                        Go to Login
                    </button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default PaymentSuccess;
