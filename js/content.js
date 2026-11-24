'use strict';
window.MakerLinkContent = (() => {
  const data = window.MakerLinkData;
  const types = ['Projeto', 'Dúvida técnica', 'Tutorial'];
  const key = user => `makerlink.posts.v1.${encodeURIComponent(user.username)}`;
  function read(user) {
    try {
      const saved = JSON.parse(localStorage.getItem(key(user))) ?? [];
      if (!Array.isArray(saved)) return { records: [], error: true };
      const records = saved.filter(post => post && typeof post.id === 'string' && /^local-[a-z0-9-]+$/.test(post.id) && post.authorUsername === user.username && typeof post.title === 'string' && post.title.trim().length > 0 && post.title.length <= 120 && typeof post.text === 'string' && post.text.trim().length > 0 && post.text.length <= 5000 && types.includes(post.type) && data.onboardingInterests.some(category => category.id === post.categoryId) && Number.isFinite(Date.parse(post.createdAt)) && Array.isArray(post.tags) && post.tags.length <= 5 && post.tags.every(tag => typeof tag === 'string' && tag.length > 0 && tag.length <= 24));
      return { records: records.filter((post, index) => records.findIndex(other => other.id === post.id) === index), error: records.length !== saved.length };
    } catch { return { records: [], error: true }; }
  }
  function own(user) {
    return read(user).records.map(record => {
      const category = data.onboardingInterests.find(item => item.id === record.categoryId);
      return { ...record, createdAt: new Date(record.createdAt).toISOString(), authorId: `usuario-${user.username}`, author: user.name, initials: user.initials, role: 'Aprendiz', color: '', communityId: '', community: category.name, interests: [category.id], likes: 0, comments: [], local: true };
    });
  }
  const all = user => [...data.posts, ...own(user)];
  function render() {
    const field = (id, label, control) => `<div class="form-field"><label for="${id}">${label}</label>${control}<small class="field-error" id="${id}-error"></small></div>`;
    return `<div class="page-heading"><div><h1>Criar publicação</h1><p>Compartilhe uma ideia, uma descoberta ou um desafio.</p></div></div><section class="card publication-card"><form id="publication-form" novalidate>${field('post-type', 'Tipo de publicação', `<select id="post-type" required aria-describedby="post-type-error"><option value="">Selecione o tipo</option>${types.map(type => `<option value="${type}">${type}</option>`).join('')}</select>`)}${field('post-title', 'Título', '<input id="post-title" required maxlength="120" aria-describedby="post-title-error" placeholder="Uma boa ideia começa por um título">')}${field('post-text', 'Descrição ou conteúdo', '<textarea id="post-text" required rows="8" maxlength="5000" aria-describedby="post-text-hint post-text-error" placeholder="Conte o que você está construindo, explique sua dúvida ou compartilhe os passos do tutorial."></textarea><small class="muted" id="post-text-hint">Até 5.000 caracteres. Texto simples, sem anexos.</small>')}${field('post-category', 'Categoria tecnológica', `<select id="post-category" required aria-describedby="post-category-error"><option value="">Selecione uma categoria</option>${data.onboardingInterests.map(category => `<option value="${category.id}">${category.name}</option>`).join('')}</select>`)}${field('post-tags', 'Tags (opcional)', '<input id="post-tags" maxlength="160" aria-describedby="post-tags-hint post-tags-error" placeholder="Ex.: ESP32, sensores, horta"><small class="muted" id="post-tags-hint">Separe por vírgulas. Até 5 tags de 24 caracteres cada.</small>')}<p class="form-error" id="publication-error" role="alert" tabindex="-1"></p><p class="profile-note">Publicação local do protótipo, associada à sua conta neste navegador.</p><div class="publication-controls"><a class="button secondary" href="#inicio">Cancelar</a><button class="button primary" type="submit">Publicar</button></div></form></section>`;
  }
  function submit(event, notify) {
    if (event.target.id !== 'publication-form') return;
    event.preventDefault();
    const user = window.MakerLinkAuth.user();
    if (!user || window.MakerLinkAuth.guard('publicar') !== 'publicar') { location.hash = window.MakerLinkAuth.guard('publicar'); return; }
    const form = event.target;
    form.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field-error,.form-error').forEach(error => { error.textContent = ''; });
    const value = id => document.getElementById(id).value.trim();
    const title = value('post-title');
    const text = value('post-text');
    const type = value('post-type');
    const categoryId = value('post-category');
    const rawTags = value('post-tags');
    const tags = [...new Map(rawTags.split(',').map(tag => tag.trim().replace(/^#+/, '').trim()).filter(Boolean).map(tag => [tag.toLocaleLowerCase('pt-BR'), tag])).values()];
    let firstError;
    const fail = (id, message) => {
      const input = document.getElementById(id);
      input.setAttribute('aria-invalid', 'true');
      document.getElementById(`${id}-error`).textContent = message;
      if (!firstError) firstError = input;
    };
    if (!types.includes(type)) fail('post-type', 'Selecione projeto, dúvida técnica ou tutorial.');
    if (!title || title.length > 120) fail('post-title', 'Informe um título de até 120 caracteres.');
    if (!text || text.length > 5000) fail('post-text', 'Informe o conteúdo, com até 5.000 caracteres.');
    if (!data.onboardingInterests.some(category => category.id === categoryId)) fail('post-category', 'Selecione uma categoria tecnológica.');
    if (rawTags.length > 160 || tags.length > 5 || tags.some(tag => tag.length > 24)) fail('post-tags', 'Use até 5 tags de no máximo 24 caracteres cada.');
    if (firstError) { firstError.focus(); return; }
    const saved = read(user);
    const feedback = document.getElementById('publication-error');
    if (saved.error) { feedback.textContent = 'Não foi possível ler suas publicações locais com segurança. Nenhum conteúdo foi substituído. Confira os dados do site no navegador antes de tentar novamente.'; feedback.focus(); return; }
    const now = new Date();
    let id;
    do { id = `local-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 10)}`; } while (saved.records.some(post => post.id === id));
    const record = { id, authorUsername: user.username, title, text, type, categoryId, tags, createdAt: now.toISOString() };
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    try { localStorage.setItem(key(user), JSON.stringify([...saved.records, record])); }
    catch { button.disabled = false; feedback.textContent = 'Não foi possível salvar a publicação. O armazenamento local está indisponível ou cheio. Seu texto foi mantido; tente novamente.'; feedback.focus(); return; }
    form.reset();
    window.MakerLinkFeed.useRecent(user);
    notify('Publicação criada! Ela já está disponível no feed e no seu perfil.');
    location.hash = 'inicio';
  }
  return { own, all, render, submit };
})();
