import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const input = form.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let page = 1;
let totalHits = 0;
let shown = 0;

if (form) {
  form.addEventListener('submit', onSearch);
}
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', onLoadMore);
  hideLoadMoreButton();
}

async function onSearch(e) {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  page = 1;
  totalHits = 0;
  shown = 0;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, page);
    totalHits = data.totalHits || 0;

    if (!Array.isArray(data.hits) || data.hits.length === 0) {
      iziToast.error({
        title: 'Sorry',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);
    shown += data.hits.length;

    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${totalHits} images.`,
      position: 'topRight',
    });

    if (shown < totalHits && data.hits.length === PER_PAGE) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      if (shown >= totalHits) {
        iziToast.info({
          title: 'Info',
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: error.message || 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  if (!currentQuery) return;

  page += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, page);

    if (!Array.isArray(data.hits) || data.hits.length === 0) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);
    shown += data.hits.length;

    const firstCard = document.querySelector('.gallery .gallery-item');
    if (firstCard) {
      const { height } = firstCard.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
      });
    }

    const currentTotalShown = shown;
    const apiTotal = data.totalHits ?? totalHits;
    if (currentTotalShown >= apiTotal) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      if (data.hits.length < PER_PAGE) {
        hideLoadMoreButton();
      } else {
        showLoadMoreButton();
      }
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: error.message || 'Something went wrong while loading more.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}
