// Import necessary modules
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.45.6';

// Initialize Supabase client with environment variables
const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

// Initialize Resend API key
const RESEND_API_KEY = 're_Bpce57uC_EnKfDN3pfRdU8NZqzJHTFr8x';

// Function to send an email using the Resend API
const sendEmail = async (to: string, dueDate: string, amount: number, payeeEmail: string) => {
  // Construct the PayPal redirect URL with the payee's email and amount
  const redirectUrl = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${payeeEmail}&amount=${amount}&currency_code=USD&item_name=Monthly+Payment&return=http://localhost:5173/pay-confirm`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Rep4y <rep4y@rep4y.com>',
      to: [to],
      subject: 'Monthly Payment Due Reminder',
      html: `
        <p>This is a reminder that your payment of $${amount} is due on ${dueDate}. Please make your payment to avoid any penalties.</p>
        <p><a href="${redirectUrl}">Click here to pay via PayPal.</a></p>
      `,
    }),
  });

  if (!response.ok) {
    console.error(`Error sending email to ${to}:`, await response.text());
  } else {
    console.log(`Reminder email sent to ${to}`);
  }
};

// Main function to handle requests
const handler = async (_request: Request): Promise<Response> => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  // Query for transactions with payments due this day of the month
  const { data: dueTransactions, error } = await supabase
      .from('transactions')
      .select('payer_email, payee_email, created_at, end_date, amount')
      .gte('end_date', today.toISOString().split('T')[0]); // Ensure we only get active transactions

  if (error) {
    console.error('Error fetching due transactions:', error);
    return new Response('Error fetching due transactions', { status: 500 });
  }

  console.log(`Due transactions found: ${JSON.stringify(dueTransactions)}`);

  // Send reminder emails for each due transaction
  for (const transaction of dueTransactions) {
    const createdDate = new Date(transaction.created_at);
    const createdDay = createdDate.getDate();
    const createdMonth = createdDate.getMonth() + 1;

    // Check if today's day and month match the transaction's monthly due date
    if (createdDay === currentDay && createdMonth <= currentMonth) {
      console.log(`Sending email to ${transaction.payer_email} for due date ${transaction.created_at}`);
      await sendEmail(transaction.payer_email, transaction.created_at, transaction.amount, transaction.payee_email);
    }
  }

  return new Response('Monthly payment reminders processed', { status: 200 });
};

// Start the server using the handler
serve(handler);
