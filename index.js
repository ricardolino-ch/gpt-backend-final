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
  const { text, action, anrede, schluss } = req.body;

  let systemPrompt = "";


if (action === "translate") {
  systemPrompt = `
Du bist ein professioneller Kundenservice-Übersetzer.
Übersetze den folgenden deutschen Text ins Französische – höflich, freundlich und professionell im Ton eines Schweizer Kundendienstmitarbeiters.
  `;
} else if (action === "translate-it") {
  systemPrompt = `
Sei un traduttore professionale del servizio clienti.
Traduci il seguente testo tedesco in italiano in modo educato, cordiale e professionale, come un rappresentante del servizio clienti svizzero.
  `;
} else {
  systemPrompt = `
Du bist ein Co-Pilot im Kundenservice. Verbessere den folgenden Antwortvorschlag sprachlich, strukturiere ihn klar und halte einen professionellen Ton.
Beginne mit der Anrede:

${anrede}

Dann ein Absatz:
Vielen Dank für Ihre Nachricht.

Danach folgt der überarbeitete Text.

Beende mit einem Absatz und folgender Zeile:

${schluss}
  `;
}



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
