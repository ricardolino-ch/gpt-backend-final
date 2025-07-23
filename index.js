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
Du bist ein Co-Pilot im Kundenservice. Der Agent schreibt einen ersten Antwortentwurf an den Kunden.
Deine Aufgabe ist es, den Text sprachlich zu verbessern, klarer zu strukturieren und professionell zu formulieren – aber die ursprüngliche Aussage zu respektieren.
Die Anrede ist bereits korrekt („Grüezi Vorname Nachname“) und soll nicht verändert werden.
Füge unter der Anrede einen Absatz ein, danach: „Vielen Dank für Ihre Nachricht.“
Dann erneut ein Absatz – und danach folgt der verbesserte Inhalt.
Der Text muss empathisch, hilfsbereit und kundenorientiert klingen – im Stil eines Schweizer Kundendienstmitarbeiters.
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
