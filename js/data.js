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
  posts: [
    { author: 'Mariana Alves', initials: 'MA', role: 'Maker', community: 'Arduino & ESP32', time: 'há 2 horas', type: 'Projeto', title: 'Pequenas ideias, grandes possibilidades.', text: 'Um sistema de irrigação com ESP32 para cuidar das plantas. Um exemplo de como a tecnologia pode transformar o nosso dia a dia.', tags: ['ESP32', 'Automação', 'DIY'], color: 'purple' },
    { author: 'Lucas Ferreira', initials: 'LF', role: 'Especialista', community: 'Impressão 3D', time: 'há 4 horas', type: 'Discussão', title: 'O que você aprendeu no seu primeiro projeto?', text: 'Compartilhar os desafios também faz parte de construir. Cada tentativa abre espaço para uma nova descoberta.', tags: ['Aprendizado', 'Comunidade'], color: 'green' }
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
