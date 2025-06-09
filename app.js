const apiKey = "4edeb511";

function filmOneriGetir(kelime) {
  if (kelime.length < 3) {
    document.getElementById("filmOnerileri").innerHTML = "";
    return;
  }
  fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(kelime)}&apikey=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("filmOnerileri");
      container.innerHTML = "";
      if (data.Response === "True") {
        const promises = data.Search.slice(0, 3).map(film =>
          fetch(`https://www.omdbapi.com/?i=${film.imdbID}&apikey=${apiKey}`)
            .then(res => res.json())
        );
        Promise.all(promises).then(films => {
          films.forEach(film => {
            const item = document.createElement("div");
            item.className = "suggestion-item";
            item.innerHTML = `
              <img src="${film.Poster !== "N/A" ? film.Poster : "https://via.placeholder.com/100x150"}" alt="Poster">
              <div style="text-align:left">
                <strong>${film.Title}</strong><br>
                IMDb: ${film.imdbRating}<br>
                Genre: ${film.Genre.split(",")[0] || "Bilinmiyor"}
              </div>
            `;
            item.onclick = () => {
              document.getElementById("filmOnerileri").innerHTML = "";
              filmDetayGoster(film);
            };
            container.appendChild(item);
          });
        });
      }
    });
}

function filmDetayGoster(data) {
  const sonuc = document.getElementById("filmSonucu");
  sonuc.innerHTML = `
    <h3>${data.Title} (${data.Year})</h3>
    <p><strong>IMDb:</strong> ${data.imdbRating}</p>
    <p><strong>Genre:</strong> ${data.Genre}</p>
    <img src="${data.Poster}" alt="Film Posteri">
    <br><br>
    <button onclick='filmKaydet(${JSON.stringify(data).replace(/'/g, "&apos;")})'>Save</button>
  `;
}

function filmKaydet(data) {
  let filmler = JSON.parse(localStorage.getItem("kayitliFilmler")) || [];
  const mevcut = filmler.find(f => f.imdbID === data.imdbID);
  if (!mevcut) {
    filmler.push({
      title: data.Title,
      year: data.Year,
      genre: data.Genre,
      poster: data.Poster,
      imdbRating: data.imdbRating,
      imdbID: data.imdbID,
      watched: false
    });
    localStorage.setItem("kayitliFilmler", JSON.stringify(filmler));
    kayitliFilmleriGoster();
  }
}

function toggleWatched(imdbID) {
  let filmler = JSON.parse(localStorage.getItem("kayitliFilmler")) || [];
  const index = filmler.findIndex(f => f.imdbID === imdbID);
  if (index !== -1) {
    filmler[index].watched = !filmler[index].watched;
    localStorage.setItem("kayitliFilmler", JSON.stringify(filmler));
    kayitliFilmleriGoster();
  }
}

function filmSil(imdbID) {
  let filmler = JSON.parse(localStorage.getItem("kayitliFilmler")) || [];
  filmler = filmler.filter(f => f.imdbID !== imdbID);
  localStorage.setItem("kayitliFilmler", JSON.stringify(filmler));
  kayitliFilmleriGoster();
}

function kayitliFilmleriGoster() {
  const container = document.getElementById("kayitliFilmler");
  const filmler = JSON.parse(localStorage.getItem("kayitliFilmler")) || [];
  container.innerHTML = filmler.map(f => `
    <div class="saved-item">
      <img src="${f.poster}" alt="Poster">
      <div class="saved-details">
        <h4>${f.title} (${f.year})</h4>
        <p><strong>IMDb:</strong> ${f.imdbRating}</p>
        <p><strong>Genre:</strong> ${f.genre}</p>
        <button onclick="toggleWatched('${f.imdbID}')">
          ${f.watched ? '✅ Watched' : '❌ Unwatched'}
        </button>
        <button onclick="filmSil('${f.imdbID}')">🗑️ Delete</button>
      </div>
    </div>
  `).join("");
}

function onerilenFilmGoster() {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `dailyFilm-${today}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    document.getElementById("onerilenFilm").innerHTML = cached;
    return;
  }
  fetch(`https://www.omdbapi.com/?s=top&apikey=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True" && data.Search.length > 0) {
        const film = data.Search[0];
        fetch(`https://www.omdbapi.com/?i=${film.imdbID}&apikey=${apiKey}`)
          .then(res => res.json())
          .then(detail => {
            const content = `
              <div style="display:flex;align-items:center">
                <img src="${detail.Poster}" width="60" style="margin-right:10px;border-radius:6px">
                <div>
                  <strong>${detail.Title}</strong><br>
                  IMDb: ${detail.imdbRating}<br>
                  <button onclick='filmDetayGoster(${JSON.stringify(detail).replace(/'/g, "&apos;")})'>View</button>
                </div>
              </div>
            `;
            document.getElementById("onerilenFilm").innerHTML = content;
            localStorage.setItem(cacheKey, content);
          });
      }
    });
}

window.onload = () => {
  onerilenFilmGoster();
  kayitliFilmleriGoster();
};
