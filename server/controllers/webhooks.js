import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/userModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebHooks = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Webhook Error: ${error.message}`,
        });
    }

    try {
        switch (event.type) {

            // ✅ CORRECT EVENT
            case "checkout.session.completed": {
                const session = event.data.object;
                const { transactionId, appId } = session.metadata || {};

                if (appId !== "chatAI" || !transactionId) {
                    return res.json({ received: true });
                }

                const transaction = await Transaction.findOne({ _id: transactionId });

                // 🔒 Idempotency check
                if (!transaction || transaction.isPaid) {
                    return res.json({ received: true });
                }

                // ✅ Add credits
                await User.updateOne(
                    { _id: transaction.userId },
                    { $inc: { credits: transaction.credits } }
                );

                // ✅ Mark payment as completed
                transaction.isPaid = true;
                await transaction.save();

                break;
            }

            default:
                console.log("Unhandled event type:", event.type);
        }

        res.json({ received: true });

    } catch (error) {
        res.status(500).json({
            message: `Webhook processing error: ${error.message}`,
        });
    }
};
