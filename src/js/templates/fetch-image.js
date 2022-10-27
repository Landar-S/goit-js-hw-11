import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30780605-b5e302c81772e5ecbeaa52249';

let amountPage = 1;
let amountOfPages = null;

async function fetchImg(value) {
  const params = {
    key: KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  };
  try {
    const response = await axios.get(
      `${BASE_URL}?q=${value}&page=${amountPage}`,
      {
        params,
      }
    );
    amountOfPages = Math.ceil(response.data.totalHits / 40);
    incrementPage();
    return response.data;
  } catch (error) {
    console.error(error);
    console.log(error.response.status);
  }
}

function incrementPage() {
  amountPage += 1;
}

function resetPage() {
  amountPage = 1;
}

function canLoadMoreImages() {
  return amountPage < amountOfPages ? true : false;
}

function checkLastPage() {
  if (amountOfPages > 0 && amountOfPages <= 1) {
    return true;
  } else false;
}

export default {
  fetchImg,
  resetPage,
  canLoadMoreImages,
  checkLastPage,
};
