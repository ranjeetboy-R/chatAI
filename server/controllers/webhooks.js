import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/userModel.js";

export const stripeWebHooks = async (req, res) => {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers["stripe-signature"]

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    }
    catch (error) {
        return res.status(400).json({ success: false, message: `Webhooks Error: ${error.message}` })
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                })

                const session = sessionList.data[0];

                if (!session) {
                    return res.json({ received: true, message: "Checkout session not found" });
                }

                const { transactionId, appId } = session.metadata;

                if (appId === 'chatAI') {
                    const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false })

                    if (!transaction) {
                        return res.json({ received: true, message: "Transaction already processed or not found" });
                    }

                    // Update credit in user account 
                    await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } })

                    // Update credit Payment status 
                    transaction.isPaid = true;
                    await transaction.save();
                }
                else {
                    return res.json({ received: true, message: "Ignored event: Invalid app" })
                }
            }
                break;

            default:
                console.log("Unhandled event type:", event.type);
                break;
        }
        res.json({ received: true })
    }
    catch (error) {
        res.status(500).json({ message: `Webhook processing error: ${error.message}` })
    }
}