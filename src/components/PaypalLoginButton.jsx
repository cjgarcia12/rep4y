import React from 'react';

const CLIENT_ID = 'AaImnODgq3dYJ5AqtXiabZOxGVxpy5w-HqGmORREbUPFNRNGVjlxXjmfqxtCK1ySHMubaFgg6FCaYKdE';
const SCOPES = 'openid profile email';
const REDIRECT_URI = window.location.protocol + 'localhost:5173/callback';

function PaypalLoginButton() {
    const authorizationUrl = `https://www.sandbox.paypal.com/signin/authorize?flowEntry=static&client_id=${CLIENT_ID}&scope=${encodeURIComponent(SCOPES)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

    return (
        <a href={authorizationUrl}>
            <img
                src="https://www.paypalobjects.com/devdoc/log-in-with-paypal-button.png"
                alt="Log in with PayPal"
                style={{ cursor: 'pointer' }}
            />
        </a>
    );
}

export default PaypalLoginButton;