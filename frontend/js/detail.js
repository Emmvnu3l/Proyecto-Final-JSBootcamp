import { getNewsById, getCommentsByNews, createComment, toggleLike, getLikesByNews } from './api.js';
import { isLoggedIn, getCurrentUser } from './auth.js';

let newsId = null;
let newsData = null;

async function loadNews() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    alert('Noticia no encontrada');
    window.location.href = 'index.html';
    return;
  }
  newsId = id;

  try {
    newsData = await getNewsById(newsId);
    renderNews();
    await loadComments();
    await loadLikes();
  } catch (err) {
    console.error('Error al cargar noticia:', err);
    alert('No se pudo cargar la noticia');
    window.location.href = 'index.html';
  }
}

function renderNews() {
  const container = document.getElementById('news-detail');
  if (!container || !newsData) return;

  container.innerHTML = `
    <h1>${newsData.title}</h1>
    <div class="meta">
      ${newsData.category_name ? `<span class="badge bg-secondary me-2">${newsData.category_name}</span>` : ''}
      Por ${newsData.author_username || newsData.author} · ${new Date(newsData.created_at).toLocaleDateString()}
    </div>
    ${newsData.image_url ? `<img src="http://localhost:3000${newsData.image_url}" alt="${newsData.title}" class="img-fluid">` : ''}
    <div class="content">${newsData.content.replace(/\n/g, '<br>')}</div>
  `;
}

async function loadComments() {
  try {
    const comments = await getCommentsByNews(newsId);
    renderComments(comments);
  } catch (err) {
    console.error('Error al cargar comentarios:', err);
  }
}

function renderComments(comments) {
  const container = document.getElementById('comments-list');
  if (!container) return;

  if (comments.length === 0) {
    container.innerHTML = '<p class="text-muted">Aún no hay comentarios.</p>';
    return;
  }

  container.innerHTML = comments.map(c => `
    <div class="comment">
      <span class="author">${c.username}</span>
      <span class="date">${new Date(c.created_at).toLocaleString()}</span>
      <div class="text">${c.content}</div>
    </div>
  `).join('');
}

async function loadLikes() {
  try {
    const likesData = await getLikesByNews(newsId);
    renderLikes(likesData);
  } catch (err) {
    console.error('Error al cargar likes:', err);
  }
}

function renderLikes(likesData) {
  const container = document.getElementById('likes-section');
  if (!container) return;

  const { likes_count, dislikes_count, likes_users, dislikes_users } = likesData;

  container.innerHTML = `
    <div class="d-flex align-items-center gap-3 mb-3">
      <button class="btn btn-outline-success" onclick="handleLike('like')">
        👍 Like<span class="likes-count">${likes_count}</span>
      </button>
      <button class="btn btn-outline-danger" onclick="handleLike('dislike')">
        👎 Dislike<span class="likes-count">${dislikes_count}</span>
      </button>
    </div>
    <div class="row">
      <div class="col-md-6">
        <small class="text-muted">Likes:</small>
        <div>${likes_users.map(u => `<span class="badge bg-light text-dark me-1">${u.username}</span>`).join('')}</div>
      </div>
      <div class="col-md-6">
        <small class="text-muted">Dislikes:</small>
        <div>${dislikes_users.map(u => `<span class="badge bg-light text-dark me-1">${u.username}</span>`).join('')}</div>
      </div>
    </div>
  `;
}

async function handleLike(type) {
  if (!isLoggedIn()) {
    alert('Debes iniciar sesión para votar');
    window.location.href = 'login.html';
    return;
  }
  try {
    await toggleLike({ news_id: newsId, type });
    await loadLikes();
  } catch (err) {
    console.error('Error al votar:', err);
    alert('No se pudo registrar tu voto');
  }
}

async function handleComment(e) {
  e.preventDefault();
  if (!isLoggedIn()) {
    alert('Debes iniciar sesión para comentar');
    window.location.href = 'login.html';
    return;
  }

  const content = document.getElementById('comment-content').value.trim();
  if (!content) return;

  try {
    await createComment({ news_id: newsId, content });
    document.getElementById('comment-content').value = '';
    await loadComments();
  } catch (err) {
    console.error('Error al comentar:', err);
    alert('No se pudo publicar tu comentario');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadNews();

  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', handleComment);
  }
});

// Exponer handleLike para onclick inline
window.handleLike = handleLike;
