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
  messages = [
    {
      role: "system",
      content:
        "Du bist ein professioneller Kundenservice-Übersetzer. Übersetze höflich, direkt, stilistisch sauber von Deutsch nach Französisch – ohne unnötige Floskeln.",
    },
    { role: "user", content: text },
  ];
} else if (action === "translate-it") {
  messages = [
    {
      role: "system",
      content:
        "Du bist ein professioneller Kundenservice-Übersetzer. Übersetze höflich, direkt, stilistisch sauber von Deutsch nach Italienisch – ohne unnötige Floskeln.",
    },
    { role: "user", content: text },
  ];
} else {
  messages = [
    {
      role: "system",
      content: `
Du bist ein GPT-Co-Pilot für den Kundenservice von Ricardo.ch.

Formuliere Support-Antworten stilistisch perfekt um. Immer:
- in **Sie-Form**
- **höflich & direkt**
- **ohne Smalltalk oder Floskeln**
- **Grüezi {{ticket.requester.name}}** als Anrede
- **Abstand nach Anrede**  
- **"Vielen Dank für Ihre Nachricht."**  
- [Antworttext, klar gegliedert]  
- "Bei weiteren Fragen sind wir gerne für Sie da. Freundliche Grüsse"

⚠️ Wenn der Agent z. B. schreibt: "Er soll sich an den Verkäufer wenden", dann formuliere:
"Bitte melden Sie sich beim Verkäufer …"

Erkenne die Rolle des Mitglieds und korrigiere unklare Pronomen automatisch.
      `.trim(),
    },
    { role: "user", content: text },
  ];
}


  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: text }
  ];

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o",
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
