const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNGQxMmI1MjE4N2ExNDhjNGZlZTM2N2IzNzEwODA2ZSIsIm5iZiI6MTcyNjc0OTA3NC42NzM0MzEsInN1YiI6IjY2ZTg3MjhlOWRmYmJkZjBlNmQwMjQ4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xWu6ZhhaaZYapq3ticEvp0cUpkSJrts9SYRTwB_mSCI";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
};

let currentTab = null;

function fetchMovies(query) {
  if (query === currentTab) return; // Don't refetch if it's the same tab

  fetch(`https://api.themoviedb.org/3/movie/${query}?language=en-US&page=1`, options)
    .then((response) => response.json())
    .then((data) => {
      showMovies(data, query);
      console.log(data);
      currentTab = query; // Update the current tab
    })
    .catch((error) => {
      document.querySelector("body").innerHTML = `
        <section>
          <article>
            <h2>Error</h2>
            <p>${error}</p>
          </article>
        </section>
      `;
    });
}

const headlines = [
  { id: "now-playing", title: "Now Playing", query: "now_playing" },
  { id: "popular", title: "Popular", query: "popular" },
  { id: "top-rated", title: "Top Rated", query: "top_rated" },
  { id: "upcoming", title: "Upcoming", query: "upcoming" },
];

const tabButtonGroup = document.querySelector("div[role=tablist]");

function showMovies(data) {
  const tabPanel = document.querySelector("div[role=tabpanel]");
  tabPanel.innerHTML = ""; // Clear previous content
  data.results.forEach((movie) => {
    tabPanel.innerHTML += `
    <article>
        <h2>${movie.title}</h2>
        <img src="https://image.tmdb.org/t/p/w200/${movie.poster_path}.jpg" />
        <div>
            <p>${movie.overview}</p>
            <p><span>Original title:</span> ${movie.original_title}</p>
            <p><span>Release date:</span> ${movie.release_date}</p>
        </div>
      </article>
    `;
  });
}

headlines.forEach(function (headline, index) {
  const tabButton = document.createElement("button");
  tabButton.innerText = headline.title;
  tabButton.id = `${headline.id}-tab`;
  tabButton.setAttribute("aria-selected", "false");

  tabButton.setAttribute("role", "tab");
  tabButton.setAttribute("aria-controls", headline.id);

  tabButtonGroup.append(tabButton);

  // Set the first button as selected
  if (index === 0) {
    tabButton.setAttribute("aria-selected", "true");
    tabButton.style.textDecoration = "underline";
    tabButton.style.color = "#F7F8D1";
  }

  tabButton.addEventListener("click", function () {
    if (headline.query !== currentTab) {
      // Deselect all buttons and remove underline
      tabButtonGroup.querySelectorAll("button").forEach((btn) => {
        btn.setAttribute("aria-selected", "false");
        btn.style.textDecoration = "none";
        btn.style.color = "white";
      });

      // Select the clicked button and add underline
      tabButton.setAttribute("aria-selected", "true");
      tabButton.style.textDecoration = "underline";
      tabButton.style.color = "#F7F8D1";

      // Fetch movies for the selected category
      fetchMovies(headline.query);
    }
  });
});

// Initially load "Now Playing" movies
fetchMovies(headlines[0].query);
