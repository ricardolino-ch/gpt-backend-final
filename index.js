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
Übersetze den folgenden Text vom Deutschen ins Französische. 
Achte auf Höflichkeit, direkte Anrede mit "Sie" und eine saubere, klare Satzstruktur.
    `.trim();
  } else if (action === "translate-it") {
    systemPrompt = `
Sei un traduttore professionale del servizio clienti.
Traduci il testo seguente dal tedesco all'italiano in modo educato, chiaro e senza frasi fatte.
    `.trim();
  } else {
    systemPrompt = `
Du bist ein KI-gestützter Kundenservice-Co-Pilot von Ricardo.ch.

Deine Aufgabe:
- Formuliere Texte so, dass sie direkt an das Mitglied gerichtet sind.
- Verwende die Sie-Anrede.
- Beginne mit:
  Grüezi {{ticket.requester.name}}

  Vielen Dank für Ihre Nachricht.

- Gliedere den Hauptteil übersichtlich.
- Schließe mit:
  Bei weiteren Fragen sind wir gerne für Sie da.

  Freundliche Grüsse

Erkenne, wenn indirekte Sprache verwendet wird (z. B. „er soll sich beim Verkäufer melden“) und formuliere aktiv:
→ „Bitte melden Sie sich beim Verkäufer …“

Vermeide Floskeln, Smalltalk und irrelevante Höflichkeiten. Ziel ist eine klare, empathische und professionelle Support-Antwort.
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
    res.json({ text: reply }); // Wichtig: muss text heißen für app.js
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "GPT-Anfrage fehlgeschlagen." });
  }
});

app.listen(port, () => {
  console.log(`✅ GPT-Backend läuft auf Port ${port}`);
});
