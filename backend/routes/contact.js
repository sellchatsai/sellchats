import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";

const router = express.Router();

/* ======================================================
   MULTER (MEMORY STORAGE — VERCEL SAFE)
====================================================== */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ======================================================
   ROUTE
====================================================== */

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { name, email, subject, message, link } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });


    await transporter.sendMail({
      from: `"SellChats Support" <${process.env.MAIL_USER}>`,

      // 📩 ADMIN NE MAIL JASE
      to: process.env.ADMIN_EMAIL,

      // ↩️ ADMIN REPLY KARE TO USER NE JASE
      replyTo: email,

      subject: `New Contact Support Request: ${subject}`,

      html: `
    <h2>New Contact Support Form Submission</h2>

    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Subject:</b> ${subject}</p>
    <p><b>Link:</b> ${link || "-"}</p>

    <hr />

    <p><b>Message:</b></p>
    <p>${message.replace(/\n/g, "<br/>")}</p>
  `,

      attachments: req.file
        ? [
          {
            filename: req.file.originalname,
            content: req.file.buffer,
          },
        ]
        : [],
    });


    res.status(200).json({ success: true });
  } catch (err) {
    console.error("CONTACT ERROR:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
