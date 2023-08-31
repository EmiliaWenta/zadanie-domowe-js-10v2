import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_6vq2cHckN7t0yswMZu1qyW9y0BV9do0EvxE47gmr6QMgE9pF9eZl5VjQ2qXeVEJM';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');
const URLColecctions = 'https://api.thecatapi.com/v1/breeds';

const URLFindCat = 'https://api.thecatapi.com/v1/images/search';
const options = {};

const createElement = ({ type = 'option', attributes = '', text = '' }) => {
  //can write more elements
  const el = document.createElement(type);
  el.textContent = text;
  el.setAttribute('value', attributes);
  return el;
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
  fetch(URLColecctions, options)
    .then(response => {
      return response.json();
    })
    .then(datas => {
      console.log(datas);

      breedSelect.append(...datas.map(createCatListElement));
    })
    .catch(e => {
      console.log(e);
    });
}

function fetchCatByBreed(event) {
  const breedId = event.currentTarget.value;
  console.log(breedId);
  const searchParams = new URLSearchParams({ breed_ids: breedId });
  const URL = `${URLFindCat}?${searchParams.toString()}`;
  fetch(URL, options)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(e => {
      console.log(e);
    });
}

fetchBreeds();
breedSelect.addEventListener('change', fetchCatByBreed);

// Gdy użytkownik wybierze opcję w select, należy wykonać żądanie o pełnych informacjach o kocie do zasobu https://api.thecatapi.com/v1/images/search. Nie zapomnij podać w tym żądaniu parametru ciągu zapytania 'breed_ids' z identyfikatorem rasy.

// https://api.thecatapi.com/v1/images/search?breed_ids=identyfikator_rasy

// Napisz funkcję fetchCatByBreed(breedId), która oczekuje identyfikatora rasy, wykonuje żądanie HTTP i zwraca obietnicę z danymi o kocie - wynikiem żądania. Umieść ją w pliku cat-api.js i dokonaj nazwanego eksportu.

// Jeśli żądanie zostanie pomyślnie wykonane, pod listą rozwijaną (select), w bloku div.cat-info pojawi się obraz oraz szczegółowe informacje o kocie: nazwa rasy, opis i temperament.
