export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "iniciante" | "intermediário" | "avançado";
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Um amigo pede sua senha do Instagram para postar algo no seu perfil. O que você faz?",
    options: [
      "Compartilho sem pensar duas vezes, é meu amigo!",
      "Nunca compartilho minha senha com ninguém",
      "Compartilho, mas mudo depois",
      "Peço para ele me dizer o que quer postar e eu mesmo publico",
    ],
    correctIndex: 1,
    explanationCorrect: "Exatamente! Sua senha é pessoal e intransferível. Nem mesmo amigos próximos devem ter acesso às suas contas.",
    explanationWrong: "Cuidado! Compartilhar senhas, mesmo com amigos, pode colocar sua conta em risco. Sua senha deve ser sempre secreta.",
    difficulty: "iniciante",
  },
  {
    id: 2,
    question: "Você recebe uma mensagem de um desconhecido pedindo para conversar em privado. Qual a melhor atitude?",
    options: [
      "Respondo educadamente e continuo conversando",
      "Ignoro e bloqueio se parecer suspeito",
      "Envio meus dados para que ele me conheça melhor",
      "Aceito, pois pode ser alguém legal",
    ],
    correctIndex: 1,
    explanationCorrect: "Boa escolha! Desconhecidos na internet podem ter más intenções. Ignorem e bloqueiem contatos suspeitos.",
    explanationWrong: "Atenção! Conversar com desconhecidos online pode ser perigoso. Nunca compartilhe informações pessoais com pessoas que você não conhece na vida real.",
    difficulty: "iniciante",
  },
  {
    id: 3,
    question: "Qual é a senha mais segura entre estas opções?",
    options: [
      "123456",
      "meunome2010",
      "S3nh@_F0rt3!2024",
      "senha",
    ],
    correctIndex: 2,
    explanationCorrect: "Perfeito! Senhas fortes misturam letras maiúsculas, minúsculas, números e símbolos especiais.",
    explanationWrong: "Senhas simples são fáceis de adivinhar. Use combinações de letras, números e símbolos para criar senhas mais seguras.",
    difficulty: "iniciante",
  },
  {
    id: 4,
    question: "Você encontra um Wi-Fi público aberto no shopping. O que faz?",
    options: [
      "Conecto imediatamente e acesso meu banco",
      "Uso com cuidado, evitando acessar contas importantes",
      "Compartilho a senha com todos os amigos",
      "Baixo todos os apps que quero porque é grátis",
    ],
    correctIndex: 1,
    explanationCorrect: "Isso mesmo! Redes Wi-Fi públicas podem ser inseguras. Evite acessar informações sensíveis quando estiver conectado a elas.",
    explanationWrong: "Wi-Fi público pode ser monitorado por hackers. Nunca acesse contas bancárias ou informações sensíveis em redes abertas.",
    difficulty: "intermediário",
  },
  {
    id: 5,
    question: "Um site pede seu CPF para participar de um sorteio online. O que você faz?",
    options: [
      "Informo meu CPF, quero ganhar o prêmio!",
      "Pesquiso se o site é confiável antes de fornecer dados",
      "Peço para meus pais informarem o CPF deles",
      "Compartilho, pois sites sempre protegem nossos dados",
    ],
    correctIndex: 1,
    explanationCorrect: "Correto! Sempre verifique a confiabilidade de um site antes de fornecer dados pessoais. Muitos sorteios são golpes.",
    explanationWrong: "Cuidado com golpes! Muitos sorteios falsos usam seus dados para fraudes. Sempre desconfie e verifique a fonte.",
    difficulty: "intermediário",
  },
  {
    id: 6,
    question: "O que é autenticação em dois fatores (2FA)?",
    options: [
      "Usar duas senhas diferentes",
      "Uma camada extra de segurança além da senha",
      "Fazer login em dois dispositivos ao mesmo tempo",
      "Ter duas contas no mesmo serviço",
    ],
    correctIndex: 1,
    explanationCorrect: "Exato! O 2FA adiciona uma camada extra de proteção, como um código enviado ao seu celular, além da sua senha.",
    explanationWrong: "A autenticação em dois fatores (2FA) é uma proteção extra que pede uma segunda verificação além da senha, como um código no celular.",
    difficulty: "intermediário",
  },
  {
    id: 7,
    question: "Alguém está sofrendo cyberbullying em um grupo do qual você faz parte. O que fazer?",
    options: [
      "Ignoro, não é problema meu",
      "Participo das piadas para me enturmar",
      "Denuncio o comportamento e ofereço apoio à vítima",
      "Saio do grupo sem falar nada",
    ],
    correctIndex: 2,
    explanationCorrect: "Parabéns! Denunciar o cyberbullying e apoiar a vítima é a atitude certa. Todos merecem respeito online.",
    explanationWrong: "Cyberbullying é sério e pode causar muito sofrimento. A melhor atitude é denunciar e apoiar quem está sendo agredido.",
    difficulty: "intermediário",
  },
  {
    id: 8,
    question: "O que é phishing?",
    options: [
      "Um tipo de vírus que destrói seu computador",
      "Uma técnica para pescar dados pessoais através de mensagens falsas",
      "Um jogo de pesca online",
      "Um programa para acelerar a internet",
    ],
    correctIndex: 1,
    explanationCorrect: "Correto! Phishing usa mensagens falsas (e-mails, SMS) para enganar pessoas e roubar dados como senhas e cartões.",
    explanationWrong: "Phishing é uma fraude onde criminosos enviam mensagens falsas se passando por empresas para roubar seus dados pessoais.",
    difficulty: "avançado",
  },
  {
    id: 9,
    question: "Você recebe um e-mail do 'banco' pedindo para atualizar seus dados urgentemente. O que faz?",
    options: [
      "Clico no link e atualizo rapidamente",
      "Entro no site oficial do banco digitando o endereço no navegador",
      "Respondo o e-mail com meus dados",
      "Encaminho para todos meus contatos para que se protejam também",
    ],
    correctIndex: 1,
    explanationCorrect: "Ótima escolha! Nunca clique em links de e-mails suspeitos. Sempre acesse sites digitando o endereço diretamente no navegador.",
    explanationWrong: "E-mails pedindo dados urgentemente são quase sempre golpes. Sempre acesse o site oficial digitando o endereço manualmente.",
    difficulty: "avançado",
  },
  {
    id: 10,
    question: "Qual a configuração de privacidade mais segura para suas redes sociais?",
    options: [
      "Perfil público para ganhar mais seguidores",
      "Perfil privado, aceitando apenas pessoas que conheço",
      "Sem foto de perfil, mas público",
      "Tanto faz, ninguém liga para meu perfil",
    ],
    correctIndex: 1,
    explanationCorrect: "Perfeito! Manter o perfil privado e aceitar apenas conhecidos é a forma mais segura de usar redes sociais.",
    explanationWrong: "Perfis públicos expõem suas informações para qualquer pessoa. Mantenha-o privado e aceite apenas pessoas que você realmente conhece.",
    difficulty: "avançado",
  },
  {
    id: 11,
    question: "O que é uma VPN e para que serve?",
    options: [
      "Um antivírus mais potente",
      "Uma rede que criptografa sua conexão e protege sua privacidade",
      "Um tipo de rede social",
      "Um programa para aumentar a velocidade da internet",
    ],
    correctIndex: 1,
    explanationCorrect: "Isso! A VPN cria um \"túnel\" seguro para seus dados, protegendo sua privacidade e dificultando o rastreamento online.",
    explanationWrong: "VPN (Rede Privada Virtual) criptografa sua conexão à internet, protegendo seus dados e sua privacidade enquanto navega.",
    difficulty: "avançado",
  },
  {
    id: 12,
    question: "Você quer baixar um jogo gratuito e encontra um site desconhecido oferecendo. O que faz?",
    options: [
      "Baixo imediatamente, é grátis!",
      "Procuro o jogo apenas em lojas oficiais como Play Store ou App Store",
      "Peço o link para um amigo pelo WhatsApp",
      "Desativo o antivírus para baixar mais rápido",
    ],
    correctIndex: 1,
    explanationCorrect: "Correto! Sempre baixe aplicativos de lojas oficiais. Sites desconhecidos podem conter malware e vírus.",
    explanationWrong: "Baixar apps de sites desconhecidos é muito arriscado. Use sempre as lojas oficiais para garantir que o app é seguro.",
    difficulty: "iniciante",
  },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (score: number, total: number) => boolean;
}

export const achievements: Achievement[] = [
  {
    id: "first-step",
    title: "Primeiro Passo",
    description: "Completou o quiz pela primeira vez",
    icon: "🚀",
    condition: () => true,
  },
  {
    id: "half-right",
    title: "Meio Caminho",
    description: "Acertou pelo menos metade das perguntas",
    icon: "⭐",
    condition: (score, total) => score >= total / 2,
  },
  {
    id: "cyber-guardian",
    title: "Guardião Digital",
    description: "Acertou 80% ou mais das perguntas",
    icon: "🛡️",
    condition: (score, total) => score >= total * 0.8,
  },
  {
    id: "perfect-score",
    title: "Hacker Ético",
    description: "Acertou todas as perguntas!",
    icon: "🏆",
    condition: (score, total) => score === total,
  },
  {
    id: "security-expert",
    title: "Especialista em Segurança",
    description: "Acertou todas as perguntas avançadas",
    icon: "🔐",
    condition: (score, total) => score >= total * 0.9,
  },
];
