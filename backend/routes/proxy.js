import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const target = req.query.url;
    if (!target) return res.status(400).send("Missing URL");

    const response = await fetch(target);
    let html = await response.text();

    // Remove HTML-level security headers
    html = html.replace(/x-frame-options/gi, "");
    html = html.replace(/frame-ancestors[^;"]*/gi, "");

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading website");
  }
});

export default router;
