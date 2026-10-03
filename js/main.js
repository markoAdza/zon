(function () {
  "use strict";

  var articles = window.ZON_ARTICLES || [];

  var LOREM = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus, posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.",
    "Vestibulum id ligula porta felis euismod semper. Cras mattis consectetur purus sit amet fermentum. Maecenas faucibus mollis interdum. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean lacinia bibendum nulla sed consectetur.",
    "Curabitur blandit tempus porttitor. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.",
    "Sed posuere consectetur est at lobortis. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.",
    "Nulla vitae elit libero, a pharetra augue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Integer posuere erat a ante venenatis dapibus.",
    "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit sit amet non magna."
  ];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // The slug goes in the hash, not the query: browsers keep the hash across
  // redirects (e.g. serve's clanek.html -> /clanek), which drop ?id=.
  function articleUrl(a) {
    return "clanek.html#" + encodeURIComponent(a.slug);
  }

  function tagsHtml(tags) {
    return '<div class="tags">' + tags.map(function (t) {
      return '<span class="tag">' + esc(t) + "</span>";
    }).join("") + "</div>";
  }

  function metaHtml(a) {
    return '<div class="meta"><span class="author">| ' + esc(a.author) + '</span>' +
      '<span class="sep" aria-hidden="true"></span><time>' + esc(a.date) + "</time></div>";
  }

  function cardHtml(a, featured) {
    return '<a class="card' + (featured ? " card--featured" : "") + '" href="' + articleUrl(a) + '">' +
      '<img src="' + esc(a.image) + '" alt="" loading="' + (featured ? "eager" : "lazy") + '">' +
      '<div class="card-body">' + tagsHtml(a.tags) +
      '<h2 class="card-title">' + esc(a.title) + "</h2>" + metaHtml(a) +
      "</div></a>";
  }

  // ---------- Homepage ----------

  var heroGrid = document.getElementById("hero-grid");
  if (heroGrid) {
    var featured = articles.filter(function (a) { return a.featured; })[0] || articles[0];
    var rest = articles.filter(function (a) { return a !== featured; }).slice(0, 4);
    heroGrid.innerHTML = cardHtml(featured, true) + rest.map(function (a) { return cardHtml(a, false); }).join("");
  }

  // ---------- Article page ----------

  var articleEl = document.getElementById("article");

  // clanek.html#slug; clanek.html?id=slug still works for old links.
  function currentArticleId() {
    return decodeURIComponent(window.location.hash.slice(1)) ||
      new URLSearchParams(window.location.search).get("id");
  }

  // A paragraph is a string, or { text, highlight: true } to show it in red.
  function paragraphHtml(p, i) {
    var classes = [];
    if (i === 0) classes.push("lead");
    if (p.highlight) classes.push("highlight");
    var text = typeof p === "string" ? p : p.text;
    return "<p" + (classes.length ? ' class="' + classes.join(" ") + '"' : "") + ">" + esc(text) + "</p>";
  }

  function renderArticle() {
    var id = currentArticleId();
    var article = articles.filter(function (a) { return a.slug === id; })[0];

    if (!article) {
      window.location.replace("index.html");
      return;
    }

    document.title = article.title + " – ZON.si (demo)";

    articleEl.innerHTML =
      tagsHtml(article.tags) +
      "<h1>" + esc(article.title) + "</h1>" +
      metaHtml(article) +
      '<figure><img src="' + esc(article.image) + '" alt="">' +
      "<figcaption>Foto: " + esc(article.credit) + "</figcaption></figure>" +
      '<div class="article-body">' +
      (article.body || LOREM).map(paragraphHtml).join("") +
      "</div>";

    document.getElementById("related-grid").innerHTML = articles
      .filter(function (a) { return a !== article; })
      .slice(0, 4)
      .map(function (a) { return cardHtml(a, false); })
      .join("");
  }

  if (articleEl) {
    renderArticle();
    // "Preberite še" links only change the hash, so the page does not reload.
    window.addEventListener("hashchange", function () {
      renderArticle();
      window.scrollTo(0, 0);
    });
  }

  // ---------- Navigation ----------

  var nav = document.querySelector(".main-nav");
  var navToggle = document.querySelector(".nav-toggle");
  var mobile = window.matchMedia("(max-width: 960px)");

  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("menu-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".has-sub > a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (!mobile.matches) return;
      e.preventDefault();
      link.parentElement.classList.toggle("open");
    });
  });

  // ---------- Search ----------

  var search = document.querySelector(".nav-search");
  var searchInput = search.querySelector("input");

  search.querySelector(".search-toggle").addEventListener("click", function () {
    if (search.classList.toggle("open")) searchInput.focus();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") search.classList.remove("open");
  });

  // ---------- Favourite star ----------

  var star = document.querySelector(".star-btn");

  function starKey() {
    return "zon-demo-star:" + window.location.pathname + window.location.search + window.location.hash;
  }

  function setStar(on) {
    star.setAttribute("aria-pressed", String(on));
  }

  function loadStar() {
    try { setStar(localStorage.getItem(starKey()) === "1"); } catch (e) { /* storage unavailable */ }
  }

  loadStar();
  window.addEventListener("hashchange", loadStar);

  star.addEventListener("click", function () {
    var on = star.getAttribute("aria-pressed") !== "true";
    setStar(on);
    try { localStorage.setItem(starKey(), on ? "1" : "0"); } catch (e) { /* storage unavailable */ }
  });
})();
