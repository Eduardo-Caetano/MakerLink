// Verificação opcional no Chrome instalado no Windows, sem bibliotecas adicionais.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const target = path.join(root, `.browser-smoke-${process.pid}.html`);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'makerlink-onboarding-'));
const smoke = `<script>
window.addEventListener('load', async () => {
  const result = document.createElement('pre'); result.id = 'smoke-result'; document.body.append(result);
  const errors = []; window.addEventListener('error', e => errors.push(e.message));
  const check = (value, message) => { if (!value) throw Error(message); };
  const wait = () => new Promise(resolve => setTimeout(resolve, 80));
  const navigate = async route => { location.hash = route; await wait(); };
  const submit = async id => { document.getElementById(id).requestSubmit(); await wait(); };
  const click = async selector => { document.querySelector(selector).click(); await wait(); };
  const input = (id, value) => { document.getElementById(id).value = value; };
  try {
    check(location.hash === '#boas-vindas', 'welcome');
    await navigate('cadastro');
    for (const [id, value] of Object.entries({ 'full-name': 'Browser Maker', username: 'browser_maker', email: 'browser@example.com', password: 'Maker123!', 'confirm-password': 'Maker123!' })) input(id, value);
    document.getElementById('terms').checked = true; document.getElementById('privacy').checked = true;
    await submit('register-form'); check(location.hash === '#2fa', 'registration');
    input('code', '123456'); await submit('two-factor-form'); check(location.hash === '#onboarding/boas-vindas', '2fa');
    check(document.querySelector('#sidebar').hidden, 'hidden-sidebar');
    await click('[data-onboarding-action=next]');
    await click('[data-onboarding-action=next]'); check(location.hash === '#onboarding/interesses', 'required-interest');
    await click('[data-onboarding-interest=arduino]'); await click('[data-onboarding-interest=robotica]');
    await click('[data-onboarding-action=next]');
    await click('[data-onboarding-experience=avancado]'); await click('[data-onboarding-action=next]');
    check(document.querySelectorAll('[data-onboarding-community]').length === 2, 'recommendation-count');
    await click('[data-onboarding-community=arduino]');
    await click('[data-onboarding-action=next]'); await click('[data-onboarding-action=next]');
    check(location.hash === '#onboarding/conclusao', 'summary');
    check(document.querySelector('#auth-main').textContent.includes('Browser Maker'), 'personalization');
    check(document.documentElement.scrollWidth <= window.innerWidth, 'mobile-overflow');
    await click('[data-onboarding-action=finish]'); check(location.hash === '#inicio', 'feed');
    check(document.querySelector('.user-button strong').textContent === 'Browser Maker', 'user-identity');
    check(JSON.parse(localStorage.getItem('makerlink.onboarding.v1.browser_maker')).completed, 'persisted-completion');
    await navigate('onboarding'); check(location.hash === '#inicio', 'no-repeat');
    await click('#logout'); check(location.hash === '#boas-vindas', 'logout');
    await click('#demo-login'); check(location.hash === '#inicio', 'demo');
    check(errors.length === 0, errors.join(';'));
    result.textContent = 'PASS: real DOM signup, 2FA, six onboarding steps, validation, recommendations, selection, summary, mobile width, completion, identity, no-repeat, logout and demo; no window errors.';
  } catch (error) { result.textContent = 'FAIL: ' + error.stack; }
});
</script>`;
fs.writeFileSync(target, fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace('</body>', smoke + '</body>'));
try {
  const result = cp.spawnSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--window-size=390,844', '--virtual-time-budget=12000', '--dump-dom', '--user-data-dir=' + profile, 'file:///' + target.replaceAll('\\', '/')], { encoding: 'utf8', timeout: 40000, maxBuffer: 3000000 });
  const match = (result.stdout || '').match(/<pre id="smoke-result">([\s\S]*?)<\/pre>/);
  console.log(match ? match[1] : 'No browser result. ' + (result.error?.message || '') + ' ' + result.stderr?.slice(-1600));
  if (!match || !match[1].startsWith('PASS:')) process.exitCode = 1;
} finally {
  fs.unlinkSync(target);
  // Somente o perfil temporário criado por este teste é removido.
  const resolvedProfile = path.resolve(profile);
  if (path.dirname(resolvedProfile) === path.resolve(os.tmpdir()) && path.basename(resolvedProfile).startsWith('makerlink-onboarding-')) {
    fs.rmSync(resolvedProfile, { recursive: true, force: true, maxRetries: 3 });
  }
}
