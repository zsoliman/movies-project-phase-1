const API_KEY = "b2f757bb5ced3f141bd05de9a71b3ca8";
const BASE_URL = "https://api.themoviedb.org/3";
const baseImageUrl = "https://image.tmdb.org/t/p/w500";
const movieContainer = document.getElementById("container");
const searchInput = document.getElementById("search-bar");
const nextPageBtn = document.getElementById("next-page");
const prevPageBtn = document.getElementById("prev-page");
const movieModal = document.getElementById("modal");
const backdrop = document.querySelector("#backdrop");
const sidebar = document.querySelector(".sidebar");
const toggleSidebarBtn = document.querySelector("#toggle-sidebar");
const movieList = document.querySelector("#my-list");
const addToListBtn = document.querySelector("#add-to-list");
const genreDropdown = document.querySelector("#genre-dropdown");
const pageNum = document.querySelector("#page-num");
const totalPages = document.querySelector("#total-pages");
let global = {
  pageNum: 1,
  queryString: "",
  totalPages: 0,
  curMovie: {},
};

// PAGE BUTTON FUNCTIONALITY
const disableButton = (btn) => {
  btn.disabled = true;
};
const enableButton = (btn) => {
  btn.disabled = false;
};

// FETCH REQUEST UTITLITY FUNCTIONS

const getMovie = async (movieId) => {
  // Returns a movie with id of movieId
  const req = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const res = await req.json();
  return res;
};

