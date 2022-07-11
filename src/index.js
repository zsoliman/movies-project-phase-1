const API_KEY = "b2f757bb5ced3f141bd05de9a71b3ca8";
const BASE_URL = "https://api.themoviedb.org/3";
const baseImageUrl = "https://image.tmdb.org/t/p/w500";
const movieContainer = document.getElementById("container");

const fetchMovie = async (movieId) => {
  console.log(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const req = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const res = await req.json();
  console.log(res);
  return res;
};
const searchMovie = async (queryString) => {
  const req = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURI(
      queryString
    )}`
  );
  const res = await req.json();
  return res;
};
const renderMovie = (movie) => {
  const movieCard = document.createElement("div");
  movieCard.className = "movie-card";
  const title = document.createElement("h3");
  title.id = "movie-title";
  title.textContent = movie.title;
  const overview = document.createElement("p");
  overview.id = "movie-overview";
  overview.textContent = movie.overview;
  const img = document.createElement("img");
  img.id = "movie-poster";
  img.src = `${baseImageUrl}${movie.poster_path}`;

  movieCard.append(img, title);
  movieContainer.append(movieCard);
};

const renderMovies = (movies) => {
  movies.forEach((movie) => {
    renderMovie(movie);
  });
};
const loadPage = async () => {
  const res = await searchMovie("Spider");
  renderMovies(res.results);
};

loadPage();
