import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/gpt", async (req, res) => {
  const { text, action } = req.body;

  let systemPrompt = "";

if (action === "translate-fr" || action === "translate") {
  systemPrompt = "Übersetze den folgenden Text höflich und professionell auf Französisch.";
} else if (action === "translate-it") {
  systemPrompt = "Übersetze den folgenden Text höflich und professionell auf Italienisch.";
} else {
  systemPrompt = `Du bist ein professioneller Co-Pilot im Kundenservice.
Verbessere den Text strukturiert damit dieser einem Mitglied von Ricardo versendet werden kann. Sei ausführlich, korrekt, denke mit. Beginne mit:

Grüezi {{ticket.requester.name}}

Vielen Dank für Ihre Anfrage.

Dann der optimierte Text.

Abschliessend:

Bei weiteren Fragen stehen wir Ihnen gerne zur Verfügung.

Freundliche Grüsse`;
}

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
    });

const output = chatCompletion.choices[0].message.content;
res.json({ text: output });
  } catch (error) {
    res.status(500).json({ error: "Fehler bei GPT", details: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});
