import axios from 'axios';

export const PER_PAGE = 15;
const API_KEY = '52399485-abaa9cbef55c5a94206dd148e';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  const q = String(query).trim();
  if (!q) {
    throw new Error('Empty query');
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: PER_PAGE,
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
