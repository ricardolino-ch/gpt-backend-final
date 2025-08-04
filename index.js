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
  } else if (action === "translate-en") {
    systemPrompt = "Übersetze den folgenden Text höflich und professionell auf Englisch.";
  } else if (action === "fr-de") {
    systemPrompt = "Übersetze den folgenden französischen Text höflich und professionell ins Deutsche.";
  } else if (action === "it-de") {
    systemPrompt = "Übersetze den folgenden italienischen Text höflich und professionell ins Deutsche.";
  } else if (action === "summarize") {
    systemPrompt = "Fasse den folgenden Kommentar eines Mitglieds in Bulletpoints zusammen. Erfasse alle Wünsche und Aussagen kurz und prägnant. Ignoriere Grussformeln.";
  } else if (action === "en-de") {
    systemPrompt = "Übersetze den folgenden englischen Text höflich und professionell ins Deutsche.";
  } else {
    systemPrompt = `Du bist ein professioneller Co-Pilot im Kundenservice.
Die folgende Eingabe stammt vom Support-Agenten. Formuliere sie so um, dass sie dem Mitglied von Ricardo klar, professionell und freundlich mitgeteilt wird.
Wenn die Eingabe beispielsweise lautet: "Das Konto ist freigeschaltet", dann soll die Antwort dem Mitglied mitteilen, dass sein Konto erfolgreich freigeschaltet wurde – nicht, dass der Agent es nur wiederholt.
Denke mit und strukturiere den Text so, dass er als fertige Nachricht versendet werden kann.

Verwende als Einstieg:

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