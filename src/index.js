const API_KEY = "b2f757bb5ced3f141bd05de9a71b3ca8";
const BASE_URL = "https://api.themoviedb.org/3";
const baseImageUrl = "https://image.tmdb.org/t/p/w500";
const movieContainer = document.getElementById("container");
const searchInput = document.getElementById("search-bar");
const fetchMovie = async (movieId) => {
  const req = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const res = await req.json();
  return res;
};
const searchMovie = async (queryString, pageNum) => {
  const req = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURI(
      queryString
    )}&page=${pageNum}`
  );
  const res = await req.json();
  console.log(res);
  return res;
};

const searchAllMoviePages = async (queryString) => {
  let res = await searchMovie(queryString, 1);
  renderMovies(res.results);
  for (let pageNum = 1; pageNum <= res.total_pages; pageNum++) {
    res = await searchMovie(queryString, pageNum);
    renderMovies(res.results);
  }
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
  if (movie.poster_path) {
    img.src = `${baseImageUrl}${movie.poster_path}`;
  } else {
    const placeholderImg =
      "https://cdn.shopify.com/s/files/1/0079/3287/0756/articles/sad-dog-spot-the-signs-and-cheer-them-up_1200x1200.jpg?v=1620757126";
    img.src = placeholderImg;
  }
  movieCard.append(img, title);

  movieContainer.append(movieCard);
};

const renderMovies = (movies) => {
  console.log(movies.length);
  if (movies.length) {
    movieContainer.innerHTML = "";
    movies.forEach((movie) => {
      renderMovie(movie);
    });
  } else {
    alert("No movies by that name");
  }
};
let prevTimeout;
const searchHandler = async (e) => {
  if (e.target.value) {
    if (prevTimeout) {
      clearTimeout(prevTimeout);
    }

    prevTimeout = setTimeout(async () => {
      await searchAllMoviePages(e.target.value);
      //   renderMovies(res.results);
    }, 2000);
  }
};

searchInput.addEventListener("input", searchHandler);
