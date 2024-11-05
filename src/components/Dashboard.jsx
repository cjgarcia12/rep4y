import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/supabaseClient";
import userImg from "../assets/user.png";
import "./dashboard.css";
import ActivePaymentsDrawer from "@/components/ActivePaymentsDrawer.jsx";
import PaymentPlanDialog from "@/components/PaymentPlanDialog.jsx"; // Update import

function Dashboard() {
    const { logout, user } = useAuth();
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [recipientError, setRecipientError] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isPaymentPlanDialogOpen, setIsPaymentPlanDialogOpen] = useState(false); // Dialog state
    const [isRecipientValid, setIsRecipientValid] = useState(false);

    useEffect(() => {
        const fetchName = async () => {
            try {
                const { data: profile, error } = await supabase
                    .from("profiles")
                    .select("name")
                    .eq("id", user?.id)
                    .single();

                if (error) {
                    console.error("Failed to fetch name:", error.message);
                } else if (profile) {
                    setName(profile.name);
                }
            } catch (err) {
                console.error("An error occurred:", err.message);
            }
        };

        if (user?.id) {
            fetchName();
        }
    }, [user?.id]);

    const handleNumberClick = (value) => {
        if (value === "." && amount.includes(".")) return;
        if (value === "0" && amount === "") return;

        const newAmount = amount + value;
        const parsedAmount = parseFloat(newAmount);
        if (parsedAmount > 600 || parsedAmount < 1) return;

        setAmount(newAmount);
    };

    const handleClear = () => setAmount("");

    const handleRecipientChange = async (e) => {
        const email = e.target.value;
        setRecipient(email);
        setRecipientError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setRecipientError("Please enter a valid email address.");
            setIsRecipientValid(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("email")
                .eq("email", email)
                .single();

            if (error) {
                console.error("Error checking recipient email:", error.message);
                setRecipientError("An error occurred. Please try again.");
                setIsRecipientValid(false);
            } else if (data) {
                setRecipientError("");
                setIsRecipientValid(true);
            } else {
                setRecipientError("This email is not associated with a registered user.");
                setIsRecipientValid(false);
            }
        } catch (error) {
            console.error("An error occurred while checking recipient email:", error);
            setRecipientError("An error occurred. Please try again.");
            setIsRecipientValid(false);
        }
    };

    const handleRequest = () => {
        if (!isRecipientValid) {
            setRecipientError("Please specify a valid recipient.");
            return;
        }
        if (!amount) {
            setRecipientError("Please enter an amount.");
            return;
        }
        setRecipientError("");
        setIsPaymentPlanDialogOpen(true); // Open dialog
    };

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
    const closePaymentPlanDialog = () => setIsPaymentPlanDialogOpen(false); // Close dialog

    const isInputDisabled = isDrawerOpen || isPaymentPlanDialogOpen;

    return (
        <div className="dashboard-container">
            <Card className="dashboard-card">
                <CardHeader className="text-center">
                    <CardTitle className="card-title">
                        <img
                            src={userImg}
                            alt="User Profile link image"
                            className="profile-img"
                            style={{ cursor: "pointer" }}
                        />
                        {user.name || "User"}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="input-container">
                        <label htmlFor="recipient"></label>
                        <input
                            type="email"
                            id="recipient"
                            className="input-field"
                            placeholder="Enter recipient email"
                            value={recipient}
                            onChange={handleRecipientChange}
                            required
                            disabled={isInputDisabled} // Disable input if dialog is open
                        />
                        {recipientError && <p className="error-text">{recipientError}</p>}
                    </div>

                    <div className="amount-display">${amount || "0.00"}</div>

                    <div className="number-pad">
                        {[1, 2, 3].map((num) => (
                            <button
                                key={num}
                                className="pad-button"
                                onClick={() => handleNumberClick(num.toString())}
                                disabled={isInputDisabled}
                            >
                                {num}
                            </button>
                        ))}
                        {[4, 5, 6].map((num) => (
                            <button
                                key={num}
                                className="pad-button"
                                onClick={() => handleNumberClick(num.toString())}
                                disabled={isInputDisabled}
                            >
                                {num}
                            </button>
                        ))}
                        {[7, 8, 9].map((num) => (
                            <button
                                key={num}
                                className="pad-button"
                                onClick={() => handleNumberClick(num.toString())}
                                disabled={isInputDisabled}
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            className="pad-button"
                            onClick={() => handleNumberClick(".")}
                            disabled={isInputDisabled}
                        >.</button>
                        <button
                            className="pad-button"
                            onClick={() => handleNumberClick("0")}
                            disabled={isInputDisabled}
                        >0</button>
                        <button
                            className="pad-button"
                            onClick={handleClear}
                            disabled={isInputDisabled}
                        >C</button>
                    </div>

                    <div className="footer">
                        <button
                            className="request-button"
                            onClick={handleRequest}
                            disabled={isInputDisabled}
                        >
                            Pay ${amount || "0.00"}
                        </button>
                        <button
                            className="open-drawer-button"
                            onClick={toggleDrawer}
                        >
                            View Active Payment Plans
                        </button>
                    </div>
                </CardContent>

                <CardFooter className="footer">
                    <button className="logout-button" onClick={logout}>Logout</button>
                </CardFooter>
            </Card>

            {/* Dialog component instead of drawer */}
            <PaymentPlanDialog
                isOpen={isPaymentPlanDialogOpen}
                onClose={closePaymentPlanDialog}
                amount={amount}
                recipient={recipient}
            />
            <ActivePaymentsDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
        </div>
    );
}

export default Dashboard;
