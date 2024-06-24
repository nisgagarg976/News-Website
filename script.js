const API_KEY = "0f25726f45d548df8031d10a3811c71a";
const url = "https://newsapi.org/v2/everything?q=";
let page = 1;
let query = "India";
let loading = false;

window.addEventListener("load", () => fetchNews(query));

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && !loading) {
        fetchMoreNews();
    }
});

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    loading = true;
    document.getElementById("loading").style.display = "block";
    const res = await fetch(`${url}${query}&page=${page}&pageSize=10&apiKey=${API_KEY}`);
    const data = await res.json();
    if (data.articles && data.articles.length > 0) {
        bindData(data.articles);
    } else {
        page = 1; // Reset page number if no articles are returned
    }
    loading = false;
    document.getElementById("loading").style.display = "none";
    page++;
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
        timeZone: "Asia/Jakarta",
    });
    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

function onNavItemClick(id) {
    page = 1;
    query = id;
    document.getElementById("cards-container").innerHTML = "";
    fetchNews(id);
    const navItem = document.getElementById(id);
    document.querySelector(".nav-item.active")?.classList.remove("active");
    navItem.classList.add("active");
}

function fetchMoreNews() {
    fetchNews(query);
}



function toggleTheme() {
    document.body.classList.toggle("light-theme");
    const themeToggle = document.getElementById("theme-toggle");
    if (document.body.classList.contains("light-theme")) {
        themeToggle.innerHTML = '<img src="dark.png" alt="Dark Theme" />';
    } else {
        themeToggle.innerHTML = '<img src="day.png" alt="Light Theme" />';
    }
}
