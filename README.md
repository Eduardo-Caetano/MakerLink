# MakerLink

Conecte ideias. Construa o futuro.

Protótipo acadêmico de Redes Sociais e Virtuais — TIC / UFSC.

## Execução

Abra `index.html` em um navegador moderno (Chrome, Edge, Firefox ou Safari), ou abra a pasta no VS Code e escolha **Open with Live Server** em `index.html`. Não há instalação, build ou conexão externa obrigatória.

## Estrutura

- `index.html`: estrutura semântica compartilhada, cabeçalho, barras laterais, diálogo e região de notificações.
- `css/style.css`: variáveis, componentes e layouts responsivos.
- `js/data.js`: dados fictícios e metadados de navegação.
- `js/app.js`: rotas por hash, renderização, menu móvel, modais e feedback.
- `js/auth.js`: formulários, validações, autenticação simulada, proteção das rotas e sessão local.
- `js/onboarding.js`: etapas, preferências por usuário, recomendações locais e conclusão do onboarding.
- `tests/auth.test.cjs`: verificações automatizadas de comportamento, sem dependências.
- `tests/onboarding.test.cjs`: validações e fluxos de preferências, retomada e conclusão.
- `tests/helpers.cjs`: ambiente compartilhado dos testes em DOM simulado.
- `tests/browser-smoke.cjs`: teste opcional de integração com Chrome headless instalado no Windows.
- `assets/icons/chip.svg`: símbolo local do MakerLink, também usado como favicon.
- `assets/images/`: diretório reservado para imagens futuras.

## Escopo desta etapa

Fundação visual com oito rotas, início demonstrativo e sete telas explicitamente marcadas como futuras. Componentes disponíveis: botões, campo de pesquisa, cartões, avatares, tags, emblemas, navegação, menu móvel, modal nativo, progresso ilustrativo e toast acessível.

A pesquisa apenas encaminha o termo para a tela Explorar; não executa buscas. Publicação e notificações abrem diálogos explicativos. O feed e a progressão são estáticos. Os links de navegação suportam histórico e acesso direto por hash.

As fontes são locais ao sistema. Ícones usam SVG próprio, sem bibliotecas. Não há backend, rastreamento ou chamadas de rede.

## Etapa 02 — autenticação simulada

A entrada padrão é `#boas-vindas`. As novas rotas são `#cadastro`, `#login`, `#2fa` e `#onboarding`, em layout próprio sem as barras da aplicação. Rotas anteriores exigem uma sessão local; isso simula o fluxo de navegação e não representa controle de acesso real.

- **Cadastro:** nome completo, usuário, e-mail fictício, senha, confirmação e duas caixas independentes para termos e política. Valida formato, campos vazios, confirmação e duplicidade de usuário/e-mail. A conta só é persistida após o 2FA.
- **Login:** aceita o usuário ou e-mail cadastrado, sem distinguir maiúsculas/minúsculas. A senha acadêmica é **`Maker123!`**, inclusive no cadastro. Senhas escolhidas livremente não são suportadas: esta decisão permite demonstrar a validação sem armazenar senhas nem verificadores de senha.
- **2FA:** código fixo **`123456`**, informado na tela. Código vazio, incompleto ou incorreto impede o início da sessão. Recarregar antes de concluir essa etapa exige reiniciar o cadastro/login, pois os dados pendentes ficam apenas em memória.
- **Demonstração:** “Explorar demonstração” entra diretamente como Eduardo Costa. Também é possível usar `eduardo` ou `eduardo@example.com` no login, com a senha acadêmica e o 2FA.
- **Sessão:** LocalStorage, com duração de 24 horas, ou 30 dias ao selecionar “Lembrar de mim” no login. Sair remove a sessão; cadastros fictícios permanecem para novos logins. Limpar os dados do site no navegador remove os cadastros e a sessão.
- **Recuperação:** diálogo explicativo; não envia e-mail nem altera senha.
- **Onboarding:** fluxo completo da etapa 03 descrito abaixo.

Use apenas dados fictícios. O LocalStorage contém nome, nome de usuário, e-mail fictício, iniciais e metadados da sessão; nunca senhas, hashes de senha ou códigos 2FA. Os dados são editáveis pelo navegador, como esperado em um protótipo sem backend. Se o armazenamento estiver bloqueado ou cheio, o fluxo exibe erro e não informa sucesso na abertura da sessão.

Os formulários têm labels, autocomplete apropriado, mensagens associadas por `aria-describedby`, indicação de erro e foco no primeiro campo inválido. Botões permitem mostrar/ocultar senhas. A interface reutiliza a paleta e os componentes da etapa inicial.

## Etapa 03 — onboarding

Após o cadastro e o 2FA, novos usuários percorrem seis telas em layout dedicado, sem barras laterais:

