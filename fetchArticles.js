// fetchArticles.js
import fs from "fs/promises";
import fetch from "node-fetch";

const ZENDESK_API_URL = "https://help.ricardo.ch/api/v2/help_center/de/articles.json?page=";
const MAX_PAGES = 5; // Optional: Anzahl Seiten beschränken (je 30 Artikel)

async function fetchArticles() {
  let allArticles = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(`${ZENDESK_API_URL}${page}`);
    if (!res.ok) {
      console.error(`❌ Fehler bei Seite ${page}:`, res.statusText);
      break;
    }

    const json = await res.json();
    const articles = json.articles.map(article => ({
      title: article.title,
      content: article.body,
    }));

    console.log(`📄 Seite ${page}: ${articles.length} Artikel geladen`);
    allArticles = allArticles.concat(articles);

    if (!json.next_page) break;
  }

  await fs.writeFile("articles.json", JSON.stringify(allArticles, null, 2), "utf8");
  console.log(`💾 Fertig: ${allArticles.length} Artikel gespeichert in articles.json`);
}

fetchArticles();
