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
- `js/content.js`: formulário, validação, persistência e leitura das publicações da conta.
- `js/feed.js`: ordenação simples, justificativas, cartões e interações simuladas do feed.
- `js/profiles.js`: perfis próprios e fictícios, reconhecimento e conexões locais por usuário.
- `tests/auth.test.cjs`: verificações automatizadas de comportamento, sem dependências.
- `tests/onboarding.test.cjs`: validações e fluxos de preferências, retomada e conclusão.
- `tests/feed.test.cjs`: ordenação, justificativas, curtidas, diversidade e acesso aos perfis de autores.
- `tests/profiles.test.cjs`: integração dos perfis, níveis, emblemas e conexões persistentes.
- `tests/content.test.cjs`: criação, validação, autoria, persistência e integração ao feed/perfil.
- `tests/helpers.cjs`: ambiente compartilhado dos testes em DOM simulado.
- `tests/browser-smoke.cjs`: teste opcional de integração com Chrome headless instalado no Windows.
- `assets/icons/chip.svg`: símbolo local do MakerLink, também usado como favicon.
- `assets/images/`: diretório reservado para imagens futuras.

## Escopo desta etapa

Fundação visual com oito rotas principais, feed e perfis funcionais em caráter demonstrativo; demais módulos permanecem identificados como futuros. Componentes disponíveis: botões, campo de pesquisa, cartões, avatares, tags, emblemas, navegação, menu móvel, modal nativo, progresso ilustrativo e toast acessível.

A pesquisa apenas encaminha o termo para a tela Explorar; não executa buscas. “Criar publicação” abre o formulário da etapa 06; notificações abrem um diálogo explicativo. A progressão continua ilustrativa. O feed combina publicações fictícias e conteúdo local da conta, com ordenação e curtidas simuladas. Os links de navegação suportam histórico e acesso direto por hash.

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

Todos os usuários cadastrados começam como **Aprendiz**, com zero XP ilustrativo, independentemente da experiência técnica; o XP demonstrativo existente de Eduardo é preservado. Nenhum cálculo de XP foi implementado. As escolhas ficam disponíveis por `MakerLinkOnboarding.load(usuario)` e são utilizadas pelo feed da etapa 04. A integração com o módulo de comunidades permanece futura; participar no onboarding registra a intenção localmente.

## Etapa 04 — feed principal

O feed mantém os cartões e a identidade visual existentes, com sete publicações fictícias distribuídas entre as sete áreas do onboarding. Cada uma possui autor com avatar de iniciais, data absoluta exibida em pt-BR no fuso de São Paulo, comunidade, texto, tags, total fictício de curtidas e exemplos de comentários.

- **Para você:** cada interesse em comum soma um ponto; a comunidade escolhida no onboarding soma mais um ponto. Maior pontuação vem primeiro. Empates usam a data, da mais nova à mais antiga, e o ID da publicação como desempate final.
- **Mais recentes:** ignora preferências e ordena somente por data, com desempate por ID. Sem preferências salvas, inclusive na conta demonstrativa, os dois modos resultam na mesma ordem cronológica.
- **Transparência e diversidade:** os critérios ficam visíveis acima da lista e cada cartão explica se corresponde aos interesses, à comunidade acompanhada ou a uma descoberta fora dos interesses. Todas as publicações são mantidas nos dois modos; a personalização não filtra nem oculta temas. Não há aprendizagem automática, pontuação por engajamento ou recomendação externa.
- **Curtidas:** botão reversível, feedback visual e contagem simulada. Estado e modo ficam em memória, separados por usuário nesta aba; sobrevivem à navegação e à troca de ordenação, mas reiniciam ao recarregar. Os dados fictícios originais não são alterados.
- **Comentários:** conversas fictícias expansíveis com HTML nativo `details`/`summary`, acessíveis por teclado. Não existe formulário de envio, edição, compartilhamento nem comunicação com outros usuários.
- **Autores:** nome e avatar abrem `#perfil/<identificador>`, integrado aos perfis da etapa 05. `#perfil` é reservado ao próprio usuário.

A autenticação e o onboarding mantêm os bloqueios de rota. As preferências do onboarding são lidas diretamente do LocalStorage, sem alterar o cadastro nem introduzir novas chaves de persistência. A troca de ordenação preserva o foco no botão escolhido, com `aria-pressed`, e o feedback usa a região de status já existente.

## Etapa 05 — perfis e reconhecimento

O próprio perfil fica disponível no menu, no avatar do cabeçalho e no cartão de usuário da barra lateral, em `#perfil`. Os sete autores do feed possuem perfis em `#perfil/<identificador>`, acessíveis pelo nome e avatar das publicações.

