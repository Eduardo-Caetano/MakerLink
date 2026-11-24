'use strict';
window.MakerLinkOnboarding = (() => {
  const data = window.MakerLinkData;
  const steps = [
    { id: 'boas-vindas', name: 'Boas-vindas' },
    { id: 'interesses', name: 'Interesses' },
    { id: 'experiencia', name: 'Experiência' },
    { id: 'comunidades', name: 'Comunidades' },
    { id: 'jornada', name: 'Sua jornada' },
    { id: 'conclusao', name: 'Conclusão' }
  ];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const key = user => `makerlink.onboarding.v1.${encodeURIComponent(user.username)}`;
  const isRoute = route => route === 'onboarding' || route.startsWith('onboarding/');
  const isDemo = user => user.username === 'eduardo';
  const routeFor = index => `onboarding/${steps[index].id}`;
  const recommended = state => data.suggestedCommunities.filter(item => item.interests.some(id => state.interests.includes(id)));
  function load(user) {
    let raw;
    try { raw = JSON.parse(localStorage.getItem(key(user))); } catch { /* Dados inválidos reiniciam apenas as preferências deste usuário. */ }
    const state = { interests: [], experience: '', communities: [], step: 0, completed: false };
    if (!raw || typeof raw !== 'object') return state;
    state.interests = data.onboardingInterests.filter(item => Array.isArray(raw.interests) && raw.interests.includes(item.id)).map(item => item.id);
    state.experience = data.technicalLevels.some(item => item.id === raw.experience) ? raw.experience : '';
    state.communities = recommended(state).filter(item => Array.isArray(raw.communities) && raw.communities.includes(item.id)).map(item => item.id);
    state.step = Number.isInteger(raw.step) ? Math.max(0, Math.min(5, raw.step)) : 0;
    if (!state.interests.length) state.step = Math.min(state.step, 1);
    else if (!state.experience) state.step = Math.min(state.step, 2);
    state.completed = raw.completed === true && state.interests.length > 0 && Boolean(state.experience);
    return state;
  }
  function save(user, state) {
    try { localStorage.setItem(key(user), JSON.stringify(state)); return true; }
    catch { return false; }
  }
  function guard(route, user) {
    if (isDemo(user)) return isRoute(route) ? 'inicio' : route;
    const state = load(user);
    if (state.completed) return isRoute(route) ? 'inicio' : route;
    const requested = steps.findIndex(step => route === `onboarding/${step.id}`);
    return routeFor(requested >= 0 && requested <= state.step ? requested : state.step);
  }
  function symbol(name) {
    const paths = { chip: '<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4M9 9h6v6H9Z"/>', code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>', robot: '<rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M8 12h1m6 0h1M9 16h6"/>', box: '<path d="m12 2 9 5v10l-9 5-9-5V7Zm0 10v10M3 7l9 5 9-5"/>', settings: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3"/>', tools: '<path d="m3 3 18 18M3 8l5-5m6 11-8 8-4-4 8-8m4-4 4-4 4 4-4 4"/>' };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.chip}</svg>`;
  }
  function render(route, user) {
    const state = load(user);
    const index = Math.max(0, steps.findIndex(step => route === `onboarding/${step.id}`));
    const selected = (values, id) => values.includes(id) ? 'checked' : '';
    let content = '';
    if (index === 0) content = `<span class="eyebrow">SEU ESPAÇO PARA APRENDER FAZENDO</span><h1>Bem-vindo, ${escape(user.name.split(' ')[0])}!</h1><p>O MakerLink conecta quem gosta de tecnologia para compartilhar ideias, resolver desafios e construir projetos juntos.</p><div class="onboarding-callout"><h2>Comece no seu ritmo</h2><p>Primeiro, escolha seus interesses e conte um pouco sobre sua experiência. Depois, conheça comunidades e descubra como participar. Suas escolhas ficam salvas para você continuar de onde parou.</p><p>Você pode começar apenas observando e aprendendo. Não precisa publicar nada para fazer parte.</p></div>`;
    if (index === 1) content = `<h1>O que desperta sua curiosidade?</h1><p>Escolha uma ou mais áreas. Elas vão orientar as recomendações de comunidades e, futuramente, do feed.</p><fieldset aria-describedby="onboarding-error"><legend>Áreas de interesse</legend><div class="choice-grid">${data.onboardingInterests.map(item => `<label class="choice-card"><input type="checkbox" data-onboarding-interest="${item.id}" ${selected(state.interests, item.id)}><span class="community-icon">${symbol(item.icon)}</span><strong>${item.name}</strong><span>${item.description}</span></label>`).join('')}</div></fieldset>`;
    if (index === 2) content = `<h1>Qual é sua experiência técnica?</h1><p>Assim podemos acolher melhor seu momento de aprendizagem.</p><fieldset aria-describedby="onboarding-error"><legend>Selecione seu nível de conhecimento</legend><div class="choice-stack">${data.technicalLevels.map(item => `<label class="choice-card experience-choice"><input type="radio" name="technical-experience" data-onboarding-experience="${item.id}" ${state.experience === item.id ? 'checked' : ''}><strong>${item.name}</strong><span>${item.description}</span></label>`).join('')}</div></fieldset><p class="simulation-hint">Experiência técnica e participação são diferentes. Todos começam como <strong>Aprendiz</strong>, inclusive quem já tem experiência avançada.</p>`;
    if (index === 3) content = `<h1>Encontre pessoas com os mesmos interesses</h1><p>Sugestões baseadas nas áreas que você escolheu. Participe de quantas quiser ou deixe para depois.</p><div class="choice-grid">${recommended(state).map(item => `<article class="card community-choice"><span class="community-icon">${symbol(item.icon)}</span><span class="tag">${item.area}</span><h2>${item.name}</h2><p>${item.description}</p><small>${item.members} membros · Quantidade fictícia</small><button class="button ${state.communities.includes(item.id) ? 'primary' : 'secondary'}" data-onboarding-community="${item.id}" aria-label="Participar de ${item.name}" aria-pressed="${state.communities.includes(item.id)}">${state.communities.includes(item.id) ? 'Selecionada' : 'Participar'}</button></article>`).join('')}</div><p class="muted onboarding-caption">A participação fica registrada localmente para integração futura com as comunidades.</p>`;
    if (index === 4) content = `<h1>Você pertence desde o primeiro passo</h1><p>Nas comunidades de prática, observar também é aprender. Comece acompanhando as conversas e participe mais ativamente quando se sentir à vontade.</p><ol class="participation-path"><li class="current"><strong>Aprendiz</strong><span>Observar, explorar e aprender.</span><small>Seu ponto de partida</small></li><li><strong>Maker</strong><span>Participar de discussões e compartilhar projetos.</span></li><li><strong>Especialista</strong><span>Contribuir regularmente com conhecimento técnico.</span></li><li><strong>Mentor</strong><span>Orientar e auxiliar outros membros.</span></li></ol><div class="onboarding-callout"><h2>Reconhecimento se constrói com colaboração</h2><p>Contribuições, ajuda e participação na comunidade dão significado à sua jornada. Não há pressa nem obrigação de publicar. Esta é a participação periférica legítima: aprender com a prática e assumir novas contribuições aos poucos.</p></div><h2 class="first-actions-title">Quando quiser, experimente</h2><ul class="first-actions"><li>Explorar uma comunidade</li><li>Conhecer projetos de outros membros</li><li>Fazer uma pergunta</li><li>Compartilhar o primeiro projeto</li></ul>`;
    if (index === 5) content = `<span class="eyebrow">TUDO PRONTO PARA COMEÇAR</span><h1>Sua experiência está pronta, ${escape(user.name.split(' ')[0])}!</h1><p>Confira suas escolhas. Ao começar a explorar, a conclusão do onboarding será registrada.</p><dl class="onboarding-summary"><dt>Seu nome</dt><dd>${escape(user.name)}</dd><dt>Interesses</dt><dd>${data.onboardingInterests.filter(item => state.interests.includes(item.id)).map(item => `<span class="tag">${item.name}</span>`).join(' ')}</dd><dt>Experiência técnica</dt><dd>${data.technicalLevels.find(item => item.id === state.experience)?.name || 'Não selecionada'}</dd><dt>Comunidades escolhidas</dt><dd>${recommended(state).filter(item => state.communities.includes(item.id)).map(item => escape(item.name)).join(', ') || 'Nenhuma por enquanto. Você pode explorar depois.'}</dd><dt>Nível inicial de participação</dt><dd><span class="badge">Aprendiz</span> · Aprenda e participe no seu ritmo.</dd></dl>`;
    return `<div class="onboarding-shell"><a class="brand" href="#onboarding"><img src="assets/icons/chip.svg" alt="" width="36" height="36">Maker<span>Link</span></a><section class="card auth-card onboarding-card"><div class="onboarding-progress"><span>Etapa ${index + 1} de ${steps.length} · ${steps[index].name}</span><progress value="${index + 1}" max="${steps.length}" aria-label="Progresso do onboarding"></progress><ol>${steps.map((step, position) => `<li ${position === index ? 'aria-current="step"' : ''} class="${position <= index ? 'reached' : ''}">${step.name}</li>`).join('')}</ol></div>${content}<p id="onboarding-error" class="form-error" role="alert" tabindex="-1"></p><div class="onboarding-controls">${index > 0 ? `<a class="button secondary" href="#${routeFor(index - 1)}">Voltar</a>` : '<button class="text-button" id="logout">Sair</button>'}<div>${index === 3 ? '<button class="text-button" data-onboarding-action="skip">Pular por enquanto</button>' : ''}<button class="button primary" data-onboarding-action="${index === 5 ? 'finish' : 'next'}">${index === 5 ? 'Começar a explorar' : index === 0 ? 'Vamos começar' : 'Continuar'}</button></div></div></section><p class="auth-note">Seu ritmo. Suas ideias. Uma comunidade para construir junto.</p></div>`;
  }
  function error(message) {
    const region = document.getElementById('onboarding-error');
    region.textContent = message;
    region.focus();
  }
  function change(event, user) {
    if (!user || !isRoute(location.hash.slice(1))) return;
    const input = event.target;
    const state = load(user);
    const previousInterests = [...state.interests];
    const previousExperience = state.experience;
    if (input.dataset.onboardingInterest) {
      const id = input.dataset.onboardingInterest;
      if (!data.onboardingInterests.some(item => item.id === id)) return;
      state.interests = input.checked ? [...new Set([...state.interests, id])] : state.interests.filter(item => item !== id);
      state.communities = state.communities.filter(id => recommended(state).some(item => item.id === id));
    } else if (input.dataset.onboardingExperience) {
      if (!data.technicalLevels.some(item => item.id === input.dataset.onboardingExperience)) return;
      state.experience = input.dataset.onboardingExperience;
    } else return;
    if (!save(user, state)) {
      if (input.dataset.onboardingInterest) input.checked = previousInterests.includes(input.dataset.onboardingInterest);
      else document.querySelectorAll('[data-onboarding-experience]').forEach(radio => { radio.checked = radio.dataset.onboardingExperience === previousExperience; });
      error('Não foi possível salvar suas escolhas. Habilite o armazenamento local e tente novamente.');
    }
    else document.getElementById('onboarding-error').textContent = '';
  }
  function click(event, user, notify) {
    if (!user || !isRoute(location.hash.slice(1))) return;
    const community = event.target.closest('[data-onboarding-community]');
    const action = event.target.closest('[data-onboarding-action]');
    if (!community && !action) return;
    const state = load(user);
    const index = steps.findIndex(step => location.hash === `#onboarding/${step.id}`);
    if (community && index === 3) {
      const id = community.dataset.onboardingCommunity;
      if (!recommended(state).some(item => item.id === id)) return;
      state.communities = state.communities.includes(id) ? state.communities.filter(value => value !== id) : [...state.communities, id];
      if (!save(user, state)) { error('Não foi possível salvar a comunidade. Tente novamente.'); return; }
      community.textContent = state.communities.includes(id) ? 'Selecionada' : 'Participar';
      community.setAttribute('aria-pressed', String(state.communities.includes(id)));
      community.classList.toggle('primary', state.communities.includes(id));
      community.classList.toggle('secondary', !state.communities.includes(id));
      notify(state.communities.includes(id) ? 'Comunidade selecionada.' : 'Seleção de comunidade removida.');
      return;
    }
    if (!action || index < 0) return;
    if (index >= 1 && !state.interests.length) { error('Selecione pelo menos uma área de interesse para continuar.'); return; }
    if (index >= 2 && !state.experience) { error('Selecione seu nível de experiência técnica para continuar.'); return; }
    if (action.dataset.onboardingAction === 'skip' && index === 3) state.communities = [];
    if (action.dataset.onboardingAction === 'finish' && index === 5) state.completed = true;
    else state.step = Math.max(state.step, Math.min(5, index + 1));
    if (!save(user, state)) { error('Não foi possível salvar seu progresso. Habilite o armazenamento local e tente novamente.'); return; }
    if (state.completed) { notify('Onboarding concluído. Bem-vindo à comunidade!'); location.hash = 'inicio'; }
    else location.hash = routeFor(index + 1);
  }
  return { isRoute, guard, render, load, change, click };
})();
