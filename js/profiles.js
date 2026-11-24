'use strict';
window.MakerLinkProfiles = (() => {
  const data = window.MakerLinkData;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const connectionKey = user => `makerlink.connections.v1.${encodeURIComponent(user.username)}`;
  function connections(user) {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(connectionKey(user))); } catch { return []; }
    return data.profiles.filter(profile => Array.isArray(saved) && saved.includes(profile.id)).map(profile => profile.id);
  }
  function own(user) {
    const preferences = window.MakerLinkOnboarding.load(user);
    const demo = user.username === 'eduardo';
    return {
      id: user.username, name: user.name, initials: user.initials, level: 'Aprendiz', color: '',
      bio: demo ? data.demoProfile.bio : 'Cheguei ao MakerLink para aprender, trocar ideias e construir junto com a comunidade.',
      interests: demo && !preferences.interests.length ? data.demoProfile.interests : preferences.interests,
      skills: demo ? data.demoProfile.skills : [],
      communities: demo && !preferences.interests.length ? data.demoProfile.communities : preferences.communities,
      technicalExperience: data.technicalLevels.find(level => level.id === preferences.experience)?.name || '',
      connections: connections(user).length, badges: [], publications: window.MakerLinkContent.own(user), isOwn: true
    };
  }
  function resolve(route, user) {
    if (!user) return null;
    if (route === 'perfil') return own(user);
    const fixture = data.profiles.find(profile => route === `perfil/${profile.id}`);
    if (!fixture) return null;
    const author = data.posts.find(post => post.authorId === fixture.id);
    return { ...fixture, name: author.author, initials: author.initials, level: author.role, color: author.color, publications: data.posts.filter(post => post.authorId === fixture.id), isOwn: false };
  }
  function render(profile, user, icon) {
    const connected = connections(user).includes(profile.id);
    const count = profile.connections + (!profile.isOwn && connected ? 1 : 0);
    const interests = data.onboardingInterests.filter(item => profile.interests.includes(item.id));
    const communities = data.suggestedCommunities.filter(item => profile.communities.includes(item.id));
    const tags = values => `<div class="tags">${values.map(value => `<span class="tag">${escape(value)}</span>`).join('')}</div>`;
    return `<div class="page-heading"><div><h1>${profile.isOwn ? 'Meu perfil' : `Perfil de ${escape(profile.name)}`}</h1><p>Conhecimento se constrói com pessoas.</p></div><a class="button secondary" href="#inicio">Voltar ao feed</a></div>
      <section class="card profile-header" aria-labelledby="profile-name"><div class="profile-cover" aria-hidden="true">${icon('chip')}</div><div class="profile-intro"><span class="avatar profile-avatar ${profile.color}">${escape(profile.initials)}</span><div class="profile-name-line"><div><h2 id="profile-name">${escape(profile.name)}</h2><span class="badge profile-level">${icon('spark')} ${profile.level}</span></div>${profile.isOwn ? '<span class="tag">Seu perfil</span>' : `<button class="button ${connected ? 'secondary' : 'primary'}" data-connect="${profile.id}" aria-pressed="${connected}" aria-label="${connected ? 'Desfazer conexão com' : 'Conectar com'} ${escape(profile.name)}">${icon('users')}<span>${connected ? 'Desfazer conexão' : 'Conectar'}</span></button>`}</div><p class="profile-bio">${escape(profile.bio)}</p><dl class="profile-stats"><div><dt>Conexões</dt><dd data-profile-connection-count>${count}</dd></div><div><dt>Comunidades</dt><dd>${communities.length}</dd></div><div><dt>Publicações</dt><dd>${profile.publications.length}</dd></div></dl><p class="profile-note">${profile.isOwn ? 'Dados do seu cadastro e onboarding. A biografia é um texto inicial padrão.' : 'Perfil, contribuições e total inicial de conexões fictícios.'} Conexões são simuladas e salvas neste navegador.</p></div></section>
      <div class="profile-details-grid"><section class="card profile-section" aria-labelledby="profile-interests"><h2 id="profile-interests">Interesses</h2>${interests.length ? tags(interests.map(item => item.name)) : '<p class="muted">Nenhum interesse informado.</p>'}${profile.technicalExperience ? `<p class="profile-note">Experiência técnica declarada: <strong>${profile.technicalExperience}</strong>. Independente do nível de participação.</p>` : ''}</section><section class="card profile-section" aria-labelledby="profile-skills"><h2 id="profile-skills">Habilidades técnicas</h2>${profile.skills.length ? tags(profile.skills) : '<p class="muted">Ainda não informadas. Interesses não representam habilidades comprovadas.</p>'}</section></div>
      <section class="card profile-section" aria-labelledby="profile-communities"><div class="section-heading"><h2 id="profile-communities">Comunidades das quais participa</h2><span>${communities.length}</span></div>${communities.length ? `<ul class="profile-community-list">${communities.map(community => `<li><span class="community-icon">${icon('users')}</span><div><strong>${escape(community.name)}</strong><small>${escape(community.area)}</small></div></li>`).join('')}</ul>` : '<p class="muted">Nenhuma comunidade selecionada por enquanto.</p>'}</section>
      <section class="card profile-section" aria-labelledby="profile-recognition"><h2 id="profile-recognition">Reconhecimento na comunidade</h2><p class="muted">Contribuir, colaborar e ajudar dá significado à participação.</p>${profile.badges.length ? `<ul class="recognition-list">${profile.badges.map(id => { const badge = data.recognitionBadges[id]; return `<li><span class="recognition-icon">${icon(badge.icon)}</span><div><strong>${badge.name}</strong><p>${badge.description}</p></div></li>`; }).join('')}</ul><p class="profile-note">Emblemas ilustrativos de contribuições fictícias.</p>` : '<p class="profile-empty">Ainda sem emblemas de contribuição. Você pode começar observando e aprender no seu ritmo.</p>'}<ol class="participation-path profile-levels">${data.participationLevels.map(level => `<li class="${level.name === profile.level ? 'current' : ''}" ${level.name === profile.level ? 'aria-current="step"' : ''}><strong>${level.name}</strong><span>${level.description}</span>${level.name === profile.level ? '<small>Nível atual</small>' : ''}</li>`).join('')}</ol><p class="profile-note">Níveis e emblemas são demonstrativos. Conectar ou curtir não altera o nível nem gera pontos.</p></section>
      ${profile.isOwn && connections(user).length ? `<section class="card profile-section"><h2>Suas conexões</h2><ul class="profile-community-list">${connections(user).map(id => { const author = data.posts.find(post => post.authorId === id); return `<li><a class="avatar ${author.color}" href="#perfil/${id}" aria-label="Ver perfil de ${author.author}">${author.initials}</a><a class="author-link" href="#perfil/${id}">${author.author}</a></li>`; }).join('')}</ul></section>` : ''}
      <section class="profile-publications" aria-labelledby="profile-publications"><div class="section-heading"><h2 id="profile-publications">Publicações realizadas</h2><span>${profile.publications.length}</span></div>${profile.publications.length ? profile.publications.slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).map(post => `<article class="card post" data-profile-post="${post.id}"><div class="section-heading"><span class="tag">${post.type}</span><time class="muted" datetime="${post.createdAt}">${new Date(post.createdAt).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</time></div><p class="profile-note">${escape(post.community)}</p><h3>${escape(post.title)}</h3><p>${escape(post.text)}</p>${tags(post.tags.map(tag => `#${tag}`))}</article>`).join('') : '<div class="card profile-section"><p class="muted">Você ainda não publicou. Compartilhe um projeto, uma dúvida técnica ou um tutorial pelo feed.</p><a class="text-button" href="#inicio">Conhecer publicações</a></div>'}</section>`;
  }
  function click(event, user, notify, openInfo) {
    const button = event.target.closest('[data-connect]');
    if (!button || !user) return;
    const profile = resolve(location.hash.slice(1), user);
    if (!profile || profile.isOwn || profile.id !== button.dataset.connect) return;
    const ids = connections(user);
    const wasConnected = ids.includes(profile.id);
    const next = wasConnected ? ids.filter(id => id !== profile.id) : [...ids, profile.id];
    try { localStorage.setItem(connectionKey(user), JSON.stringify(next)); }
    catch { openInfo('Não foi possível salvar a conexão', 'O armazenamento local está indisponível ou cheio. Sua conexão não foi alterada. Habilite o armazenamento e tente novamente.'); return; }
    button.setAttribute('aria-pressed', String(!wasConnected));
    button.setAttribute('aria-label', `${wasConnected ? 'Conectar com' : 'Desfazer conexão com'} ${profile.name}`);
    button.querySelector('span').textContent = wasConnected ? 'Conectar' : 'Desfazer conexão';
    button.classList.toggle('primary', wasConnected);
    button.classList.toggle('secondary', !wasConnected);
    document.querySelector('[data-profile-connection-count]').textContent = profile.connections + (wasConnected ? 0 : 1);
    notify(wasConnected ? 'Conexão simulada desfeita.' : `Você se conectou a ${profile.name}.`);
  }
  return { resolve, render, connections, click };
})();