Cada perfil apresenta nome, avatar de iniciais, biografia, interesses, habilidades, quantidade de conexões, comunidades, publicações, nível e reconhecimento. Os perfis fictícios reutilizam nomes, avatares, níveis e publicações do feed, com dados complementares em `data.js`. As publicações são filtradas pelo autor e exibidas da mais recente à mais antiga.

O próprio perfil usa os dados do cadastro e as escolhas do onboarding, incluindo a experiência técnica declarada separadamente do nível de participação. A biografia é um texto inicial padrão, sem edição nesta etapa. Habilidades não coletadas aparecem como “Ainda não informadas”, sem presumir domínio técnico a partir dos interesses. Novos usuários têm zero conexões, nenhuma publicação e nenhum emblema de contribuição até que esses dados existam; continuam como Aprendiz. A demonstração possui biografia e habilidades fictícias próprias.

Nos perfis de terceiros, “Conectar” e “Desfazer conexão” alternam o vínculo, atualizam a contagem e apresentam feedback. A seleção é persistida em `makerlink.connections.v1.<nome-de-usuario>` como uma lista de identificadores válidos e únicos, sem dados sensíveis. O próprio perfil lista os vínculos salvos com acesso aos respectivos perfis. Os totais iniciais de terceiros são fictícios; a conexão deste usuário soma uma unidade ao total exibido. Trata-se de simulação local, sem sincronização de relações entre contas ou dispositivos. Se a gravação falhar, a ação não é confirmada e o estado visual é preservado.

Os quatro níveis — Aprendiz, Maker, Especialista e Mentor — usam os mesmos significados do onboarding. Os perfis fictícios demonstram emblemas por perguntas, projetos compartilhados, ajuda técnica, conhecimento aberto e mentoria, com descrições explícitas da contribuição reconhecida. Não há cálculo de pontos, recompensas, progressão automática nem ganho de XP por curtir ou conectar. Os emblemas ilustrativos não são atribuídos automaticamente ao usuário cadastrado.

Não há mensagens privadas, edição avançada ou grafo de conexões. Os componentes reaproveitam cartões, avatares, tags, emblemas, botões, ícones e a jornada de participação. O botão de conexão mantém foco, nome acessível e `aria-pressed`.

## Etapa 06 — criação de conteúdo

O botão “Criar publicação” do feed abre a rota protegida `#publicar`, dentro do layout existente. O formulário contém tipo (Projeto, Dúvida técnica ou Tutorial), título, conteúdo, categoria tecnológica, tags opcionais e botões Publicar/Cancelar.

Tipo, título, conteúdo e categoria são obrigatórios. Título aceita até 120 caracteres; conteúdo, até 5.000; tags, até cinco itens de 24 caracteres, separados por vírgulas. Espaços nas extremidades e prefixos `#` das tags são removidos, e tags repetidas são deduplicadas sem distinguir maiúsculas. Erros aparecem junto aos campos, com foco no primeiro inválido. O texto é tratado como texto simples e escapado ao renderizar; quebras de linha são preservadas.

A publicação registra identificador, nome de usuário autor, data/hora ISO, tipo, título, conteúdo, categoria e tags em `makerlink.posts.v1.<nome-de-usuario>`. Nome, iniciais e nível são obtidos da conta autenticada ao exibir. Nenhum dado de senha ou e-mail é acrescentado ao registro. A categoria usa os mesmos IDs do onboarding para participar da ordenação personalizada; criar uma publicação não altera interesses, comunidades, XP ou emblemas.

Após salvar, a confirmação aparece na região de status e o feed abre em “Mais recentes”, com o novo conteúdo em destaque. O perfil próprio lista a mesma publicação e atualiza sua contagem; nome e avatar dessa publicação levam a `#perfil`. Novas publicações começam com zero curtidas e comentários, mantendo a simulação de curtidas já existente. Os sete exemplos e os perfis fictícios são preservados.

Os conteúdos persistem ao recarregar e entrar novamente na mesma conta. Nesta etapa, cada conta vê seus próprios conteúdos locais junto aos exemplos fictícios; não há distribuição entre contas ou dispositivos. A conta demonstrativa também pode publicar, em armazenamento separado. Cancelar volta ao feed sem salvar e sem persistir rascunho.

Se o armazenamento estiver bloqueado ou cheio, não há confirmação de sucesso nem navegação: o texto do formulário é mantido para nova tentativa. Registros inválidos não quebram a exibição, e o formulário não sobrescreve um armazenamento inconsistente silenciosamente. Não há upload, editor avançado, agendamento, edição/exclusão de publicações nem backend.

## Verificação manual no navegador

