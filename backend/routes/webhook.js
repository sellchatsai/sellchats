import express from "express";
import axios from "axios";
import ChatbotSetting from "../models/ChatbotSetting.js";

const router = express.Router();

/* ======================================================
   INGEST WEBSITE → DB + PYTHON API
   ====================================================== */

router.post("/ingest-website", async (req, res) => {
  console.log("🚀 /ingest-website HIT");

  try {
    const { userId, source } = req.body;

    /* ---------- BASIC VALIDATION ---------- */
    if (!userId || !source) {
      return res.status(400).json({
        message: "User ID or Website URL missing."
      });
    }

    /* ---------- URL FORMAT VALIDATION ---------- */
    let parsedUrl;
    try {
      parsedUrl = new URL(source);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }

      // ❌ Block localhost & IP
      const hostname = parsedUrl.hostname;

      if (
        hostname === "localhost" ||
        /^[0-9.]+$/.test(hostname)
      ) {
        return res.status(400).json({
          message: "Invalid website URL."
        });
      }

    } catch {
      return res.status(400).json({
        message: "Invalid website URL format."
      });
    }

    /* ---------- CHECK IF WEBSITE IS LIVE & REAL ---------- */
    try {
      const response = await axios.get(source, {
        timeout: 8000,
        maxRedirects: 5,
        validateStatus: () => true
      });

      const html = (response.data || "").toLowerCase();

      // ❌ If status error
      if (response.status >= 400) {
        return res.status(400).json({
          message: "Website is not reachable."
        });
      }

      // ❌ Block parked / for sale pages
      const blockedKeywords = [
        "domain is for sale",
        "buy this domain",
        "this domain may be for sale",
        "godaddy",
        "sedo",
        "namecheap",
        "parked",
        "forsale"
      ];

      const isParked = blockedKeywords.some(keyword =>
        html.includes(keyword)
      );

      if (isParked) {
        return res.status(400).json({
          message: "The provided domain is not a live business website."
        });
      }

      // ❌ Block very small content pages
      if (html.length < 1500) {
        return res.status(400).json({
          message: "Website does not contain enough content to train."
        });
      }

    } catch (err) {
      return res.status(400).json({
        message: "Website is not reachable or not live."
      });
    }

    /* ---------- BLOCK SECOND UPLOAD ---------- */
    const existing = await ChatbotSetting.findOne({ userId });

    if (existing?.website) {
      return res.status(403).json({
        message:
          "Website already uploaded. Please contact Support if you need changes."
      });
    }

    /* ---------- SAVE TO DATABASE ---------- */
    await ChatbotSetting.findOneAndUpdate(
      { userId },
      { website: source },
      { upsert: true, new: true }
    );

    console.log("✅ Website validated & saved.");

    /* ---------- PYTHON API CALL (BACKGROUND) ---------- */
    axios.post(
      "https://store.sellchats.com/v1/ingest",
      { userId, source },
      { headers: { "Content-Type": "application/json" } }
    ).catch(err => {
      console.error("❌ Python API failed:", err.message);
    });

    /* ---------- SUCCESS RESPONSE ---------- */
    res.json({
      success: true,
      message: "Website uploaded successfully. Training started."
    });

  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    res.status(500).json({
      message: "Website ingest failed."
    });
  }
});

export default router;
