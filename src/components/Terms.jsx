import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import "./terms.css"; // Use CSS for any additional styling

function TermsDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="terms-trigger">Read Terms of Service</button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Terms of Service</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <h2>Disclaimer</h2>
                    <p>
                        ReP4y does not hold or manage any funds and is not liable for any missed or broken payments.
                        All payments arranged via ReP4y are based on a handshake agreement between the involved parties.
                        This app is solely intended to assist with automating recurring peer-to-peer payments.
                    </p>
                    <h2>Agreement</h2>
                    <p>
                        By using ReP4y, you acknowledge and agree that ReP4y is not responsible for managing or verifying
                        the completion of payments. You are responsible for honoring your commitments with other users.
                    </p>
                </DialogDescription>
                <DialogFooter>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default TermsDialog;