1. Abra `index.html`, confira o console e valide que rotas internas redirecionam para boas-vindas sem uma sessão.
2. Teste cadastro inválido/válido, código incorreto e correto, todas as etapas do onboarding, saída, login, recuperação e demonstração. Após concluir o onboarding, visite as oito rotas, use voltar/avançar e recarregue uma rota.
3. Pesquise um termo e clique em um interesse: ambos devem abrir o placeholder Explorar.
4. Abra os modais de notificações e privacidade; feche com o botão e com Escape. O botão de publicação agora abre um formulário próprio.
5. Navegue por Tab, use o link de salto e o atalho `/` da pesquisa.
6. Confira as larguras 1440, 1024, 768 e 390 px, sem rolagem horizontal. No celular, abra o menu e feche pelo fundo ou Escape.
7. Digite uma rota inexistente: a aplicação deve retornar ao início com feedback.
8. No onboarding, tente continuar sem interesse e sem experiência. Selecione múltiplos interesses e comunidades, volte e recarregue. Verifique o resumo e conclua; faça novo login e confirme que o onboarding não se repete.
9. Cadastre um segundo usuário fictício e confirme que suas preferências começam vazias. Confira navegação por Tab, Espaço nos cartões e setas nas opções de experiência.
10. No feed, alterne “Para você” e “Mais recentes”, confira datas e justificativas, curta e descurta uma publicação e abra os comentários. Nome e avatar devem abrir o perfil do mesmo autor. Voltar ao feed deve preservar a ordenação e a curtida nesta aba.
11. Abra o próprio perfil pelo menu e pelo avatar. Confira nome, iniciais, interesses, comunidades, experiência e nível Aprendiz. Conecte-se a um autor, visite novamente o próprio perfil e confira a contagem; recarregue e depois desfaça a conexão. Verifique emblemas e diferentes níveis nos perfis de Pedro Martins, Mariana Alves, Lucas Ferreira e Ana Ribeiro.
12. Abra “Criar publicação” e tente enviar vazio. Preencha os campos, cancele e confira que nada foi salvo. Publique um projeto, uma dúvida ou um tutorial; confira confirmação, feed, data/hora, autoria e perfil. Recarregue e entre novamente para verificar a persistência. Teste também sem tags.

## Testes automatizados

Dentro da pasta atual do projeto, `MakerLinkk`, execute `node tests/auth.test.cjs`, `node tests/onboarding.test.cjs`, `node tests/feed.test.cjs`, `node tests/profiles.test.cjs` e `node tests/content.test.cjs`. Node é opcional para desenvolvimento e não é necessário para executar a aplicação.

A suíte executa os scripts reais em um DOM simulado e verifica os fluxos, erros de validação, bloqueio anterior ao 2FA, sessão, duração de “Lembrar de mim”, restauração, expiração, logout, demonstração, renderização das oito rotas, identificação do usuário, referências locais e armazenamento bloqueado/corrompido. Os testes do onboarding cobrem seis etapas, seleção múltipla, recomendações, retorno, retomada, isolamento entre usuários, pular comunidades, conclusão e ausência de repetição.

Os testes do feed cobrem prioridades pelos interesses e comunidades, cronologia e desempate por data, manutenção de todas as publicações nos dois modos, justificativas, dados completos, curtidas reversíveis e isoladas por usuário, preservação de foco, acesso aos perfis e preferências ausentes ou inválidas.

Os testes de perfis validam integração do cadastro/onboarding, sete perfis fictícios e publicações por autor, quatro níveis e emblemas válidos, conectar/desconectar, contagens, persistência após reinicialização, isolamento entre usuários, armazenamento corrompido ou indisponível, escape de nomes, autenticação e demonstração.

Os testes de conteúdo validam formulário protegido, campos obrigatórios e limites, três tipos, tags opcionais e deduplicadas, cancelamento, associação à conta, data, integração feed/perfil, persistência após reinicialização, isolamento entre contas, escape de conteúdo e falhas de armazenamento sem perder texto ou substituir registros inconsistentes.

O teste opcional `node tests/browser-smoke.cjs`, executado dentro do projeto, usa o Chrome instalado no caminho padrão do Windows. Ele percorre cadastro, 2FA, onboarding, feed, perfis, primeira publicação, saída e demonstração em DOM real; valida ordenações, curtidas, comentários, links de autores, conexões, contagens, emblemas, foco, cancelamento, validação e exibição do novo conteúdo. Usa largura de 390 px por padrão (aceita `768` ou `1440` como argumento), verifica erros JavaScript e ausência de rolagem horizontal no resumo, feed, perfis e formulário. Cria um HTML e um perfil de navegador temporários e os remove ao terminar. Essa verificação não substitui uma revisão visual completa de todas as larguras e tecnologias assistivas.

## Próximas etapas

Autenticação, onboarding, feed, perfis, reconhecimento simples e criação local de conteúdo estão implementados como simulação acadêmica. Participação efetiva em comunidades, grafo de conexões, configurações de privacidade, moderação e indicadores administrativos permanecem pendentes. Curtidas, comentários, vínculos, níveis e emblemas são demonstrativos; não há cálculo de XP nem progressão automática.
