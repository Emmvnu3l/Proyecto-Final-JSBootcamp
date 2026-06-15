import { getNews, getCategories } from './api.js';
import { isLoggedIn } from './auth.js';

let allCategories = [];
let currentCategory = null;
let currentOrder = 'desc';

async function loadCategories() {
  try {
    allCategories = await getCategories();
    renderCategories();
  } catch (err) {
    console.error('Error al cargar categorías:', err);
  }
}

function renderCategories() {
  const list = document.getElementById('category-list');
  if (!list) return;

  list.innerHTML = `
    <li class="list-group-item ${currentCategory === null ? 'active' : ''}" data-id="">
      Todas
    </li>
  `;
  allCategories.forEach(cat => {
    const li = document.createElement('li');
    li.className = `list-group-item ${currentCategory == cat.id ? 'active' : ''}`;
    li.dataset.id = cat.id;
    li.textContent = cat.name;
    list.appendChild(li);
  });

  list.addEventListener('click', e => {
    if (e.target.classList.contains('list-group-item')) {
      currentCategory = e.target.dataset.id ? parseInt(e.target.dataset.id) : null;
      renderCategories();
      loadNews();
    }
  });
}

async function loadNews() {
  const params = {};
  if (currentCategory) params.category = currentCategory;
  params.order = currentOrder;

  try {
    const news = await getNews(params);
    renderNews(news);
  } catch (err) {
    console.error('Error al cargar noticias:', err);
  }
}

function renderNews(news) {
  const container = document.getElementById('news-list');
  if (!container) return;

  if (news.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay noticias en esta categoría.</p>';
    return;
  }

  container.innerHTML = news.map((item, idx) => `
    <li class="news-item">
      <a href="detalle.html?id=${item.id}">
        <h4>${idx + 1}. ${item.title}</h4>
        <div class="meta">
          ${item.category_name ? `<span class="badge bg-secondary me-2">${item.category_name}</span>` : ''}
          Por ${item.author_username || item.author} · ${new Date(item.created_at).toLocaleDateString()}
        </div>
        <div class="excerpt">${item.content.substring(0, 150)}...</div>
      </a>
    </li>
  `).join('');
}

// Order controls
document.addEventListener('DOMContentLoaded', () => {
  const orderSelect = document.getElementById('order-select');
  if (orderSelect) {
    orderSelect.addEventListener('change', e => {
      currentOrder = e.target.value;
      loadNews();
    });
  }

  // Crear noticia (solo si está logueado)
  const createBtn = document.getElementById('create-news-btn');
  if (createBtn) {
    createBtn.style.display = isLoggedIn() ? 'inline-block' : 'none';
  }

  loadCategories();
  loadNews();
});
