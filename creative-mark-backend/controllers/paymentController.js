// controllers/paymentController.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const createPayment = async (req, res) => {
  try {
    const { amount, description, card } = req.body;

    const response = await axios.post(
      "https://api.moyasar.com/v1/payments",
      {
        amount, // amount in Halalas (e.g., 10000 = 100 SAR)
        currency: "SAR",
        description: description || "Test Payment",
        source: {
          type: "creditcard",
          name: card?.name || "Imad Khan",
          number: card?.number || "4111111111111111", // default test card
          cvc: card?.cvc || "123",
          month: card?.month || "12",
          year: card?.year || "25",
        },
      },
      {
        auth: {
          username: process.env.MOYASAR_SECRET_KEY,
          password: "",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Payment Error:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://api.moyasar.com/v1/payments/${id}`,
      {
        auth: {
          username: process.env.MOYASAR_SECRET_KEY,
          password: "",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Verify Error:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
};
