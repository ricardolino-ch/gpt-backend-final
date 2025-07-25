require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/gpt', async (req, res) => {
  const { action, text } = req.body;

  let prompt;
  switch (action) {
    case 'improve':
      prompt = `Verbessere den folgenden Kundendiensttext sprachlich und stilistisch, ohne den Inhalt zu verändern:\n"""${text}"""`;
      break;
    case 'translate_de_fr':
      prompt = `Übersetze folgenden deutschen Text professionell ins Französische:\n"""${text}"""`;
      break;
    default:
      return res.status(400).json({ error: 'Unbekannte Aktion' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Du bist ein professioneller Kundendienst-Assistent.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    const reply = completion.choices[0].message.content.trim();
    res.json({ text: reply });
  } catch (err) {
    console.error('GPT-Fehler:', err);
    res.status(500).json({ error: 'Fehler bei der Anfrage an GPT' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`GPT-Backend läuft auf Port ${PORT}`));
