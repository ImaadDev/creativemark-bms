import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  try {
    console.log("Testing Moyasar Secret Key:", process.env.MOYASAR_SECRET_KEY);

    const response = await axios.get("https://api.moyasar.com/v1/payments", {
      auth: {
        username: process.env.MOYASAR_SECRET_KEY, // your sk_test_xxx
        password: "", // must be empty
      },
    });

    console.log("✅ Success! Response from Moyasar:");
    console.log(response.data);
  } catch (err) {
    console.error("❌ Moyasar Error:", err.response?.data || err.message);
  }
})();
