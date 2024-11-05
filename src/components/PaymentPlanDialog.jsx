import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { supabase } from "@/supabaseClient";
import "./paymentplandialog.css";

function PaymentPlanDialog({ isOpen, onClose, amount, recipient }) {
    const [purpose, setPurpose] = useState(""); // Purpose for the payment plan
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
    const [createdAt, setCreatedAt] = useState(new Date()); // Start date of the plan

    useEffect(() => {
        if (isOpen) {
            console.log(`Dialog opened with Recipient: ${recipient}, Amount: ${amount}`);
            console.log(purpose);
            setCreatedAt(new Date()); // Reset start date whenever dialog opens
        }
    }, [isOpen, amount, recipient]);

    // Calculate the end date based on selected month/year and match day to start date
    const calculateEndDate = () => {
        const endDate = new Date(selectedYear, selectedMonth - 1, createdAt.getDate());
        return endDate;
    };

    const createOrder = (data, actions) => {
        if (!amount || !recipient) {
            console.error("Missing required values: amount or recipient.");
            return;
        }

        return actions.order.create({
            purchase_units: [
                {
                    amount: { value: Number(amount), currency_code: "USD" },
                    payee: { email_address: recipient },
                },
            ],
            application_context: { shipping_preference: "NO_SHIPPING" },
        });
    };

    const onApprove = async (data, actions) => {
        return actions.order.capture().then((details) => {
            try {
                const amount = details.purchase_units[0].amount.value;
                const payee_email = details.purchase_units[0].payee.email_address;
                const transactionId = details.purchase_units[0].payments.captures[0].id;
                const payer_email = details.payer.email_address;

                const endDate = calculateEndDate();
                console.log(purpose)
                saveTransactionToSupabase(transactionId, amount, payee_email, payer_email, "started", endDate);
                console.log(purpose)
            } catch (error) {
                console.error("Transaction failed:", error);
            }
            onClose();
        });
    };

    const saveTransactionToSupabase = async (transactionId, amount, payee_email, payer_email, current_status, end_date) => {
        const { data, error } = await supabase.from("transactions").insert([
            {
                created_at: createdAt,
                transaction_id: transactionId,
                amount: amount,
                payee_email: payee_email,
                payer_email: payer_email,
                current_status,
                end_date: end_date.toISOString(), // Ensure end_date is saved correctly
                purpose: purpose,
            },
        ]);

        if (error) {
            console.error("Error saving transaction:", error);
        } else {
            console.log("Transaction saved:", data);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="payment-plan-dialog">
                <DialogTitle>Payment Plan Details</DialogTitle>
                <DialogDescription>
                    <div className="input-container">
                        <label htmlFor="purpose">Purpose</label>
                        <input
                            type="text"
                            id="purpose"
                            className="input-field"
                            placeholder="Enter purpose of payment"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="endDate">Select End Date</label>
                        <div className="month-year-picker">
                            <select
                                id="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString("default", { month: "long" })}
                                    </option>
                                ))}
                            </select>

                            <select
                                id="year"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {Array.from({ length: 5 }, (_, i) => (
                                    <option key={i} value={new Date().getFullYear() + i}>
                                        {new Date().getFullYear() + i}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* PayPal Button */}
                    <div className="paypal-button-container">
                        <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
                            <PayPalButtons forceReRender={[isOpen]} createOrder={createOrder} onApprove={onApprove} />
                        </PayPalScriptProvider>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}

export default PaymentPlanDialog;
