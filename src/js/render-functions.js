import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  if (!Array.isArray(images) || images.length === 0) return;

  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="gallery-item" style="height: 200px;">
        <a href="${largeImageURL}">
          <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <ul class="stat-list">
          <li class="stat-item"><span class="stat-title">Likes</span>${likes}</li>
          <li class="stat-item"><span class="stat-title">Views</span>${views}</li>
          <li class="stat-item"><span class="stat-title">Comments</span>${comments}</li>
          <li class="stat-item"><span class="stat-title">Downloads</span>${downloads}</li>
        </ul>
      </li>
    `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  if (!loader) return;
  loader.classList.remove('hidden');
}

export function hideLoader() {
  if (!loader) return;
  loader.classList.add('hidden');
}

export function showLoadMoreButton() {
  if (!loadMoreBtn) return;
  loadMoreBtn.classList.remove('hidden');
}

export function hideLoadMoreButton() {
  if (!loadMoreBtn) return;
  loadMoreBtn.classList.add('hidden');
}
