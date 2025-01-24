const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }))

app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).json({
        message: "success"
    })
})

app.post("/payment/create", async (req, res) => {
    const total = parseInt(req.query.total);
    const amountInCents = Math.round(total * 100);
    if (amountInCents > 0) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency: "usd"
            });

            res.status(201).json({
                clientSecret: paymentIntent.client_secret
            });
        } catch (error) {
            res.status(500).json({
                message: "Error creating payment intent",
                error: error.message
            });
        }
    } else {
        res.status(403).json({
            message: "Total must be greater than 0"
        });
    }
});

app.listen(5000, (err) => {
    if (err) throw err;
    console.log("Amazon server is running on port 5000,http://localhost:5000");
});
