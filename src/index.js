import './css/styles.css';
import Notiflix from 'notiflix';
import PicturesApi from './js/templates/fetch-image';
import galleryCard from './js/templates/gallery-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './js/load-more-btn';

const searchForm = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'title',
  captionDelay: 250,
});

searchForm.addEventListener('submit', onSubmitClick);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtnClick);

async function onSubmitClick(e) {
  e.preventDefault();

  const value = searchForm.elements.searchQuery.value.trim();
  if (!value) {
    noFound();
    return;
  }

  PicturesApi.resetPage();

  try {
    const data = await PicturesApi.fetchImg(value);

    if (!data.hits || data.hits.length === 0) {
      clearGallery();
      noFound();

      return;
    }

    Notiflix.Notify.success(`Hoorey! We found ${data.totalHits} images`);
    clearGallery();
    renderGallery(data.hits);
    smoothScrolling();

    if (PicturesApi.checkLastPage()) {
      loadMoreBtn.hide();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.show();
    }

    lightbox.refresh();
  } catch (error) {
    onCatchError();
  }
}

async function onLoadMoreBtnClick() {
  if (!PicturesApi.canLoadMoreImages()) {
    loadMoreBtn.hide();
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  try {
    const value = searchForm.elements.searchQuery.value.trim();
    const data = await PicturesApi.fetchImg(value);

    renderGallery(data.hits);
    smoothScrolling();
    lightbox.refresh();
  } catch (error) {
    onCatchError();
  }
}

function renderGallery(hits) {
  galleryEl.insertAdjacentHTML('beforeend', galleryCard(hits));
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function onCatchError(error) {
  clearGallery();
  console.log(error);
  Notiflix.Notify.failure('Oops');
}

function noFound() {
  Notiflix.Notify.warning(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  return;
}

function smoothScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
