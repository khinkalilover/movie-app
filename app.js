const API_KEY = '4d0617bf-068e-479c-bc6f-18f77c6db773';
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

getMovies(API_URL_POPULAR);

async function getMovies(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        showMovies(data);

    } catch(error) {
        new Error(error);
    }
}

async function getDescriptionMovie(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        showDescriptionModal(data.films[0]);
        
    } catch(error) {
        throw error;
    }
}

function showMovies(data) {
    const moviesEl =  document.querySelector('.movies');
    document.querySelector(".movies").innerHTML = '';

    data.films.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movies');

        movieEl.innerHTML = `
            <div class="movies-card" data-name="${movie.nameRu}">
                <div class="card-header">
                    <img class="card-header__img" src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
                </div>

                <div class="card-info">
                    <div class="card-info__title">
                        ${movie.nameRu}
                        <span class="card-info__title__year">(${movie.year}г)</span>
                    </div>

                    <div class="card-info__category">${movie.genres[0].genre}</div>

                    <div class="card-info__avarage ${ 
                        movie.rating < 4 ? 'card-info__average__circle__red' :
                        movie.rating < 6 ? 'card-info__average__circle__orange' :
                        movie.rating > 6 ? 'card-info__average__circle__green' :
                        'card-info__average__circle__hide'    
                    }">
                        ${movie.rating}
                    </div>
                </div>
            </div>
        `;

        moviesEl.appendChild(movieEl);
    });
}

function showDescriptionModal(movie) {
    const body = document.querySelector('body');
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.overlay');
    
    overlay.style.display = 'block';   
    body.style.overflow = 'hidden';

    const modalHTML = `
        <div class="modal-wrapper">
            <div class="modal-content">
                <div class="modal-content__title">${movie.nameRu} <span>(${movie.year}г)</span></div>
                
                <img class="modal-content__img" src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
                
                <div class="modal-content__average">
                    ${movie.genres.map(genre => ` ${genre.genre}`)}
                </div>

                <div class="modal-content__description">
                    ${movie.description}
                </div>

                <button class="modal-btn" data-close="true">Закрыть</button>
            </div>
        <div>
    `;

    modal.innerHTML = modalHTML;

    body.appendChild(modal);
        
    window.addEventListener('click', closeDescriptionModal);

    function closeDescriptionModal(event) {
        if (event.target.dataset.close) {
            modal.innerHTML = '';
            overlay.style.display = 'none';
            body.style.overflow = 'auto';
        }
    }

    if (!document.querySelector('.modal')) {
        removeEventListener('click', closeDescriptionModal);
    }
}

window.addEventListener('click', getNameMovie);

function getNameMovie(event) {
    const cardMovie = event.target.closest('.movies-card');

    if (cardMovie) {
        const nameMovie = cardMovie.dataset.name;
        const apiSearchUrl = `${API_URL_SEARCH}${nameMovie}`;
        getDescriptionMovie(apiSearchUrl);
    }
}

const form = document.querySelector('form');
const search = document.querySelector('.header-search');

form.addEventListener('submit', event => {
    event.preventDefault();
    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    
    if (search.value) {
        getMovies(apiSearchUrl);
        search.value = '';
    }
});