const assert = require('node:assert/strict');
const { boot } = require('./helpers.cjs');
const preferenceKey = username => `makerlink.onboarding.v1.${username}`;
const user = { name: 'Ana Maker', username: 'ana_maker', initials: 'AM', email: 'ana@example.com' };
const preferences = { interests: ['arduino'], communities: ['arduino'], experience: 'iniciante', step: 5, completed: true };
const store = new Map([
  ['makerlink.session.v1', JSON.stringify({ user, expires: Date.now() + 86400000 })],
  [preferenceKey(user.username), JSON.stringify(preferences)]
]);
const app = boot(store);
const feed = app.context.window.MakerLinkFeed;
const data = app.context.window.MakerLinkData;
const icon = () => '<svg aria-hidden="true"></svg>';
const events = [];
const snapshot = JSON.stringify(data.posts);
const ids = posts => Array.from(posts, post => post.id);
function click(selector, dataset) {
  const target = app.element('test-button');
  target.dataset = dataset;
  feed.click({ target: { closest: key => key === selector ? target : null } }, user, icon, message => events.push(message));
  return target;
}
assert.equal(app.context.location.hash, '#inicio');
assert.equal(feed.ordered(user)[0].id, 'irrigacao', 'Interesse e comunidade priorizam conteúdo mesmo mais antigo');
assert.equal(feed.ordered(user, 'recentes')[0].id, 'oficina-reuso');
const chronological = feed.ordered(user, 'recentes');
for (let index = 1; index < chronological.length; index++) assert(Date.parse(chronological[index - 1].createdAt) >= Date.parse(chronological[index].createdAt));
const personal = feed.ordered(user);
assert.deepEqual([...ids(personal)].sort(), [...ids(chronological)].sort(), 'Personalização nunca oculta publicações');
for (let index = 1; index < personal.length; index++) {
  const previous = feed.score(personal[index - 1], preferences);
  const current = feed.score(personal[index], preferences);
  assert(previous >= current);
  if (previous === current) assert(Date.parse(personal[index - 1].createdAt) >= Date.parse(personal[index].createdAt));
}
assert.equal(JSON.stringify(data.posts), snapshot, 'Ordenação não altera os dados-base');
const irrigation = data.posts.find(post => post.id === 'irrigacao');
assert.match(feed.reason(irrigation, preferences, 'personalizado'), /interesses e em uma comunidade/);
assert.match(feed.reason(irrigation, { interests: ['arduino'], communities: [] }, 'personalizado'), /base nos seus interesses/);
assert.match(feed.reason(irrigation, { interests: [], communities: ['arduino'] }, 'personalizado'), /comunidade que você acompanha/);
assert.match(feed.reason(irrigation, { interests: ['diy'], communities: [] }, 'personalizado'), /além dos seus interesses/);
assert.match(feed.reason(irrigation, preferences, 'recentes'), /Sem personalização/);
assert.match(feed.reason(irrigation, { interests: [], communities: [] }, 'personalizado'), /Sem preferências/);
let markup = app.element('#main').innerHTML;
assert.match(markup, /data-feed-order="personalizado" aria-pressed="true"/);
assert.match(markup, /bolhas de filtro/);
for (const post of data.posts) {
  assert(markup.includes(`data-post-id="${post.id}"`));
  assert(markup.includes(`href="#perfil/${post.authorId}"`));
  assert(markup.includes(`<time datetime="${post.createdAt}">`));
  assert(post.likes >= 0 && post.comments.length > 0);
  assert(post.interests.every(id => data.onboardingInterests.some(item => item.id === id)));
  assert(data.suggestedCommunities.some(item => item.id === post.communityId));
  for (const comment of post.comments) assert(comment.author && comment.text);
}
const like = click('[data-feed-like]', { feedLike: 'irrigacao' });
assert.equal(like.attributes['aria-pressed'], 'true');
assert.equal(like.querySelector('[data-like-count]').textContent, irrigation.likes + 1);
assert.match(events.at(-1), /adicionada/);
click('[data-feed-order]', { feedOrder: 'recentes' });
markup = app.element('#feed').innerHTML;
assert(markup.indexOf('data-post-id="oficina-reuso"') < markup.indexOf('data-post-id="irrigacao"'));
assert.match(markup, /data-feed-order="recentes" aria-pressed="true"/);
assert.match(markup, /data-feed-like="irrigacao" aria-pressed="true"/);
assert(app.element('[data-feed-order="recentes"]').focused, 'Preserva foco ao trocar ordenação');
click('[data-feed-like]', { feedLike: 'irrigacao' });
assert.equal(like.attributes['aria-pressed'], 'false');
assert.equal(like.querySelector('[data-like-count]').textContent, irrigation.likes);
assert.equal(JSON.stringify(data.posts), snapshot, 'Curtidas não alteram os totais fictícios');
click('[data-feed-order]', { feedOrder: 'personalizado' });
assert.equal(feed.ordered(user)[0].id, 'irrigacao');
app.navigate('perfil/mariana-alves');
assert.match(app.element('#main').innerHTML, /Perfil de Mariana Alves/);
assert.match(app.element('#main').innerHTML, /Reconhecimento na comunidade/);
assert.equal(app.context.document.title, 'MakerLink · Mariana Alves');
app.navigate('perfil/desconhecido');
assert.equal(app.context.location.hash, '#inicio');
app.navigate('perfil');
assert.match(app.element('#main').innerHTML, /Meu perfil/);
app.navigate('inicio');
const nextPreferences = { ...preferences, interests: ['programacao'], communities: [] };
store.set(preferenceKey(user.username), JSON.stringify(nextPreferences));
assert.equal(feed.ordered(user)[0].id, 'robo-linha', 'Interesse novo muda a prioridade e desempata por data');
const anotherUser = { ...user, username: 'outro' };
assert.deepEqual(ids(feed.ordered(anotherUser)), ids(chronological), 'Sem preferências usa data');
assert(!feed.render(anotherUser, icon).includes('data-feed-like="irrigacao" aria-pressed="true"'), 'Curtidas isoladas por usuário');
store.set(preferenceKey(user.username), '{invalid');
assert.deepEqual(ids(feed.ordered(user)), ids(chronological), 'Preferências inválidas não quebram o feed');
const reloaded = boot(store);
assert.deepEqual(ids(reloaded.context.window.MakerLinkFeed.ordered(user, 'recentes')), ids(chronological));
console.log('PASS: prioridades por interesses/comunidades, cronologia, desempate, diversidade, justificativas, dados completos, curtidas reversíveis/isoladas, troca de modo com foco, acesso a perfis e regressão de dados inválidos.');
