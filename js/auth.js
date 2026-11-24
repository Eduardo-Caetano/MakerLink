'use strict';
window.MakerLinkAuth = (() => {
  const keys = { accounts: 'makerlink.accounts.v1', session: 'makerlink.session.v1' };
  const password = 'Maker123!';
  const routes = ['boas-vindas', 'cadastro', 'login', '2fa', 'onboarding'];
  const titles = { 'boas-vindas': 'Boas-vindas', cadastro: 'Criar conta', login: 'Entrar', '2fa': 'Verificação em duas etapas', onboarding: 'Seu próximo passo' };
  let pending = null;
  let session = null;
  let storageAvailable = true;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { storageAvailable = false; return false; }
  }
  function validUser(user) {
    return user && typeof user.name === 'string' && user.name.length > 0 && user.name.length <= 80 && typeof user.username === 'string' && typeof user.initials === 'string';
  }
  let accounts = read(keys.accounts, []);
  accounts = Array.isArray(accounts) ? accounts.filter(user => validUser(user) && typeof user.email === 'string') : [];
  const saved = read(keys.session, null);
  if (saved && validUser(saved.user) && Number.isFinite(saved.expires) && saved.expires > Date.now()) session = saved;
  const user = () => session ? { ...window.MakerLinkData.user, ...session.user, level: 'Aprendiz', experience: session.user.username === 'eduardo' ? window.MakerLinkData.user.experience : 0 } : null;
  const isRoute = route => routes.includes(route) || window.MakerLinkOnboarding.isRoute(route);
  const go = route => { location.hash = route; };
  function beginSession(profile, remember) {
    const candidate = { user: profile, expires: Date.now() + (remember ? 30 : 1) * 86400000 };
    if (!write(keys.session, candidate)) return false;
    session = candidate;
    return true;
  }
  function logout() {
    try { localStorage.removeItem(keys.session); } catch { storageAvailable = false; }
    session = null;
    pending = null;
    go('boas-vindas');
  }
  function field(id, label, type = 'text', attributes = '') {
    return `<div class="form-field"><label for="${id}">${label}</label><div class="input-wrap"><input id="${id}" name="${id}" type="${type}" ${attributes} required aria-describedby="${id}-error">${type === 'password' ? `<button type="button" class="password-toggle" data-password="${id}" aria-controls="${id}" aria-pressed="false">Mostrar</button>` : ''}</div><small class="field-error" id="${id}-error"></small></div>`;
  }
  function render(route) {
    if (window.MakerLinkOnboarding.isRoute(route)) return window.MakerLinkOnboarding.render(route, user());
    const brand = '<a class="brand" href="#boas-vindas"><img src="assets/icons/chip.svg" alt="" width="36" height="36">Maker<span>Link</span></a>';
    const note = '<p class="auth-note">Protótipo acadêmico · Autenticação simulada.<br>Use somente nomes e e-mails fictícios. Não utilize senhas reais.</p>';
    let content;
    if (route === 'boas-vindas') content = `<span class="eyebrow">IDEIAS SE CONECTAM AQUI</span><h1>Conecte ideias.<br>Construa o futuro.</h1><p>Uma comunidade para quem aprende fazendo. Compartilhe conhecimento em eletrônica, programação, robótica e projetos DIY.</p><div class="auth-actions"><a class="button primary" href="#cadastro">Criar conta</a><a class="button secondary" href="#login">Entrar</a><button class="text-button" id="demo-login">Explorar demonstração</button></div>`;
    if (route === 'cadastro') content = `<h1>Comece a construir conexões</h1><p>Crie seu perfil fictício para conhecer o MakerLink.</p><form id="register-form" novalidate>${field('full-name', 'Nome completo', 'text', 'autocomplete="name" maxlength="80"')}${field('username', 'Nome de usuário', 'text', 'autocomplete="username" maxlength="24" placeholder="ex.: ana_maker"')}${field('email', 'E-mail fictício', 'email', 'autocomplete="off" maxlength="120" placeholder="ana@example.com"')}<p class="simulation-hint">Use a senha acadêmica <strong>${password}</strong>. Nenhuma senha será armazenada.</p>${field('password', 'Senha de demonstração', 'password', 'autocomplete="off" maxlength="64"')}${field('confirm-password', 'Confirmação de senha', 'password', 'autocomplete="off" maxlength="64"')}<div class="form-field"><label class="check-label"><input id="terms" type="checkbox" aria-describedby="terms-error">Aceito os <button type="button" class="text-button" data-auth-info="terms">termos de uso</button>.</label><small class="field-error" id="terms-error"></small></div><div class="form-field"><label class="check-label"><input id="privacy" type="checkbox" aria-describedby="privacy-error">Li a <button type="button" class="text-button" data-auth-info="privacy">política de privacidade</button>.</label><small class="field-error" id="privacy-error"></small></div><p class="form-error" role="alert"></p><button class="button primary" type="submit">Criar conta</button></form><p class="auth-switch">Já tem uma conta? <a href="#login">Entrar</a></p>`;
    if (route === 'login') content = `<h1>Que bom ter você de volta</h1><p>Entre para continuar conectando ideias.</p><form id="login-form" novalidate>${field('identity', 'E-mail ou nome de usuário', 'text', 'autocomplete="username" maxlength="120"')}${field('password', 'Senha de demonstração', 'password', 'autocomplete="off" maxlength="64"')}<p class="simulation-hint">Senha acadêmica: <strong>${password}</strong>. Use seu cadastro fictício ou o usuário <strong>eduardo</strong>.</p><label class="check-label"><input id="remember" type="checkbox">Lembrar de mim por 30 dias</label><small class="muted">Sem esta opção, a sessão dura 24 horas.</small><p class="form-error" role="alert"></p><button class="button primary" type="submit">Entrar</button><button type="button" class="text-button" id="recover-password">Esqueci minha senha</button></form><p class="auth-switch">Novo por aqui? <a href="#cadastro">Criar conta</a></p>`;
    if (route === '2fa') content = `<span class="eyebrow">UMA CAMADA A MAIS DE PROTEÇÃO</span><h1>Verifique sua identidade</h1><p>Um aplicativo autenticador gera um código temporário para confirmar que é você. Aqui, essa etapa é simulada.</p><form id="two-factor-form" novalidate>${field('code', 'Código de seis dígitos', 'text', 'inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="000000"')}<p class="simulation-hint">Simulação acadêmica · Código: <strong>123456</strong></p><p class="form-error" role="alert"></p><button class="button primary" type="submit">Verificar código</button></form><a class="text-button" href="#login">Voltar ao login</a>`;
    return `${brand}<section class="card auth-card">${content}</section>${note}`;
  }
  function error(id, message) {
    const input = document.getElementById(id);
    input.setAttribute('aria-invalid', 'true');
    document.getElementById(`${id}-error`).textContent = message;
    return input;
  }
  function clearErrors(form) {
    form.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field-error,.form-error').forEach(el => { el.textContent = ''; });
  }
  function submit(event, notify) {
    const form = event.target;
    if (!['register-form', 'login-form', 'two-factor-form'].includes(form.id)) return;
    event.preventDefault();
    clearErrors(form);
    const value = id => document.getElementById(id).value;
    let first;
    const fail = (id, message) => { const input = error(id, message); if (!first) first = input; };
    if (form.id === 'register-form') {
      const name = value('full-name').trim().replace(/\s+/g, ' ');
      const username = value('username').trim().toLowerCase();
      const email = value('email').trim().toLowerCase();
      if (name.length > 80 || name.split(' ').filter(Boolean).length < 2) fail('full-name', 'Informe nome e sobrenome fictícios.');
      if (!/^[a-z0-9_]{3,24}$/.test(username)) fail('username', 'Use entre 3 e 24 letras sem acento, números ou _.');
      else if (username === 'eduardo' || accounts.some(account => account.username === username)) fail('username', 'Este nome de usuário já está em uso.');
      if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('email', 'Informe um e-mail fictício em formato válido.');
      else if (email === 'eduardo@example.com' || accounts.some(account => account.email === email)) fail('email', 'Este e-mail já está cadastrado.');
      if (value('password') !== password) fail('password', `Use apenas a senha acadêmica ${password}.`);
      if (!value('confirm-password') || value('confirm-password') !== value('password')) fail('confirm-password', 'As senhas precisam ser iguais.');
      if (!document.getElementById('terms').checked) fail('terms', 'Aceite os termos para continuar.');
      if (!document.getElementById('privacy').checked) fail('privacy', 'Confirme a leitura da política para continuar.');
      if (!first) {
        const profile = { name, username, email, initials: name.split(' ').map(part => part[0]).filter(Boolean).filter((_, index, all) => index === 0 || index === all.length - 1).join('').toUpperCase() };
        pending = { profile, register: true, remember: false };
      }
    }
    if (form.id === 'login-form') {
      const identity = value('identity').trim().toLowerCase();
      const profile = ['eduardo', 'eduardo@example.com'].includes(identity) ? { ...window.MakerLinkData.user, username: 'eduardo', email: 'eduardo@example.com' } : accounts.find(account => account.username === identity || account.email === identity);
      if (!identity) fail('identity', 'Informe seu e-mail ou nome de usuário.');
      if (!value('password')) fail('password', 'Informe a senha de demonstração.');
      if (!first && (!profile || value('password') !== password)) {
        form.querySelector('.form-error').textContent = 'Usuário ou senha de demonstração incorretos.';
        document.getElementById('identity').focus();
        return;
      }
      if (!first) pending = { profile, register: false, remember: document.getElementById('remember').checked };
    }
    if (form.id === 'two-factor-form') {
      if (!pending) { go('login'); return; }
      if (!/^\d{6}$/.test(value('code'))) fail('code', 'Digite os seis dígitos do código.');
      else if (value('code') !== '123456') fail('code', 'Código incorreto. Na simulação, use 123456.');
      if (!first) {
        if (pending.register && !pending.saved && !write(keys.accounts, [...accounts, pending.profile])) {
          form.querySelector('.form-error').textContent = 'Não foi possível salvar o cadastro. Habilite o armazenamento local e tente novamente.'; return;
        }
        if (pending.register) { pending.saved = true; accounts = read(keys.accounts, accounts); }
        if (!beginSession(pending.profile, pending.remember)) {
          form.querySelector('.form-error').textContent = 'Não foi possível salvar a sessão. Habilite o armazenamento local e tente novamente.'; return;
        }
        const destination = window.MakerLinkOnboarding.guard('inicio', user());
        pending = null;
        notify('Identidade verificada. Autenticação simulada concluída!');
        go(destination);
        return;
      }
    }
    if (first) { first.focus(); return; }
    form.reset();
    go('2fa');
  }
  function guard(requested) {
    if (session && session.expires <= Date.now()) { session = null; pending = null; }
    if (requested !== '2fa' && pending && requested !== 'cadastro' && requested !== 'login') pending = null;
    if (requested === '2fa' && !session) return pending ? '2fa' : 'login';
    if (session) return window.MakerLinkOnboarding.guard(routes.includes(requested) && requested !== 'onboarding' ? 'inicio' : requested, user());
    return ['boas-vindas', 'cadastro', 'login'].includes(requested) ? requested : 'boas-vindas';
  }
  function click(event, notify, openInfo) {
    if (event.target.closest('#logout')) { logout(); notify('Você saiu do MakerLink.'); }
    if (event.target.closest('#demo-login')) {
      if (beginSession({ ...window.MakerLinkData.user, username: 'eduardo', email: 'eduardo@example.com' }, false)) { pending = null; go('inicio'); notify('Conta demonstrativa conectada.'); }
      else openInfo('Armazenamento indisponível', 'Habilite o armazenamento local do navegador para iniciar uma sessão simulada.');
    }
    const toggle = event.target.closest('[data-password]');
    if (toggle) {
      const input = document.getElementById(toggle.dataset.password);
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      toggle.textContent = show ? 'Ocultar' : 'Mostrar';
      toggle.setAttribute('aria-pressed', String(show));
    }
    if (event.target.closest('#recover-password')) openInfo('Recuperação simulada', `Nenhum e-mail foi enviado. Todas as contas deste protótipo utilizam a senha acadêmica ${password}.`);
    const info = event.target.closest('[data-auth-info]');
    if (info) openInfo(info.dataset.authInfo === 'terms' ? 'Termos de uso · Protótipo' : 'Política de privacidade · Protótipo', 'Este é um ambiente acadêmico, sem autenticação real. Utilize apenas dados fictícios. Nome, usuário e e-mail fictícios ficam neste navegador para simular o cadastro; a sessão expira em 24 horas ou 30 dias com Lembrar de mim. Nenhuma senha é armazenada e nenhum dado é enviado a servidores. Sair remove a sessão. Limpar os dados do site no navegador remove também os cadastros locais.');
  }
  return { user, routes, isRoute, titles, render, guard, submit, click, logout, get storageAvailable() { return storageAvailable; } };
})();
