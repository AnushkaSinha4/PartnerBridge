import express from "express";
import Otp from "../models/Otp.js";

const router = express.Router();


// LOGIN (SEND OTP)
router.post("/login", async (req, res) => {
    console.log("LOGIN ROUTE HIT");
console.log(req.body);

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success:false,
        message:"Email required"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      email,
      otp
    });

    // TEMPORARY: show OTP in terminal
    console.log("OTP:", otp);

    res.json({
      success:true,
      message:"OTP sent"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success:false,
      message:"Server error"
    });

  }

});


// VERIFY OTP
router.post("/verify-otp", async (req, res) => {

  try {

    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        success:false,
        message:"Invalid OTP"
      });
    }

    await Otp.deleteMany({ email });

    res.json({
      success:true,
      data:{
        user:{
          role:"admin"
        },
        tokens:{
          accessToken:"demo-token"
        }
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success:false,
      message:"OTP verify error"
    });

  }

});

export default router;