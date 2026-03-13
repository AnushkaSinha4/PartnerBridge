import nodemailer from "nodemailer";

/* ================= EMAIL TRANSPORTER ================= */

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/* ================= SEND OTP EMAIL ================= */

export const sendOtpEmail = async(email, otp) => {

    try {

        const mailOptions = {

            from: `"Partner Bridge" <${process.env.EMAIL_USER}>`,

            to: email,

            subject: "Your Partner Bridge Login OTP",

            html: `
      <div style="font-family: Arial, sans-serif; padding:20px">

        <h2>Partner Bridge Login</h2>

        <p>Your OTP for login is:</p>

        <h1 style="color:#667eea">${otp}</h1>

        <p>This OTP will expire in 5 minutes.</p>

        <p>If you did not request this, please ignore this email.</p>

      </div>
      `
        };

        await transporter.sendMail(mailOptions);

        console.log("OTP email sent to:", email);

    } catch (error) {

        console.error("Error sending OTP email:", error);

        throw new Error("Email sending failed");

    }

};