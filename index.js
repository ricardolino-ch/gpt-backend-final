import express from "express";
import bodyParser from "body-parser";
import { OpenAI } from "openai";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/gpt", async (req, res) => {
  const { text, action } = req.body;

  let systemPrompt = "";

  if (action === "translate") {
    systemPrompt = `
Du bist ein professioneller Kundenservice-Übersetzer.
Übersetze höflich, direkt, klar vom Deutschen ins Französische.
    `.trim();
  } else if (action === "translate-it") {
    systemPrompt = `
Sei un traduttore professionale.
Traduci il seguente testo dal tedesco all'italiano, in modo educato, chiaro e formale.
    `.trim();
  } else {
    systemPrompt = `
Du bist ein GPT-Co-Pilot für den Kundenservice von Ricardo.ch.

Strukturiere den folgenden Antwortvorschlag:
- Anrede: Grüezi {{ticket.requester.name}}
- Absatz
- „Vielen Dank für Ihre Nachricht.“
- Absatz
- Umformulierte Hauptaussage (professionell, klar, direkt)
- Schluss: „Bei weiteren Fragen sind wir gerne für Sie da.“

Vermeide Floskeln. Verwende „Sie“. Formuliere indirekte Aussagen (z. B. „er soll sich beim Verkäufer melden“) aktiv („Bitte melden Sie sich beim Verkäufer …“).
    `.trim();
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ text: reply }); // ← wichtig!
  } catch (error) {
    console.error("GPT Fehler:", error);
    res.status(500).json({ error: "GPT fehlgeschlagen" });
  }
});

app.listen(port, () => {
  console.log("✅ GPT-Backend läuft");
});
