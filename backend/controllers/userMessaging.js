
const transporter = require("../config/transporter"); 

const sendUserMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,       
      to: process.env.ADMIN_EMAIL,          
      subject: `New Message from ${firstName} ${lastName}`,
      html: `
        <h3>New Message from Online User</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent to admin successfully" });

  } catch (err) {
    console.error("Error sending user message:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { sendUserMessage };