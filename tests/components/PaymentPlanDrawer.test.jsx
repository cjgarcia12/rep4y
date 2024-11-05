import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PaymentPlanDrawer from "@/components/PaymentPlanDrawer";
import "@testing-library/jest-dom";


// Use vi.mock instead of jest.mock
vi.mock("@/supabaseClient", () => ({
    from: vi.fn()
}));

vi.mock("@paypal/react-paypal-js", () => ({
    PayPalScriptProvider: ({ children }) => <div>{children}</div>,
    PayPalButtons: vi.fn()
}));

describe("PaymentPlanDrawer Component", () => {
    const onCloseMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders payment plan drawer with expected fields", () => {
        render(<PaymentPlanDrawer isOpen={true} onClose={onCloseMock} amount="50" recipient="test@example.com" />);
        
        expect(screen.getByText("Payment Plan Details")).toBeInTheDocument();
        expect(screen.getByLabelText("Payment Plan Duration (in months)")).toBeInTheDocument();
        expect(screen.getByLabelText("Payment Frequency")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    });

});
