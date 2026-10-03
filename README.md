# ZON.si – demo

A static demo of the ZON.si homepage: header with the "Lokalne volitve 2026" banner, the category menu, and a grid of 5 featured stories, plus a simple article page for each story.

**This is a demo, not the official ZON.si site.** It is marked with a DEMO label and `noindex`. The authors are made up and the article text is placeholder (lorem ipsum).

## Structure

```
index.html       homepage
clanek.html      article page (clanek.html?id=<slug>)
css/style.css    all styles
js/articles.js   story data: title, tags, author, date, photo
js/main.js       builds the cards and article page; menu, search, star
img/             logo, banner graphic, photos
```

To change headlines, authors or photos, edit `js/articles.js` only.

## Run locally

```
npx serve .
```

## Deploy (Vercel)

Import the repository at vercel.com → Framework preset **Other**, no build command, output directory = root.

## Photos (Unsplash license)

- `img/sezona.jpg`: MChe Lee, https://unsplash.com/photos/dhE0uxP7CR0
- `img/avtomobil.jpg`: Linus Belanger, https://unsplash.com/photos/aPVB9NVc2aI
- `img/postelja.jpg`: Francesca Tosolini, https://unsplash.com/photos/HD7QBx2Yfa4
- `img/cop.jpg`: Pylyp Sukhenko, https://unsplash.com/photos/y-XZf_TNRms
- `img/litija.jpg`: Max Böhme, https://unsplash.com/photos/zGHmwqp6bG0
