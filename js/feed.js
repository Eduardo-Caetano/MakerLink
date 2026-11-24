'use strict';
window.MakerLinkFeed = (() => {
  const data = window.MakerLinkData;
  const views = new Map();
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  function view(user) {
    if (!views.has(user.username)) views.set(user.username, { order: 'personalizado', liked: new Set() });
    return views.get(user.username);
  }
  function score(post, preferences) {
    const matches = post.interests.filter(id => preferences.interests.includes(id)).length;
    return matches + (preferences.communities.includes(post.communityId) ? 1 : 0);
  }
  function ordered(user, order = view(user).order) {
    const preferences = window.MakerLinkOnboarding.load(user);
    return window.MakerLinkContent.all(user).sort((a, b) => {
      const priority = order === 'personalizado' ? score(b, preferences) - score(a, preferences) : 0;
      return priority || Date.parse(b.createdAt) - Date.parse(a.createdAt) || a.id.localeCompare(b.id);
    });
  }
  function reason(post, preferences, order) {
    if (order === 'recentes') return 'Ordem cronológica · Sem personalização por interesses.';
    const interest = post.interests.some(id => preferences.interests.includes(id));
    const community = preferences.communities.includes(post.communityId);
    if (interest && community) return 'Recomendado com base nos seus interesses e em uma comunidade que você acompanha.';
    if (community) return 'Publicação de uma comunidade que você acompanha.';
    if (interest) return 'Recomendado com base nos seus interesses.';
    return preferences.interests.length || preferences.communities.length ? 'Explore além dos seus interesses · Conheça outra área da comunidade.' : 'Conheça a comunidade · Sem preferências salvas, usamos a ordem cronológica.';
  }
  function authorRoute(id) {
    return `perfil/${id}`;
  }
  function authorFromRoute(route) {
    return data.posts.find(post => authorRoute(post.authorId) === route);
  }
  function render(user, icon) {
    const state = view(user);
    const preferences = window.MakerLinkOnboarding.load(user);
    return `<div class="section-heading"><h2 id="feed-title">Na comunidade</h2><span>Publicações fictícias</span></div>
      <div class="feed-order" role="group" aria-label="Ordenação do feed"><button class="button ${state.order === 'personalizado' ? 'primary' : 'secondary'}" data-feed-order="personalizado" aria-pressed="${state.order === 'personalizado'}" aria-describedby="feed-criteria">${icon('spark')} Para você</button><button class="button ${state.order === 'recentes' ? 'primary' : 'secondary'}" data-feed-order="recentes" aria-pressed="${state.order === 'recentes'}" aria-describedby="feed-criteria">${icon('clock')} Mais recentes</button></div>
      <p class="feed-criteria" id="feed-criteria">${state.order === 'personalizado' ? 'Para você: cada interesse em comum e a comunidade acompanhada somam um ponto de prioridade. Empates são ordenados pela data, da mais nova à mais antiga. Nenhuma publicação é ocultada.' : 'Mais recentes: todas as publicações, da mais nova à mais antiga, independentemente dos seus interesses e comunidades.'} <span>A ordem cronológica oferece uma alternativa à personalização para ampliar suas descobertas e reduzir bolhas de filtro.</span></p><p class="feed-demo-note">Curtidas simuladas ficam nesta aba até recarregar. Comentários são exemplos fictícios.</p>
      <div class="feed-posts">${ordered(user).map(post => {
        const liked = state.liked.has(post.id);
        const profileRoute = post.local ? 'perfil' : authorRoute(post.authorId);
        const date = new Date(post.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' });
        return `<article class="card post" data-post-id="${post.id}"><div class="post-header"><a class="avatar ${post.color}" href="#${profileRoute}" aria-label="Ver perfil de ${escape(post.author)}">${escape(post.initials)}</a><div class="post-author"><a class="author-link" href="#${profileRoute}">${escape(post.author)}</a><span class="badge">${escape(post.role)}</span><small>${escape(post.community)} · <time datetime="${post.createdAt}">${date}</time></small></div><span class="post-type">${escape(post.type)}</span></div><p class="post-reason">${icon('info')}${reason(post, preferences, state.order)}</p><h3>${escape(post.title)}</h3><p>${escape(post.text)}</p><div class="tags">${post.tags.map(tag => `<span class="tag">#${escape(tag)}</span>`).join('')}</div><div class="post-footer"><button class="text-button like-button" data-feed-like="${post.id}" aria-pressed="${liked}" aria-label="${liked ? 'Descurtir' : 'Curtir'} publicação de ${escape(post.author)}">${icon('heart')}<span data-like-count>${post.likes + (liked ? 1 : 0)}</span> curtidas</button><span class="sample-label">Interações simuladas</span></div><details class="post-comments"><summary>${icon('comment')} ${post.comments.length} ${post.comments.length === 1 ? 'comentário' : 'comentários'} · Ver conversa simulada</summary>${post.comments.length ? '' : '<p class="comment-note">Nenhum coment\u00e1rio por enquanto.</p>'}<ul>${post.comments.map(comment => `<li><strong>${escape(comment.author)}</strong><p>${escape(comment.text)}</p></li>`).join('')}</ul><p class="comment-note">Comentários fictícios para demonstração. O envio de novos comentários não está disponível nesta etapa.</p></details></article>`;
      }).join('')}</div>`;
  }
  function click(event, user, icon, notify) {
    if (!user || location.hash !== '#inicio') return;
    const order = event.target.closest('[data-feed-order]');
    if (order && ['personalizado', 'recentes'].includes(order.dataset.feedOrder)) {
      view(user).order = order.dataset.feedOrder;
      document.querySelector('#feed').innerHTML = render(user, icon);
      document.querySelector(`[data-feed-order="${order.dataset.feedOrder}"]`).focus();
      notify(order.dataset.feedOrder === 'recentes' ? 'Feed em ordem cronológica.' : 'Feed ordenado pelas suas preferências.');
    }
    const button = event.target.closest('[data-feed-like]');
    if (button) {
      const post = window.MakerLinkContent.all(user).find(item => item.id === button.dataset.feedLike);
      if (!post) return;
      const liked = view(user).liked;
      if (liked.has(post.id)) liked.delete(post.id);
      else liked.add(post.id);
      button.setAttribute('aria-pressed', String(liked.has(post.id)));
      button.setAttribute('aria-label', `${liked.has(post.id) ? 'Descurtir' : 'Curtir'} publicação de ${post.author}`);
      button.querySelector('[data-like-count]').textContent = post.likes + (liked.has(post.id) ? 1 : 0);
      notify(liked.has(post.id) ? 'Curtida simulada adicionada.' : 'Curtida simulada removida.');
    }
  }
  const useRecent = user => { view(user).order = 'recentes'; };
  return { ordered, score, reason, render, click, authorFromRoute, useRecent };
})();