1. Boas-vindas pelo nome e apresentação da experiência inicial.
2. Cartões com múltipla seleção entre sete interesses; pelo menos um é obrigatório.
3. Experiência técnica: iniciante, intermediário ou avançado; escolha obrigatória e independente da gamificação.
4. Comunidades recomendadas por correspondência com os interesses, com seleção múltipla e opção de pular.
5. Jornada Aprendiz → Maker → Especialista → Mentor, com orientação sobre participação periférica legítima e sugestões de primeiras ações.
6. Resumo de nome, interesses, experiência, comunidades e nível Aprendiz. “Começar a explorar” registra a conclusão e abre o feed.

As rotas seguem `#onboarding/boas-vindas`, `#onboarding/interesses`, `#onboarding/experiencia`, `#onboarding/comunidades`, `#onboarding/jornada` e `#onboarding/conclusao`. `#onboarding` retoma a etapa alcançada. Links Voltar e histórico do navegador permitem rever as etapas sem perder escolhas; acesso direto não permite saltar etapas ainda não alcançadas.

As preferências são persistidas a cada alteração na chave `makerlink.onboarding.v1.<nome-de-usuario>`, separadas das contas e da sessão. O registro contém IDs dos interesses e comunidades, experiência técnica, etapa alcançada e indicador `completed`. Recarregar ou sair e entrar retoma um onboarding incompleto; concluído, ele não é mostrado novamente, inclusive por acesso direto à rota. Cadastros da etapa anterior sem preferências também passam pelo onboarding no próximo acesso. A conta demonstrativa `eduardo` mantém acesso direto ao feed.

Ao remover um interesse, comunidades que deixam de corresponder aos interesses são removidas da seleção. “Pular por enquanto” limpa a seleção de comunidades e avança. Falhas de gravação apresentam erro e impedem avanço ou conclusão sem persistência. Dados de preferências inválidos são normalizados para retomar uma etapa válida.

Todos os usuários cadastrados começam como **Aprendiz**, com zero XP ilustrativo, independentemente da experiência técnica; o XP demonstrativo existente de Eduardo é preservado. Nenhum cálculo de XP foi implementado. As escolhas ficam disponíveis por `MakerLinkOnboarding.load(usuario)` para integração futura com o feed e com o módulo de comunidades; participar nesta etapa apenas registra a intenção localmente.

## Verificação manual no navegador

1. Abra `index.html`, confira o console e valide que rotas internas redirecionam para boas-vindas sem uma sessão.
2. Teste cadastro inválido/válido, código incorreto e correto, todas as etapas do onboarding, saída, login, recuperação e demonstração. Após concluir o onboarding, visite as oito rotas, use voltar/avançar e recarregue uma rota.
3. Pesquise um termo e clique em um interesse: ambos devem abrir o placeholder Explorar.
4. Abra os modais de publicação, notificações e privacidade; feche com o botão e com Escape.
5. Navegue por Tab, use o link de salto e o atalho `/` da pesquisa.
6. Confira as larguras 1440, 1024, 768 e 390 px, sem rolagem horizontal. No celular, abra o menu e feche pelo fundo ou Escape.
7. Digite uma rota inexistente: a aplicação deve retornar ao início com feedback.
8. No onboarding, tente continuar sem interesse e sem experiência. Selecione múltiplos interesses e comunidades, volte e recarregue. Verifique o resumo e conclua; faça novo login e confirme que o onboarding não se repete.
9. Cadastre um segundo usuário fictício e confirme que suas preferências começam vazias. Confira navegação por Tab, Espaço nos cartões e setas nas opções de experiência.

## Testes automatizados

Com Node.js disponível, execute `node MakerLink/tests/auth.test.cjs` e `node MakerLink/tests/onboarding.test.cjs` a partir da pasta do workspace. Dentro de MakerLink, utilize os caminhos `tests/auth.test.cjs` e `tests/onboarding.test.cjs`. Node é opcional para desenvolvimento e não é necessário para executar a aplicação.

A suíte executa os scripts reais em um DOM simulado e verifica os fluxos, erros de validação, bloqueio anterior ao 2FA, sessão, duração de “Lembrar de mim”, restauração, expiração, logout, demonstração, renderização das oito rotas, identificação do usuário, referências locais e armazenamento bloqueado/corrompido. Os testes do onboarding cobrem seis etapas, seleção múltipla, recomendações, retorno, retomada, isolamento entre usuários, pular comunidades, conclusão e ausência de repetição.

O teste opcional `node MakerLink/tests/browser-smoke.cjs` usa o Chrome instalado no caminho padrão do Windows. Ele percorre cadastro, 2FA, onboarding, feed, saída e demonstração em DOM real, com largura de 390 px, verifica erros JavaScript e ausência de rolagem horizontal no resumo. Cria um HTML e um perfil de navegador temporários e os remove ao terminar. Essa verificação não substitui uma revisão visual completa de todas as larguras e tecnologias assistivas.

## Próximas etapas

RF01 e RF02 estão implementados como simulação acadêmica. Feed personalizado/interativo, perfis, conteúdo, participação efetiva em comunidades, rede social gráfica, configurações de privacidade, moderação, indicadores administrativos e gamificação permanecem pendentes. O feed e a progressão existentes continuam demonstrativos.
