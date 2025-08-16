const API_KEY = "37005a4060d64c4c90b254aef6d22916";
const BASE_TOP = "https://newsapi.org/v2/top-headlines";
const BASE_SEARCH = "https://newsapi.org/v2/everything";

const newsContainer = document.getElementById("newsContainer");
const category = document.getElementById("newsCategory");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const region = document.getElementById("region");
const language = document.getElementById("language");
const themeToggle = document.getElementById("toggleTheme");
const loader = document.getElementById("loader");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let currentPage = 1;
let currentQuery = "";
let isSearch = false;

const mapCountry = {
  usa: "us",
  uk: "gb",
  india: "in",
  france: "fr",
  japan: "jp"
};

const showLoader = () => loader.classList.remove("hidden"); 
const hideLoader = () => loader.classList.add("hidden");

const getUrl = () => {
  const selectedLang = language.value;
  const selectedRegion = region.value;
  const selectedCategory = category.value;

  let langParam = selectedLang ? `&language=${selectedLang}` : "";
  let pageParam = `&pageSize=6&page=${currentPage}`;

  // Fallback for completely empty filters
  if (selectedRegion === "global" && selectedCategory === "all" && !currentQuery) {
    return `${BASE_SEARCH}?q=world${langParam}${pageParam}&apiKey=${API_KEY}`;
  }

  // Search mode
  if (currentQuery) {
    return `${BASE_SEARCH}?q=${encodeURIComponent(currentQuery)}${langParam}${pageParam}&apiKey=${API_KEY}`;
  }

  // Top-headlines mode
  let url = `${BASE_TOP}?apiKey=${API_KEY}${pageParam}${langParam}`;
  if (selectedCategory !== "all") url += `&category=${selectedCategory}`;
  if (selectedRegion !== "global") url += `&country=${mapCountry[selectedRegion]}`;
  return url;
};

const fetchNews = async (append = false) => {
  showLoader();
  const url = getUrl();
  try {
    const res = await fetch(url);
    const data = await res.json();
    const articles = data.articles || [];
    if (append) appendNews(articles);
    else renderNews(articles);
  } catch (err) {
    newsContainer.innerHTML = "<p>Error loading news.</p>";
  } finally {
    hideLoader();
  }
};

const renderNews = (articles) => {
  if (!articles.length) {
    newsContainer.innerHTML = "<p>No articles found.</p>";
    return;
  }
  newsContainer.innerHTML = articles.map(cardHTML).join("");
};

const appendNews = (articles) => {
  if (!articles.length) {
    loadMoreBtn.disabled = true;
    return;
  }
  newsContainer.innerHTML += articles.map(cardHTML).join("");
};

const cardHTML = (article) => `
  <div class="news-card">
    <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" alt="News Image" />
    <div class="news-content">
      <h3>${article.title || "Untitled"}</h3>
      <p>${article.description || "No description available."}</p>
      <div class="date">${new Date(article.publishedAt).toDateString()}</div>
    </div>
  </div>
`;

// Event Listeners
searchBtn.addEventListener("click", () => {
  currentQuery = searchInput.value.trim();
  currentPage = 1;
  isSearch = true;
  fetchNews();
});

searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    isSearch = true;
    fetchNews();
  }
});

[category, region, language].forEach(el => {
  el.addEventListener("change", () => {
    currentPage = 1;
    currentQuery = "";
    isSearch = false;
    fetchNews();
  });
});

loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  fetchNews(true);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

fetchNews(); // Initial load
