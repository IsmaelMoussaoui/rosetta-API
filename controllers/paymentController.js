const stripe = require('stripe')(process.env.STIPE_API_KEY);

exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Montant du paiement en centimes
            currency: "eur", // Devise
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};
