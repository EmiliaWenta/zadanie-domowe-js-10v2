import axios from 'axios';
import SlimSelect from 'slim-select';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.headers.common['x-api-key'] =
  'live_6vq2cHckN7t0yswMZu1qyW9y0BV9do0EvxE47gmr6QMgE9pF9eZl5VjQ2qXeVEJM';

const breedSelect = document.querySelector('.breed-select');

const loader = document.querySelector('.loader');
loader.style.display = 'none';
const catInfo = document.querySelector('.cat-info');
const URLColecctions = 'https://api.thecatapi.com/v1/breeds';
const URLFindCat = 'https://api.thecatapi.com/v1/images/search';
const options = {};

const createElement = ({ type = 'option', attributes = '', text = '' }) => {
  //can write more elements
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

function fetchBreeds() {
  breedSelect.style.display = 'none';
  loader.style.display = 'inline-block';
  fetch(URLColecctions, options)
    .then(response => {
      return response.json();
    })
    .then(datas => {
      breedSelect.append(...datas.map(createCatListElement));
      loader.style.display = 'none';
      breedSelect.style.display = 'flex';
      breedSelect.style.width = '250px';
      new SlimSelect({
        select: breedSelect,
      });
    })
    .catch(e => {
      console.log(e);
      loader.style.display = 'none';
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
    });
}

function fetchCatByBreed(event) {
  const breedId = event.currentTarget.value;
  const searchParams = new URLSearchParams({ breed_ids: breedId });
  const URL = `${URLFindCat}?${searchParams.toString()}`;
  fetch(URL)
    .then(response => {
      loader.style.display = 'inline-block';
      return response.json();
    })
    .then(data => {
      catInfo.innerHTML = '';
      const catImgUrl = data[0].url;
      createImage(catImgUrl);
      const catID = data[0].id;
      const findCatUrl = `https://api.thecatapi.com/v1/images/${catID}`;
      return findCatUrl;
    })
    .then(findCatUrl => {
      fetch(findCatUrl)
        .then(response => {
          return response.json();
        })
        .then(catInfo => {
          const catAllInformation = catInfo.breeds[0];
          return catAllInformation;
        })
        .then(catAllInformation => {
          const catInfoCover = document.createElement('div');
          catInfoCover.classList.add('cat-description');
          catInfo.append(catInfoCover);
          catInfoCover.append(...createCatInformation(catAllInformation));
          loader.style.display = 'none';
        })
        .catch(e => {
          catInfo.style.display = 'none';
          loader.style.display = 'none';
          Notify.failure('Oops! Something went wrong! Try reloading the page!');
          console.log(e);
        });
    })
    .catch(e => {
      catInfo.style.display = 'none';
      loader.style.display = 'none';
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
      console.log(e);
    });
}

fetchBreeds();
breedSelect.addEventListener('change', fetchCatByBreed);
