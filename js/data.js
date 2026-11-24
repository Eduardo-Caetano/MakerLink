'use strict';
window.MakerLinkData = {
  user: { name: 'Eduardo Costa', initials: 'EC', level: 'Aprendiz', experience: 120, nextLevel: 300 },
  navigation: [
    { id: 'inicio', label: 'Início', icon: 'home' },
    { id: 'explorar', label: 'Explorar', icon: 'compass' },
    { id: 'comunidades', label: 'Comunidades', icon: 'users' },
    { id: 'projetos', label: 'Meus projetos', icon: 'folder' },
    { id: 'conexoes', label: 'Conexões', icon: 'network' },
    { id: 'perfil', label: 'Perfil', icon: 'user' },
    { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
    { id: 'administracao', label: 'Painel administrativo', icon: 'chart' }
  ],
  interests: ['Eletrônica', 'Programação', 'Robótica', 'Arduino & ESP32', 'Impressão 3D', 'Automação', 'DIY'],
  onboardingInterests: [
    { id: 'eletronica', name: 'Eletrônica', icon: 'chip', description: 'Componentes, circuitos e novas possibilidades.' },
    { id: 'programacao', name: 'Programação', icon: 'code', description: 'Transforme lógica e criatividade em soluções.' },
    { id: 'robotica', name: 'Robótica', icon: 'robot', description: 'Construa mecanismos que interagem com o mundo.' },
    { id: 'arduino', name: 'Arduino e ESP32', icon: 'chip', description: 'Dê vida às ideias com microcontroladores.' },
    { id: 'impressao3d', name: 'Impressão 3D', icon: 'box', description: 'Do modelo digital ao objeto na sua bancada.' },
    { id: 'automacao', name: 'Automação', icon: 'settings', description: 'Crie sistemas que facilitam o dia a dia.' },
    { id: 'diy', name: 'Projetos DIY', icon: 'tools', description: 'Experimente, adapte e faça com suas próprias mãos.' }
  ],
  technicalLevels: [
    { id: 'iniciante', name: 'Iniciante', description: 'Estou começando e quero aprender.' },
    { id: 'intermediario', name: 'Intermediário', description: 'Já desenvolvo alguns projetos.' },
    { id: 'avancado', name: 'Avançado', description: 'Possuo experiência e quero compartilhar conhecimento.' }
  ],
  suggestedCommunities: [
    { id: 'circuitos', name: 'Eletrônica na prática', icon: 'chip', description: 'Aprenda a montar e entender circuitos com outros makers.', members: '978', area: 'Eletrônica', interests: ['eletronica'] },
    { id: 'codigo', name: 'Código compartilhado', icon: 'code', description: 'Troque ideias sobre lógica, linguagens e soluções.', members: '1,5 mil', area: 'Programação', interests: ['programacao'] },
    { id: 'robotica', name: 'Robótica criativa', icon: 'robot', description: 'Aprenda, monte e coloque em movimento.', members: '652', area: 'Robótica', interests: ['robotica'] },
    { id: 'arduino', name: 'Arduino & ESP32', icon: 'chip', description: 'Do primeiro circuito ao próximo projeto conectado.', members: '1,2 mil', area: 'Microcontroladores', interests: ['arduino'] },
    { id: 'impressao3d', name: 'Impressão 3D', icon: 'box', description: 'Dê forma às suas ideias e compartilhe técnicas de impressão.', members: '864', area: 'Fabricação digital', interests: ['impressao3d'] },
    { id: 'automacao', name: 'Automação & IoT', icon: 'settings', description: 'Conecte dispositivos e crie rotinas inteligentes.', members: '743', area: 'Automação', interests: ['automacao'] },
    { id: 'diy', name: 'Oficina DIY', icon: 'tools', description: 'Reaproveite materiais e construa soluções com a comunidade.', members: '531', area: 'Projetos DIY', interests: ['diy'] }
  ],
  communities: [
    { name: 'Arduino & ESP32', description: 'Do primeiro circuito ao próximo projeto.', members: '1,2 mil', icon: 'chip', color: 'blue' },
    { name: 'Impressão 3D', description: 'Dê forma às suas ideias.', members: '864', icon: 'box', color: 'purple' },
    { name: 'Robótica criativa', description: 'Aprenda, monte e coloque em movimento.', members: '652', icon: 'robot', color: 'green' }
  ],
  recognitionBadges: {
    'primeira-pergunta': { name: 'Primeiro passo', description: 'Compartilhou uma dúvida que abriu espaço para aprender em conjunto.', icon: 'comment' },
    'projeto-compartilhado': { name: 'Ideia em prática', description: 'Compartilhou um projeto e os aprendizados da construção.', icon: 'tools' },
    'ajuda-tecnica': { name: 'Mão amiga', description: 'Ajudou outros membros a compreender desafios técnicos.', icon: 'users' },
    'conhecimento-aberto': { name: 'Conhecimento aberto', description: 'Compartilhou explicações e práticas reutilizáveis pela comunidade.', icon: 'book' },
    'mentoria': { name: 'Construir juntos', description: 'Orientou outros makers com acolhimento e colaboração.', icon: 'spark' }
  },
  profiles: [
    { id: 'mariana-alves', bio: 'Gosto de transformar pequenos problemas do dia a dia em projetos conectados. Compartilho testes, erros e descobertas da minha bancada.', interests: ['arduino', 'automacao', 'eletronica'], skills: ['ESP32', 'Sensores', 'Prototipagem'], communities: ['arduino', 'automacao'], connections: 84, badges: ['projeto-compartilhado', 'ajuda-tecnica'] },
    { id: 'lucas-ferreira', bio: 'Exploro fabricação digital e impressão 3D. Acredito em documentar o processo para que outras pessoas também possam construir.', interests: ['impressao3d', 'diy'], skills: ['Modelagem 3D', 'Impressão FDM', 'Prototipagem'], communities: ['impressao3d', 'diy'], connections: 136, badges: ['conhecimento-aberto', 'ajuda-tecnica'] },
    { id: 'beatriz-souza', bio: 'Maker por curiosidade. Reaproveito materiais e experimento soluções simples para a casa e a oficina.', interests: ['diy', 'impressao3d'], skills: ['Planejamento de projetos', 'Reaproveitamento', 'Montagem'], communities: ['diy'], connections: 47, badges: ['projeto-compartilhado'] },
    { id: 'rafael-lima', bio: 'Conecto programação e eletrônica. Gosto de tornar os projetos mais fáceis de entender, testar e compartilhar.', interests: ['programacao', 'arduino'], skills: ['Python', 'Comunicação serial', 'Testes de software'], communities: ['codigo', 'arduino'], connections: 112, badges: ['conhecimento-aberto', 'ajuda-tecnica'] },
    { id: 'camila-rocha', bio: 'Aprendendo robótica um teste por vez. Registro o que funcionou e o que ainda precisa de uma nova tentativa.', interests: ['robotica', 'programacao'], skills: ['Robôs seguidores de linha', 'Sensores', 'Lógica de programação'], communities: ['robotica', 'codigo'], connections: 63, badges: ['projeto-compartilhado', 'ajuda-tecnica'] },
    { id: 'pedro-martins', bio: 'Estou começando na eletrônica e quero aprender com a comunidade. Cada pergunta é uma chance de entender melhor os circuitos.', interests: ['eletronica', 'arduino'], skills: ['Montagem em protoboard — em aprendizagem'], communities: ['circuitos'], connections: 9, badges: ['primeira-pergunta'] },
    { id: 'ana-ribeiro', bio: 'Compartilho experiências em automação e ajudo novos makers a planejar seus primeiros projetos com autonomia.', interests: ['automacao', 'eletronica', 'arduino'], skills: ['IoT', 'Sistemas embarcados', 'Orientação de projetos'], communities: ['automacao', 'circuitos', 'arduino'], connections: 218, badges: ['mentoria', 'conhecimento-aberto', 'ajuda-tecnica'] }
  ],
  demoProfile: { bio: 'Entusiasta de tecnologia explorando eletrônica e robótica. Quero aprender com outros makers e construir minhas primeiras ideias.', interests: ['arduino', 'robotica'], skills: ['Lógica de programação — em aprendizagem', 'Prototipagem — em aprendizagem'], communities: ['arduino'], badges: [] },
  participationLevels: [
    { name: 'Aprendiz', description: 'Observar, explorar e aprender.' },
    { name: 'Maker', description: 'Participar e compartilhar projetos.' },
    { name: 'Especialista', description: 'Contribuir com conhecimento técnico.' },
    { name: 'Mentor', description: 'Orientar e auxiliar outros membros.' }
  ],
  posts: [
    { id: 'irrigacao', authorId: 'mariana-alves', author: 'Mariana Alves', initials: 'MA', role: 'Maker', communityId: 'arduino', community: 'Arduino & ESP32', createdAt: '2026-11-22T10:30:00-03:00', interests: ['arduino', 'automacao'], type: 'Projeto', title: 'Pequenas ideias, grandes possibilidades.', text: 'Montei uma irrigação com ESP32 e sensor capacitivo de umidade. A bomba funciona por poucos segundos quando o solo está seco. O próximo passo é calibrar o sensor para cada planta e testar uma proteção contra funcionamento sem água.', tags: ['ESP32', 'Automação', 'Horta'], color: 'purple', likes: 28, comments: [{ author: 'Rafael Lima', text: 'Calibrar com o solo seco e depois úmido ajudou bastante no meu projeto.' }, { author: 'Beatriz Souza', text: 'Gostei do cuidado com a bomba. Vou testar algo parecido na minha horta!' }] },
    { id: 'primeira-impressao', authorId: 'lucas-ferreira', author: 'Lucas Ferreira', initials: 'LF', role: 'Especialista', communityId: 'impressao3d', community: 'Impressão 3D', createdAt: '2026-11-24T09:15:00-03:00', interests: ['impressao3d'], type: 'Discussão', title: 'O que você aprendeu no seu primeiro projeto?', text: 'Meu primeiro suporte impresso ficou pequeno: esqueci a folga para o encaixe. Hoje faço uma peça curta de teste antes de imprimir o modelo inteiro. Qual ajuste fez diferença nas suas primeiras impressões?', tags: ['Impressão 3D', 'Tolerância', 'Aprendizado'], color: 'green', likes: 19, comments: [{ author: 'Camila Rocha', text: 'A primeira camada bem ajustada fez muita diferença por aqui.' }] },
    { id: 'oficina-reuso', authorId: 'beatriz-souza', author: 'Beatriz Souza', initials: 'BS', role: 'Maker', communityId: 'diy', community: 'Oficina DIY', createdAt: '2026-11-24T16:40:00-03:00', interests: ['diy'], type: 'Projeto', title: 'Uma bancada organizada com materiais reaproveitados', text: 'Transformei sobras de madeira em um organizador de ferramentas. Planejei as medidas no papel e deixei espaços livres para adaptar a bancada conforme os próximos projetos. Fazer com o que temos também é inventar.', tags: ['Reuso', 'Bancada', 'DIY'], color: 'purple', likes: 12, comments: [{ author: 'Lucas Ferreira', text: 'Boa ideia deixar espaço para adaptar depois. Minha bancada vive mudando.' }] },
    { id: 'python-sensores', authorId: 'rafael-lima', author: 'Rafael Lima', initials: 'RL', role: 'Especialista', communityId: 'codigo', community: 'Código compartilhado', createdAt: '2026-11-23T14:20:00-03:00', interests: ['programacao', 'arduino'], type: 'Tutorial', title: 'Como organizei as leituras do meu sensor em Python', text: 'Separei a leitura da porta serial, a validação dos dados e o salvamento em CSV em três funções pequenas. Ficou mais fácil testar com leituras fictícias antes de conectar o microcontrolador. Quem mais usa Python na bancada?', tags: ['Python', 'Sensores', 'Código'], color: 'green', likes: 34, comments: [{ author: 'Mariana Alves', text: 'Testar com dados fictícios antes de ligar o circuito economiza um bom tempo.' }, { author: 'Pedro Martins', text: 'Vou experimentar essa separação no meu registrador de temperatura.' }] },
    { id: 'robo-linha', authorId: 'camila-rocha', author: 'Camila Rocha', initials: 'CR', role: 'Maker', communityId: 'robotica', community: 'Robótica criativa', createdAt: '2026-11-24T11:00:00-03:00', interests: ['robotica', 'programacao'], type: 'Projeto', title: 'Meu robô já segue a linha — e às vezes sai para passear', text: 'Depois de ajustar a posição dos sensores, o robô ficou mais estável nas retas. Agora estou testando velocidades menores nas curvas. Registrar uma mudança por vez me ajudou a entender o que realmente melhora o comportamento.', tags: ['Robótica', 'Sensores', 'Testes'], color: 'purple', likes: 23, comments: [{ author: 'Rafael Lima', text: 'Registrar uma mudança por vez é uma ótima prática para depurar.' }] },
    { id: 'led-resistor', authorId: 'pedro-martins', author: 'Pedro Martins', initials: 'PM', role: 'Aprendiz', communityId: 'circuitos', community: 'Eletrônica na prática', createdAt: '2026-11-21T08:45:00-03:00', interests: ['eletronica'], type: 'Dúvida', title: 'Primeiro circuito: como escolher o resistor do LED?', text: 'Estou aprendendo a usar a lei de Ohm para montar um circuito com alimentação de 5 V. Entendi que preciso considerar a tensão no LED e a corrente desejada. Alguém tem uma dica para conferir esse cálculo antes da montagem?', tags: ['Eletrônica', 'LED', 'Primeiros passos'], color: 'green', likes: 16, comments: [{ author: 'Lucas Ferreira', text: 'Consulte a tensão e a corrente indicadas no componente. O resistor limita a corrente no circuito.' }, { author: 'Camila Rocha', text: 'Começar pelo cálculo e conferir as ligações antes de alimentar é um bom caminho.' }] },
    { id: 'automacao-local', authorId: 'ana-ribeiro', author: 'Ana Ribeiro', initials: 'AR', role: 'Mentor', communityId: 'automacao', community: 'Automação & IoT', createdAt: '2026-11-23T18:10:00-03:00', interests: ['automacao', 'eletronica'], type: 'Discussão', title: 'Automação também precisa de um plano para quando a rede cai', text: 'No meu protótipo de iluminação, mantive um botão físico e uma rotina local no microcontrolador. Assim consigo testar o comportamento mesmo sem Wi-Fi. Como vocês planejam os estados de falha nos projetos?', tags: ['Automação', 'IoT', 'Confiabilidade'], color: 'purple', likes: 41, comments: [{ author: 'Mariana Alves', text: 'O controle local também facilitou os testes do meu sistema de irrigação.' }] }
  ],
  placeholders: {
    explorar: ['Um universo de ideias para descobrir', 'A descoberta por interesses, categorias e diferentes comunidades será desenvolvida nas próximas etapas.'],
    comunidades: ['Conhecimento que se constrói em comunidade', 'As páginas de comunidades, seus participantes e materiais compartilhados serão implementados em uma próxima etapa.'],
    projetos: ['Suas ideias vão ganhar forma aqui', 'A criação e o gerenciamento de projetos, dúvidas e tutoriais serão implementados em uma próxima etapa.'],
    conexoes: ['Cada conexão abre uma possibilidade', 'A rede de conexões e a visualização de hubs, pontes e membros periféricos serão desenvolvidas em uma próxima etapa.'],
    perfil: ['Seu espaço na comunidade maker', 'Habilidades, interesses, projetos e emblemas farão parte do perfil em uma próxima etapa.'],
    configuracoes: ['Você no controle da sua experiência', 'As preferências de privacidade, os consentimentos e as configurações da conta serão implementados em uma próxima etapa.'],
    administracao: ['Um olhar sobre a saúde da comunidade', 'Indicadores de participação, retenção e moderação serão desenvolvidos em uma próxima etapa.' ]
  }
};
