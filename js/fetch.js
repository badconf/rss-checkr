async function fetchRssArticles(feedUrl) {
  const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`);
  const data = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, "application/xml");
  const items = xmlDoc.querySelectorAll("item");
  const articles = [];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 7);

  items.forEach(item => {
      const title = item.querySelector("title")?.textContent || "Sans titre";
      const link = item.querySelector("link")?.textContent || "#";
      const pubDate = new Date(item.querySelector("pubDate")?.textContent || "");
      
      if (pubDate > yesterday) {
          articles.push({ title, link, pubDate });
      }
  });

  return articles;
}

const params = new URLSearchParams(window.location.search);
const feedUrl = params.get("feed");
if (feedUrl) {
  fetchRssArticles(feedUrl).then(articles => {
      const container = document.getElementById("articles");
      if (container) {
        container.innerHTML = "";
        if (articles.length === 0) {
            // no article trouvé, print "no result"
            container.textContent = "No result";
        } else {
          articles.forEach(article => {
              const articleElement = document.createElement("div");
              articleElement.innerHTML = `<p><a href="${article.link}" target="_blank">${article.title}</a></p>`;
              container.appendChild(articleElement);
          });
        }
      }
  });
}
