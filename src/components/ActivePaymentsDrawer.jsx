import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import "./activepaymentsdrawer.css";

function ActivePaymentsDialog({ isOpen, onClose }) {
    const { user } = useAuth();
    const [activePayments, setActivePayments] = useState([]);

    // Fetch transactions from Supabase
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from("transactions")
                    .select("payee_email, created_at, end_date, purpose")  // Added `purpose` field
                    .eq("payer_email", user.email);

                if (error) {
                    console.error("Error fetching transactions:", error);
                } else {
                    const paymentsWithProgress = data.map((payment) => {
                        const startDate = new Date(payment.created_at);
                        const endDate = new Date(payment.end_date);
                        const currentDate = new Date();

                        // Calculate the total months between the start and end date
                        const totalMonths =
                            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                            (endDate.getMonth() - startDate.getMonth()) + 1;

                        // Calculate months passed since the start date
                        const monthsPassed =
                            (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
                            (currentDate.getMonth() - startDate.getMonth()) + 1;

                        // Calculate the progress as a percentage, ensuring it doesn’t exceed 100%
                        const progress = Math.min(
                            100,
                            Math.floor((monthsPassed / totalMonths) * 100)
                        );

                        return { ...payment, progress };
                    });
                    setActivePayments(paymentsWithProgress);
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        if (isOpen) fetchTransactions();
    }, [isOpen, user]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="active-payments-dialog">
                <DialogHeader>
                    <DialogTitle>Active Payment Plans</DialogTitle>
                </DialogHeader>
                <ul className="active-payments-list">
                    {activePayments.map((payment, index) => (
                        <li key={index} className="payment-item">
                            <p><strong>Payee:</strong> {payment.payee_email}</p>
                            <p><strong>Purpose:</strong> {payment.purpose}</p> {/* Display purpose here */}
                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{ width: `${payment.progress}%` }}
                                ></div>
                            </div>
                            <p>{payment.progress}% complete</p>
                        </li>
                    ))}
                </ul>
                <DialogClose asChild>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}

export default ActivePaymentsDialog;

