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
Übersetze den folgenden deutschen Text ins Französische – höflich, freundlich und kontextsensitiv.
    `.trim();
  } else if (action === "translate-it") {
    systemPrompt = `
Du bist ein professioneller Kundenservice-Übersetzer.
Übersetze den folgenden deutschen Text ins Italienische – höflich, freundlich und klar.
    `.trim();
  } else {
    systemPrompt = `
Du bist ein exzellenter Co-Pilot für den Kundenservice.  
Verbessere, strukturiere und formuliere den folgenden Antwortvorschlag professionell um.

Beachte:
- Sprich das Mitglied immer direkt an.
- Die Anrede soll sein: Grüezi {{ticket.requester.name}}
- Danach 1 Zeile Abstand
- Dann: Vielen Dank für Ihre Nachricht.
- Danach wieder 1 Zeile Abstand
- Dann kommt der eigentliche Text
- Der Abschluss lautet: Freundliche Grüsse

Der Ton soll höflich, klar und empathisch sein – wie ein guter Kundenservice-Mitarbeiter.
Wenn der Text unklar ist, formuliere ihn so, dass der Leser ihn einfach versteht.
Erkenne implizite Absichten und wandle z. B. „Er soll sich beim Verkäufer melden“ in „Bitte melden Sie sich beim Verkäufer“ um.
    `.trim();
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`GPT-Backend läuft auf Port ${port}`);
});
