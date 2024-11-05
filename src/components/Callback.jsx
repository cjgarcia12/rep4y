import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import "./callback.css";

const CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_PAYPAL_SECRET;

function Callback() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [progress, setProgress] = useState(0); // Track loading progress

    useEffect(() => {
        const handleCallback = async () => {
            setProgress(20); // Start progress

            const urlParams = new URLSearchParams(window.location.search);
            const authorizationCode = urlParams.get('code');

            if (authorizationCode) {
                try {
                    const tokenData = await getPayPalOAuthToken(authorizationCode);
                    setProgress(80); // Update progress after token retrieval

                    if (tokenData) {
                        const userData = await getUserInfo(tokenData.access_token);
                        setProgress(100); // Update progress after user info retrieval

                        login(userData);
                        setProgress(100); // Finalize progress
                        navigate('/dashboard');
                    }
                } catch (error) {
                    console.error('Error handling callback:', error);
                }
            }
        };

        handleCallback();
    }, [login, navigate]);

    async function getPayPalOAuthToken(authorizationCode) {
        const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
        const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`,
            },
            body: new URLSearchParams({
                'grant_type': 'authorization_code',
                'code': authorizationCode,
            }),
        });

        if (!response.ok) throw new Error(`PayPal API Error: ${response.status}`);
        return await response.json();
    }

    async function getUserInfo(accessToken) {
        const response = await fetch('https://api-m.sandbox.paypal.com/v1/identity/openidconnect/userinfo?schema=openid', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`PayPal API Error: ${response.status}`);
        return await response.json();
    }

    return (
        <div className="load-container">
            <Card className="callback-card">
                <CardHeader>
                    <CardTitle>
                        <h1>Loading your account...</h1>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="progress-bar">
                        <Progress value={progress} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Callback;