const searchMovies = async (queryString, pageNum) => {
  // searches movies using queryString and gets page number pageNum
  const req = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURI(
      queryString
    )}&page=${pageNum}`
  );
  const res = await req.json();
  return res;
};

const getGenres = async () => {
  // Return list of genres
  const req = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
  );
  const res = await req.json();
  return res;
};

// RENDER MOVIES TO PAGE
// renderMovie renders a single movie card
// renderMovies iterates over array of movies and calls renderMovie
// renderPage call searchMovie to fetch array of movies by page number and calls renderMovies with the movie array
const renderMovie = (movie) => {
  // creates movie card and appends elements to the DOM
  const movieCard = document.createElement("div");
  movieCard.className = "movie-card";
  movieCard.id = movie.id;
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
      "https://m.media-amazon.com/images/I/412Esd7yEhL._AC_SX466_.jpg";
    img.src = placeholderImg;
  }
  movieCard.append(img, title);

  const openMovieModal = (e) => {
    global.curMovie = movie;
    console.log(global.curMovie);
    movieModal.style.display = "block";
    const modalImg = document.getElementById("backdrop-image");
    modalImg.src = `${baseImageUrl}${global.curMovie.backdrop_path}`;
    const movieTitle = document.querySelector("#title");
    movieTitle.textContent = global.curMovie.title;
    const overview = document.getElementById("overview");
    overview.textContent = global.curMovie.overview;
    backdrop.classList.add("blur");
  };
  movieCard.addEventListener("click", openMovieModal);
  movieContainer.append(movieCard);
};

const renderMovies = (movies) => {
  // call renderMovie for each movie in movies array and sends an error msg if no movies are returned by search
  if (movies.length) {
    movieContainer.innerHTML = "";
    movies.forEach(renderMovie);
  } else {
    movieContainer.innerHTML = `<h4>"${global.queryString}" -  No movies by that name</h4>`;
  }
};

const renderPage = async (queryString, pageNum) => {
  // Gets list of movies from searchMovies and renders that result
  const res = await searchMovies(queryString, pageNum);
  global.totalPages = res.total_pages;
  renderMovies(res.results);
};

const renderGenreDropdown = async () => {
  // Get list of genres and render them to dropdown
  const res = await getGenres();
  res.genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.name.toLowerCase();
    option.text = genre.name;
    console.log(genre.name);
    genreDropdown.append(option);
  });
};

const searchHandler = async (e) => {
  // Takes input from user and renders first page by calling renderPage. Also handles next and prev page buttons
  if (e.target.value) {
    global.queryString = e.target.value;
    global.pageNum = 1;
    pageNum.textContent = global.pageNum;

    await renderPage(global.queryString, 1);
    totalPages.textContent = global.totalPages;
    disableButton(prevPageBtn);
    if (global.totalPages > 1) {
      enableButton(nextPageBtn);
    } else {
      disableButton(nextPageBtn);
    }

    //   renderMovies(res.results);
  } else {
    pageNum.textContent = "0";
    totalPages.textContent = "0";
    nextPageBtn.disabled = true;
    movieContainer.innerHTML = "";
  }
};

const nextPageHandler = async () => {
  // define how the next page button works

  await renderPage(global.queryString, ++global.pageNum);
  if (global.pageNum === global.totalPages) {
    // When you are on the last page, disable next button
    disableButton(nextPageBtn);
  } else if (global.pageNum === 2) {
    // When you are on any page greater than the first page, enable prev button
    enableButton(prevPageBtn);
  }
  pageNum.textContent = global.pageNum;
};

const prevPageHandler = async () => {
  await renderPage(global.queryString, --global.pageNum);

  // define how the prev page buttpm works
  if (global.pageNum === global.totalPages - 1) {
    disableButton(nextPageBtn);
  } else if (global.pageNum === 1) {
    disableButton(prevPageBtn);
  }
  pageNum.textContent = global.pageNum;
};

const toggleSidebar = () => {
  if (sidebar.style.display === "block") {
    sidebar.style.display = "none";
    toggleSidebarBtn.innerHTML = "<span>&#171</span>";
    toggleSidebarBtn.style.right = "45px";
  } else {
    sidebar.style.display = "block";
    toggleSidebarBtn.innerHTML = "<span>&#187;</span>";
    toggleSidebarBtn.style.right = "250px";
  }
};

// FETCH REQUESTS FOR ADDING/GETTING USER LIST
const postMovieToList = async (movie) => {
  const req = await fetch("http://localhost:3000/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(movie),
  });
  const res = await req.json();
  return res;
};
const getMovieListFromServer = async () => {
  const req = await fetch("http://localhost:3000/list");
  const res = await req.json();
  return res;
};
const deleteMovieFromList = async (movieId) => {
  const req = await fetch(`http://localhost:3000/list/${movieId}`, {
    method: "DELETE",
  });
  const res = await req.json();
  return res;
};
const deleteMovieHandler = async (e) => {
  const res = await deleteMovieFromList(e.target.id);
  e.target.parentElement.remove();
};

// DISPLAY MOVIE TO LIST
const renderMovieToList = (movie) => {
  const div = document.createElement("div");
  div.className = "list-movie-card";
  div.id = `movie-${movie.id}`;
  const img = document.createElement("img");
  img.src = `${baseImageUrl}${movie.poster_path}`;
  const h3 = document.createElement("h3");
  h3.textContent = movie.title;
  const btn = document.createElement("button");
  btn.textContent = "DELETE";
  btn.id = movie.id;
  btn.className = "delete-movie-from-list";
  btn.addEventListener("click", deleteMovieHandler);
  div.append(img, h3, btn);
  movieList.append(div);
};

// DISPLAY ENTIRE LIST TO SIDEBAR
const renderMoviesToList = async () => {
  const myList = await getMovieListFromServer();
  myList.forEach(renderMovieToList);
};

const addCurMovieToList = async () => {
  console.log(global.curMovie);
  const res = await postMovieToList(global.curMovie);
  renderMovieToList(res);
};

const loadPage = () => {
  nextPageBtn.addEventListener("click", nextPageHandler);
  prevPageBtn.addEventListener("click", prevPageHandler);
  searchInput.addEventListener("input", searchHandler);
  toggleSidebarBtn.addEventListener("click", toggleSidebar);
  addToListBtn.addEventListener("click", addCurMovieToList);
  renderMoviesToList();
  renderGenreDropdown();
};
loadPage();
