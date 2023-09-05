import axios from 'axios';
import SlimSelect from 'slim-select';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.headers.common['x-api-key'] =
  'live_6vq2cHckN7t0yswMZu1qyW9y0BV9do0EvxE47gmr6QMgE9pF9eZl5VjQ2qXeVEJM';

const breedSelect = document.querySelector('.breed-select');

const loader = document.querySelector('.loader');

const catInfo = document.querySelector('.cat-info');
const URLColecctions = 'https://api.thecatapi.com/v1/breeds';
const URLFindCat = 'https://api.thecatapi.com/v1/images/search';
const options = {};

function showLoader() {
  loader.classList.add('visible');
}

function hideLoader() {
  loader.classList.remove('visible');
}

const createElement = ({ type = 'option', attributes = '', text = '' }) => {
  const el = document.createElement(type);
  if (text) {
    el.textContent = text;
  }
  if (attributes) {
    el.setAttribute('value', attributes);
  }
  return el;
};

const createCatInformation = catAllInformation => {
  const catDescriptionElements = [
    createElement({ type: 'h1', text: `${catAllInformation.name}` }),
    createElement({ type: 'div', text: `${catAllInformation.description}` }),
    createElement({
      type: 'h2',
      text: 'Temperament:',
    }),
    createElement({
      type: 'div',
      text: `${catAllInformation.temperament}`,
    }),
  ];
  return catDescriptionElements;
};

const createImage = catImgUrl => {
  const imageCover = document.createElement('div');
  const imageofCat = document.createElement('img');
  imageofCat.setAttribute('src', `${catImgUrl}`);
  imageofCat.classList.add('image');
  catInfo.append(imageCover);
  imageCover.append(imageofCat);
};

const createCatListElement = data => {
  const catElements = createElement({
    type: 'option',
    attributes: data.id,
    text: data.name,
  });
  return catElements;
};

function fetchBreeds(url, options) {
  return axios
    .get(url, options)
    .then(response => {
      return response.data;
    })
    .catch(e => {
      hideLoader();
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
    });
}

function fetchAndCreateCatList(URLColecctions) {
  breedSelect.style.display = 'none';
  showLoader();
  fetchBreeds(URLColecctions, options).then(response => {
    breedSelect.append(...response.map(createCatListElement));
    hideLoader();
    breedSelect.style.display = 'flex';
    breedSelect.style.width = '250px';
    new SlimSelect({
      select: breedSelect,
    });
  });
}

fetchAndCreateCatList(URLColecctions);

function fetchCatByBreed(event) {
  const breedId = event.currentTarget.value;
  const searchParams = new URLSearchParams({ breed_ids: breedId });
  const URL = `${URLFindCat}?${searchParams.toString()}`;
  showLoader();
  fetchBreeds(URL)
    .then(response => {
      catInfo.innerHTML = '';
      const catImgUrl = response[0].url;
      createImage(catImgUrl);
      const catID = response[0].id;
      const findCatUrl = `https://api.thecatapi.com/v1/images/${catID}`;

      return findCatUrl;
    })
    .then(findCatUrl => {
      fetchBreeds(findCatUrl)
        .then(catInfo => {
          const catAllInformation = catInfo.breeds[0];
          return catAllInformation;
        })
        .then(catAllInformation => {
          const catInfoCover = document.createElement('div');
          catInfoCover.classList.add('cat-description');
          catInfo.append(catInfoCover);
          catInfoCover.append(...createCatInformation(catAllInformation));
        });
    });
}

breedSelect.addEventListener('change', fetchCatByBreed);
