export type Category =
  | "senhas"
  | "golpes"
  | "privacidade"
  | "redes-sociais"
  | "dispositivos";

export interface CategoryInfo {
  id: Category;
  label: string;
  description: string;
  icon: string;
}

export const categories: CategoryInfo[] = [
  { id: "senhas", label: "Senhas", description: "Como criar e proteger suas senhas", icon: "🔑" },
  { id: "golpes", label: "Golpes & Fraudes", description: "Phishing, engenharia social e mais", icon: "🎣" },
  { id: "privacidade", label: "Privacidade", description: "Seus dados e a LGPD", icon: "🕵️" },
  { id: "redes-sociais", label: "Redes Sociais", description: "Convivência segura online", icon: "💬" },
  { id: "dispositivos", label: "Dispositivos & Web", description: "Wi-Fi, apps, navegadores", icon: "📱" },
];

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanationCorrect: string;
  explanationWrong: string;
  difficulty: "iniciante" | "intermediário" | "avançado";
  category: Category;
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
  // ── Novas perguntas ──
  {
    id: 13,
    question: "Alguém que você conhece online quer marcar um encontro presencial. O que você faz?",
    options: [
      "Vou sozinho ao encontro, parece legal",
      "Nunca encontro presencialmente alguém que só conheço online, ou vou acompanhado de um adulto de confiança",
      "Passo meu endereço para a pessoa vir até minha casa",
      "Marco em um lugar isolado para ter mais privacidade",
    ],
    correctIndex: 1,
    explanationCorrect: "Correto! Pessoas online podem não ser quem dizem. Se for inevitável, vá sempre acompanhado e em local público.",
    explanationWrong: "Encontrar desconhecidos da internet sozinho é muito perigoso. Sempre conte a um adulto de confiança e, se for, vá acompanhado a um local público.",
    difficulty: "iniciante",
  },
  {
    id: 14,
    question: "Você percebe que uma foto sua foi compartilhada sem sua permissão em um grupo. O que faz?",
    options: [
      "Nada, já foi publicada mesmo",
      "Compartilho fotos da outra pessoa como vingança",
      "Peço para remover, e se não removerem, denuncio na plataforma",
      "Fico com vergonha e apago minha conta",
    ],
    correctIndex: 2,
    explanationCorrect: "Exato! Você tem o direito de pedir a remoção e denunciar. Ninguém pode compartilhar suas imagens sem consentimento.",
    explanationWrong: "Compartilhar imagens de alguém sem permissão é errado e pode ser crime. Peça a remoção e denuncie se necessário.",
    difficulty: "iniciante",
  },
  {
    id: 15,
    question: "O que significa o cadeado na barra de endereço do navegador?",
    options: [
      "O site é do governo",
      "A conexão com o site é criptografada (HTTPS)",
      "O site não tem vírus",
      "O site é gratuito",
    ],
    correctIndex: 1,
    explanationCorrect: "Isso mesmo! O cadeado indica que a conexão usa HTTPS, protegendo os dados trocados entre você e o site.",
    explanationWrong: "O cadeado indica que a comunicação é criptografada via HTTPS. Porém, isso não garante que o site é legítimo — apenas que a conexão é segura.",
    difficulty: "intermediário",
  },
  {
    id: 16,
    question: "Um aplicativo pede permissão para acessar sua câmera, microfone, contatos e localização. O que você faz?",
    options: [
      "Aceito tudo rapidamente para usar logo",
      "Analiso se o app realmente precisa de cada permissão e nego as desnecessárias",
      "Se o app é famoso, posso confiar",
      "Permissões não importam, é só um celular",
    ],
    correctIndex: 1,
    explanationCorrect: "Perfeito! Revise cada permissão. Uma calculadora não precisa acessar sua câmera, por exemplo. Conceda apenas o necessário.",
    explanationWrong: "Apps maliciosos usam permissões excessivas para espionar você. Sempre analise e conceda apenas o estritamente necessário.",
    difficulty: "intermediário",
  },
  {
    id: 17,
    question: "O que são cookies em um site?",
    options: [
      "Vírus que infectam seu computador",
      "Pequenos arquivos que armazenam dados sobre sua navegação",
      "Propagandas que aparecem nos sites",
      "Programas que aceleram o carregamento da página",
    ],
    correctIndex: 1,
    explanationCorrect: "Correto! Cookies guardam informações da sua visita, como preferências e login. Alguns rastreiam seus hábitos para publicidade.",
    explanationWrong: "Cookies são pequenos arquivos salvos pelo navegador. Eles podem ser úteis, mas alguns rastreiam sua atividade — por isso muitos sites pedem consentimento.",
    difficulty: "intermediário",
  },
  {
    id: 18,
    question: "Você vê uma notícia chocante compartilhada no WhatsApp por um familiar. O que deve fazer antes de repassar?",
    options: [
      "Encaminho logo para alertar mais pessoas",
      "Verifico a informação em fontes confiáveis antes de compartilhar",
      "Se veio de alguém que conheço, é verdade",
      "Compartilho só nos grupos menores",
    ],
    correctIndex: 1,
    explanationCorrect: "Exatamente! Verificar a informação em sites confiáveis antes de compartilhar ajuda a combater fake news e desinformação.",
    explanationWrong: "Fake news se espalham rápido porque as pessoas compartilham sem verificar. Cheque sempre em fontes confiáveis antes de repassar.",
    difficulty: "iniciante",
  },
  {
    id: 19,
    question: "O que é um ransomware?",
    options: [
      "Um programa que deixa o computador mais rápido",
      "Um tipo de malware que sequestra seus arquivos e pede resgate",
      "Uma ferramenta de recuperação de dados",
      "Um antivírus mais avançado",
    ],
    correctIndex: 1,
    explanationCorrect: "Isso! Ransomware criptografa seus arquivos e exige pagamento para devolvê-los. Backup regular é a melhor prevenção.",
    explanationWrong: "Ransomware é um ataque que bloqueia seus arquivos e cobra resgate. Manter backups atualizados e não clicar em links suspeitos ajuda a se proteger.",
    difficulty: "avançado",
  },
  {
    id: 20,
    question: "O que é engenharia social no contexto de segurança digital?",
    options: [
      "Construir redes sociais",
      "Manipulação psicológica para obter informações confidenciais",
      "Engenharia de software",
      "Criar perfis falsos por diversão",
    ],
    correctIndex: 1,
    explanationCorrect: "Correto! Engenharia social usa manipulação psicológica — como urgência, medo ou confiança — para enganar pessoas e roubar dados.",
    explanationWrong: "Engenharia social é quando criminosos usam truques psicológicos para convencer você a revelar informações. Desconfie de pedidos urgentes ou histórias emocionais.",
    difficulty: "avançado",
  },
  {
    id: 21,
    question: "Qual a melhor prática para gerenciar suas senhas?",
    options: [
      "Usar a mesma senha em todos os sites para não esquecer",
      "Anotar no caderno e deixar na mesa",
      "Usar um gerenciador de senhas confiável",
      "Salvar no bloco de notas do celular",
    ],
    correctIndex: 2,
    explanationCorrect: "Perfeito! Gerenciadores de senhas criam e armazenam senhas únicas e fortes para cada serviço de forma segura e criptografada.",
    explanationWrong: "Usar a mesma senha em vários sites é perigoso. Se um vazar, todos são comprometidos. Gerenciadores de senhas resolvem isso com segurança.",
    difficulty: "avançado",
  },
  {
    id: 22,
    question: "Você recebe uma ligação dizendo que seu celular foi clonado e pedindo dados bancários para \"bloquear\". O que faz?",
    options: [
      "Passo os dados, pois estou preocupado",
      "Desligo e ligo diretamente para meu banco pelo número oficial",
      "Sigo todas as instruções para resolver rápido",
      "Peço para a pessoa ligar de volta depois",
    ],
    correctIndex: 1,
    explanationCorrect: "Ótima atitude! Golpistas se passam por bancos e operadoras. Sempre entre em contato pelos canais oficiais para verificar.",
    explanationWrong: "Ligações urgentes pedindo dados são quase sempre golpe. Desligue e entre em contato com a instituição pelo número oficial.",
    difficulty: "intermediário",
  },
  {
    id: 23,
    question: "O que acontece quando você publica algo na internet e depois apaga?",
    options: [
      "Desaparece completamente de todos os lugares",
      "Pode já ter sido copiado, salvo ou capturado por outras pessoas",
      "Fica apenas no histórico do meu navegador",
      "O site garante que ninguém viu",
    ],
    correctIndex: 1,
    explanationCorrect: "Exato! Uma vez publicado, qualquer pessoa pode ter feito captura de tela ou cópia. Na internet, nada é totalmente apagável.",
    explanationWrong: "Apagar algo não garante que desapareceu. Prints, caches e cópias podem manter seu conteúdo circulando. Pense antes de publicar.",
    difficulty: "iniciante",
  },
  {
    id: 24,
    question: "O que é a LGPD (Lei Geral de Proteção de Dados)?",
    options: [
      "Uma lei que proíbe o uso da internet por menores",
      "Uma lei que regulamenta como empresas coletam e usam dados pessoais",
      "Uma lei que obriga todos a terem antivírus",
      "Uma lei que bloqueia sites perigosos automaticamente",
    ],
    correctIndex: 1,
    explanationCorrect: "Correto! A LGPD garante que suas informações pessoais sejam coletadas e usadas com transparência e seu consentimento.",
    explanationWrong: "A LGPD é a lei brasileira que protege seus dados pessoais, garantindo que empresas peçam permissão e expliquem como usam suas informações.",
    difficulty: "avançado",
  },
  {
    id: 25,
    question: "Seu antivírus encontrou uma ameaça em um arquivo que você baixou. O que faz?",
    options: [
      "Ignoro o alerta e abro o arquivo mesmo assim",
      "Desinstalo o antivírus porque está atrapalhando",
      "Sigo a recomendação do antivírus e removo ou coloco em quarentena",
      "Compartilho o arquivo com amigos para ver se também dá alerta",
    ],
    correctIndex: 2,
    explanationCorrect: "Certo! Confie no antivírus e siga suas recomendações. Arquivos infectados podem causar grandes danos ao seu dispositivo e dados.",
    explanationWrong: "Ignorar alertas do antivírus pode expor seu dispositivo a malware. Sempre siga as recomendações de segurança do programa.",
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
