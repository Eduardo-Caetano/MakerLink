'use strict';
(() => {
  const data = window.MakerLinkData;
  const auth = window.MakerLinkAuth;
  const feed = window.MakerLinkFeed;
  const profiles = window.MakerLinkProfiles;
  const content = window.MakerLinkContent;
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1Z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3a4 4 0 0 1 0 8"/><circle cx="9" cy="7" r="4"/>',
    folder: '<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    network: '<circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="m10.5 8-4 8m7-8 4 8M8 19h8"/>',
    user: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v2"/>',
    settings: '<path d="m9 3-1 3-3 1-2 4 2 2v4l4 3 3-1 3 1 4-3v-4l2-2-2-4-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/>',
    chart: '<path d="M3 3v18h18M8 16v-5m5 5V7m5 9v-3"/>',
    search: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    chip: '<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4M9 9h6v6H9Z"/>',
    box: '<path d="m12 2 9 5v10l-9 5-9-5V7Zm0 10v10M3 7l9 5 9-5M7.5 4.5l9 5"/>',
    robot: '<rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M1 12v5m22-5v5M8 12h1m6 0h1M9 16h6"/>',
    spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM21 2v4m-2-2h4"/>',
    book: '<path d="M12 5C8 2 4 3 2 4v15c3-2 7-1 10 1 3-2 7-3 10-1V4c-2-1-6-2-10 1Zm0 0v15"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    comment: '<path d="M21 11a9 9 0 0 1-9 9H3l2-4a9 9 0 1 1 16-5Z"/>',
    tools: '<path d="m3 3 18 18M3 8l5-5m6 11-8 8-4-4 8-8m4-4 4-4 4 4-4 4"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.chip}</svg>`;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const main = document.querySelector('#main');
  const dialog = document.querySelector('#info-dialog');
  const sidebar = document.querySelector('#sidebar');
  const menuToggle = document.querySelector('#menu-toggle');
  let toastTimer;
  let searchQuery = '';

  document.querySelector('#navigation').innerHTML = data.navigation.map(item => `<a class="nav-link" href="#${item.id}" data-nav="${item.id}">${icon(item.icon)}<span>${item.label}</span></a>`).join('');
  document.querySelector('#search-icon').innerHTML = icon('search');
  document.querySelector('#notifications').innerHTML = icon('bell');
  menuToggle.innerHTML = icon('menu');

  function openInfo(title, text) {
    document.querySelector('#dialog-title').textContent = title;
    document.querySelector('#dialog-content').replaceChildren(Object.assign(document.createElement('p'), { textContent: text }));
    dialog.showModal();
  }

  function notify(message) {
    const toast = document.querySelector('#toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4500);
  }

  function setMenu(open) {
    sidebar.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.querySelector('#menu-backdrop').hidden = !open;
    if (open) sidebar.querySelector('a').focus();
  }

  function communityList() {
    return data.communities.map(item => `<div class="community"><span class="community-icon ${item.color}">${icon(item.icon)}</span><div><strong>${item.name}</strong><small>${item.members} membros · Dados fictícios</small></div></div>`).join('');
  }

  function updateIdentity() {
    const profile = auth.user();
    document.querySelector('.user-button .avatar').textContent = profile.initials;
    document.querySelector('.user-button strong').textContent = profile.name;
    document.querySelector('.topbar .avatar').textContent = profile.initials;
    document.querySelector('#complementary').innerHTML = `
    <section class="card right-card"><h2>Seu próximo passo</h2><p>Todo grande maker começa por aqui.</p><div class="profile-line"><span class="avatar">${escape(profile.initials)}</span><div><strong>${escape(profile.name)}</strong><small>✦ ${profile.level}</small></div></div><div class="progress-label"><span>Progresso para Maker</span><span>${profile.experience} / ${profile.nextLevel} XP</span></div><progress value="${profile.experience}" max="${profile.nextLevel}" aria-label="Progresso ilustrativo para o nível Maker"></progress><p class="progress-hint">Aprenda, compartilhe e evolua.<br>Progressão ilustrativa nesta etapa.</p></section>
    <section class="card right-card"><h2>Encontre sua comunidade</h2><p>Interesses em comum. Novas conexões.</p>${communityList()}<button class="text-button" data-route="comunidades">Explorar comunidades</button></section>
    <section class="learning-card">${icon('book')}<h3>Aqui, aprender é construir junto.</h3><p>Observe, descubra e dê o primeiro passo. Toda contribuição tem seu valor.</p></section>
    <div class="right-footer"><button data-info="sobre">Sobre o MakerLink</button> · <button data-info="privacidade">Privacidade</button><br>Protótipo acadêmico · UFSC<br>Dados e perfis inteiramente fictícios.</div>`;
  }

  function home() {
    return `<div class="page-heading"><div><h1>Olá, ${escape(auth.user().name.split(' ')[0])} <span aria-hidden="true">✦</span></h1><p>Uma nova ideia começa com uma boa conexão.</p></div><button class="button primary" data-route="publicar">${icon('plus')} Criar publicação</button></div>
      <section class="hero"><div class="hero-copy"><span class="eyebrow">${icon('spark')} BEM-VINDO AO MAKERLINK</span><h2>Conecte ideias.<br>Construa o futuro.</h2><p>Seu espaço para aprender, compartilhar projetos e criar com quem também gosta de fazer acontecer.</p><button class="button primary" data-route="comunidades">Encontre sua comunidade</button></div><div class="hero-art">${icon('chip')}</div></section>
      <section aria-labelledby="interests-title"><div class="section-heading"><h2 id="interests-title">Explore seus interesses</h2><span>O que move você?</span></div><div class="interest-list">${data.interests.map(item => `<button class="interest" data-interest="${escape(item)}">${item}</button>`).join('')}</div></section>
      <section id="feed" aria-labelledby="feed-title">${feed.render(auth.user(), icon)}</section>`;
  }

  function placeholder(route) {
    const item = data.navigation.find(item => item.id === route);
    const [title, text] = data.placeholders[route];
    let result = '';
    if (route === 'explorar' && searchQuery) {
      result = `<section class="card search-result"><h2>Pesquisa: “${escape(searchQuery)}”</h2><p>Termo recebido. A busca por conteúdo será implementada em uma próxima etapa.</p><button class="text-button" id="clear-search">Limpar pesquisa</button></section>`;
    }
    return `<div class="page-heading"><div><h1>${item.label}</h1><p>Seu próximo espaço de descobertas no MakerLink.</p></div></div><section class="card placeholder"><span class="community-icon">${icon(item.icon)}</span><span class="tag">Em desenvolvimento · Próxima etapa</span><h2>${title}</h2><p>${text}</p><button class="button secondary" data-route="inicio">Voltar ao início</button></section>${result}`;
  }

  function render(focus = false) {
    const requested = location.hash.slice(1) || (auth.user() ? 'inicio' : 'boas-vindas');
    let route = auth.guard(requested);
    const isAuth = auth.isRoute(route);
    const profile = profiles.resolve(route, auth.user());
    if (!isAuth && !profile && route !== 'publicar' && !data.navigation.some(item => item.id === route)) {
      route = 'inicio';
      notify('Tela não encontrada. Você voltou ao início.');
    }
    if (location.hash !== `#${route}`) history.replaceState(null, '', `#${route}`);
    const authMain = document.querySelector('#auth-main');
    authMain.classList.toggle('onboarding-layout', window.MakerLinkOnboarding.isRoute(route));
    authMain.hidden = !isAuth;
    sidebar.hidden = isAuth;
    document.querySelector('.workspace').hidden = isAuth;
    document.querySelector('.skip-link').href = isAuth ? '#auth-main' : '#main';
    setMenu(false);
    if (isAuth) {
      main.innerHTML = '';
      authMain.innerHTML = auth.render(route);
      document.title = `MakerLink · ${window.MakerLinkOnboarding.isRoute(route) ? 'Onboarding' : auth.titles[route]}`;
      if (focus) { authMain.focus(); window.scrollTo(0, 0); }
      return;
    }
    authMain.innerHTML = '';
    updateIdentity();
    document.querySelectorAll('[data-nav]').forEach(link => {
      const active = link.dataset.nav === (profile ? 'perfil' : route);
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    main.innerHTML = route === 'publicar' ? content.render() : route === 'inicio' ? home() : profile ? profiles.render(profile, auth.user(), icon) : placeholder(route);
    document.title = `MakerLink · ${profile ? (profile.isOwn ? data.navigation.find(item => item.id === 'perfil').label : profile.name) : (route === 'publicar' ? 'Criar publicação' : data.navigation.find(item => item.id === route).label)}`;
    setMenu(false);
    if (focus) { main.focus(); window.scrollTo(0, 0); }
  }

  document.addEventListener('submit', event => {
    auth.submit(event, notify);
    content.submit(event, notify);
  });
  document.addEventListener('change', event => window.MakerLinkOnboarding.change(event, auth.user()));
  document.addEventListener('click', event => {
    profiles.click(event, auth.user(), notify, openInfo);
    feed.click(event, auth.user(), icon, notify);
    window.MakerLinkOnboarding.click(event, auth.user(), notify);
    auth.click(event, notify, openInfo);
    if (event.target.closest('.skip-link')) {
      event.preventDefault();
      document.querySelector(auth.isRoute(location.hash.slice(1)) ? '#auth-main' : '#main').focus();
      return;
    }
    const routeButton = event.target.closest('[data-route]');
    if (routeButton) {
      const route = routeButton.dataset.route;
      if (location.hash === `#${route}`) render(true);
      else location.hash = route;
    }
    const interest = event.target.closest('[data-interest]');
    if (interest) {
      searchQuery = interest.dataset.interest;
      document.querySelector('#global-search').value = searchQuery;
      location.hash = 'explorar';
    }
    const info = event.target.closest('[data-info]');
    if (info) {
      const messages = {
        sobre: ['Sobre o MakerLink', 'Conecte ideias. Construa o futuro. Protótipo acadêmico para a disciplina de Redes Sociais e Virtuais do curso de Tecnologias da Informação e Comunicação da UFSC. Esta etapa apresenta a fundação visual e a navegação.'],
        privacidade: ['Privacidade no MakerLink', 'Este protótipo usa apenas dados fictícios e não envia informações a servidores. Configurações de visibilidade, consentimentos e exclusão de conta serão implementadas em uma próxima etapa.']
      };
      openInfo(...messages[info.dataset.info]);
    }
    if (event.target.closest('#clear-search')) {
      searchQuery = '';
      document.querySelector('#global-search').value = '';
      render(true);
      notify('Pesquisa limpa.');
    }
  });
  document.querySelector('#search-form').addEventListener('submit', event => {
    event.preventDefault();
    searchQuery = document.querySelector('#global-search').value.trim().slice(0, 160);
    if (!searchQuery) { notify('Digite um termo para explorar.'); return; }
    if (location.hash === '#explorar') render(true);
    else location.hash = 'explorar';
  });
  document.querySelector('#notifications').addEventListener('click', () => openInfo('Tudo em dia por aqui', 'Você não tem notificações neste protótipo. Alertas de interações e atividades da comunidade serão implementados em uma próxima etapa.'));
  document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
  document.querySelector('#dialog-confirm').addEventListener('click', () => dialog.close());
  menuToggle.addEventListener('click', () => setMenu(!sidebar.classList.contains('open')));
  document.querySelector('#menu-backdrop').addEventListener('click', () => { setMenu(false); menuToggle.focus(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && sidebar.classList.contains('open')) { setMenu(false); menuToggle.focus(); }
    if (event.key === '/' && auth.user() && !auth.isRoute(location.hash.slice(1)) && !dialog.open && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      document.querySelector('#global-search').focus();
    }
  });
  window.matchMedia('(max-width: 700px)').addEventListener('change', () => setMenu(false));
  window.addEventListener('hashchange', () => render(true));
  window.addEventListener('storage', event => {
    if (event.key === 'makerlink.session.v1' || event.key === null) location.reload();
  });
  render();
})();
