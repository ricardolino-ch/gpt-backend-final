const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/gpt", async (req, res) => {
  const { text, action } = req.body;

  const systemPrompt = `
Du bist ein professioneller Kundenservice-Textassistent. Verwandle unstrukturierte Rohantworten in vollständige, freundliche, professionell formulierte Antworten. 
Füge automatisch eine passende Anrede hinzu ("Grüezi {{ticket.requester.name}}"), 
bedanke dich für die Anfrage, strukturiere den Inhalt klar, und schließe mit einem höflichen Abschlusssatz und "Freundliche Grüsse".
`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: text }
  ];

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });

    const gptReply = chatCompletion.choices[0].message.content.trim();
    res.json({ text: gptReply });
  } catch (err) {
    console.error("GPT API Error:", err);
    res.status(500).json({ error: "Fehler beim GPT-Abruf" });
  }
});

app.listen(port, () => {
  console.log(`GPT-Backend läuft auf Port ${port}`);
});