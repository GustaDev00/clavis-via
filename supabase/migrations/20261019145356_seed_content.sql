-- CLAVIS VIA — conteúdo de demonstração
--
-- Textos fictícios, escritos para a demo. Não são orientação clínica.
-- Idempotente: pode ser reaplicado (upsert por slug / plano + dia).

-- ---------------------------------------------------------------------------
-- Práticas (recomendadas na tela Hoje conforme a emoção do check-in)
-- ---------------------------------------------------------------------------

insert into public.practices
  (slug, title, kind, duration_minutes, key_title, key_message, summary, steps, breath_pattern, emotions, sort_order)
values
  (
    'respiracao-quadrada',
    'Respiração quadrada',
    'respiracao', 3,
    'Um respiro por vez',
    'A ansiedade costuma correr na frente. Hoje, a proposta é só acompanhar o ar entrando e saindo — sem pressa de resolver tudo agora.',
    'Quatro tempos iguais para inspirar, segurar, soltar e descansar.',
    array[
      'Sente-se com os pés apoiados e deixe os ombros descerem.',
      'Inspire pelo nariz contando até quatro.',
      'Segure o ar, sem forçar, contando até quatro.',
      'Solte o ar devagar pela boca contando até quatro.',
      'Descanse sem ar por quatro tempos e recomece.'
    ],
    array[4, 4, 4, 4]::smallint[],
    array['ansiedade']::public.emotion[],
    10
  ),
  (
    'cinco-sentidos',
    'Voltar pelos cinco sentidos',
    'corpo', 4,
    'Voltar para o agora',
    'Quando os pensamentos aceleram, o corpo pode ser um lugar seguro para voltar. Seus sentidos estão aqui, com você, neste momento.',
    'Um exercício de atenção que usa o que está ao seu redor como âncora.',
    array[
      'Olhe ao redor e nomeie, em silêncio, cinco coisas que você vê.',
      'Perceba quatro coisas que você pode tocar — a roupa, a cadeira, o chão.',
      'Escute três sons, perto ou longe.',
      'Note dois cheiros, mesmo que sutis.',
      'Termine percebendo um gosto na boca e respire com calma.'
    ],
    null,
    array['ansiedade', 'sensibilidade']::public.emotion[],
    20
  ),
  (
    'pausa-sem-culpa',
    'Pausa sem culpa',
    'pausa', 5,
    'Descansar também é caminho',
    'Cansaço não é falta de vontade. Talvez hoje o gesto mais corajoso seja desacelerar e se permitir uma pausa de verdade.',
    'Cinco minutos para o corpo baixar o volume, sem precisar produzir nada.',
    array[
      'Encontre um apoio confortável: encoste-se ou deite, se puder.',
      'Solte a mandíbula, a testa e as mãos.',
      'Inspire em quatro tempos e solte em seis, algumas vezes.',
      'Percorra o corpo com atenção, da cabeça aos pés, sem tentar mudar nada.',
      'Antes de levantar, escolha uma coisa que pode esperar até amanhã.'
    ],
    array[4, 0, 6, 0]::smallint[],
    array['cansaco']::public.emotion[],
    30
  ),
  (
    'respiracao-alongada',
    'Respiração alongada',
    'respiracao', 3,
    'Soltar mais do que segura',
    'Irritação também é informação: algo importante para você foi tocado. Antes de responder ao mundo, dê ao corpo alguns respiros mais longos.',
    'A expiração mais longa que a inspiração convida o corpo a desacelerar.',
    array[
      'Apoie as costas e deixe as mãos soltas sobre as pernas.',
      'Inspire pelo nariz contando até quatro.',
      'Faça uma pequena pausa de dois tempos.',
      'Solte o ar pela boca contando até seis, como quem esvazia um balão.',
      'Repita por alguns ciclos e perceba o que mudou.'
    ],
    array[4, 2, 6, 0]::smallint[],
    array['irritacao', 'cansaco']::public.emotion[],
    40
  ),
  (
    'um-pequeno-passo',
    'Um pequeno passo',
    'escrita', 5,
    'Pequeno também conta',
    'Nos dias em que tudo parece pesado, um passo pequeno ainda é um passo. Você não precisa dar conta de tudo hoje.',
    'Escolher uma única ação possível e fazê-la com gentileza.',
    array[
      'Escreva três coisas pequenas que caberiam no seu dia (abrir a janela, beber água, mandar uma mensagem).',
      'Escolha a mais simples delas.',
      'Faça agora, sem pressa e sem cobrança de perfeição.',
      'Anote como foi — mesmo que tenha sido pouco.'
    ],
    null,
    array['desanimo']::public.emotion[],
    50
  ),
  (
    'nomear-e-soltar',
    'Nomear e soltar',
    'escrita', 4,
    'Voz e limites',
    'Talvez hoje você não precise explicar tanto. Comece reconhecendo o que é verdadeiro para você.',
    'Dar nome ao que incomodou e descobrir a necessidade que existe por trás.',
    array[
      'Escreva, sem filtro, o que te incomodou.',
      'Pergunte-se: que necessidade minha não foi respeitada? Tempo, descanso, respeito, escuta?',
      'Transforme isso em uma frase curta de limite, começando por “eu preciso…”.',
      'Respire fundo e decida se, quando e como quer dizer essa frase.'
    ],
    null,
    array['irritacao', 'desanimo']::public.emotion[],
    60
  ),
  (
    'mao-no-coracao',
    'Mão no coração',
    'contemplacao', 3,
    'Sentir muito não é defeito',
    'Sensibilidade também é uma forma de perceber o mundo. Hoje, trate a si com o mesmo cuidado que você ofereceria a alguém que ama.',
    'Um gesto simples de acolhimento para os dias em que tudo toca mais fundo.',
    array[
      'Coloque uma das mãos sobre o peito e sinta o calor dela.',
      'Respire devagar, percebendo o movimento sob a mão.',
      'Diga a si, em silêncio: “é compreensível me sentir assim”.',
      'Pergunte: do que eu preciso agora? Acolha a primeira resposta que vier.'
    ],
    null,
    array['sensibilidade']::public.emotion[],
    70
  ),
  (
    'tres-coisas-boas',
    'Três coisas boas',
    'gratidao', 3,
    'Guardar o que é bom',
    'Dias de paz merecem ser notados. Registrar o que está bem ajuda a lembrar que esses momentos existem — e que podem voltar.',
    'Reconhecer, com detalhes, três coisas boas do seu dia.',
    array[
      'Pense em três coisas boas que aconteceram recentemente, grandes ou pequenas.',
      'Para cada uma, anote um detalhe: onde, com quem, como foi.',
      'Escolha uma delas e perceba como ela aparece no seu corpo agora.'
    ],
    null,
    array['paz', 'esperanca']::public.emotion[],
    80
  ),
  (
    'intencao-do-dia',
    'Intenção do dia',
    'escrita', 3,
    'Semear o amanhã',
    'A esperança fica mais concreta quando ganha um gesto. Que intenção você quer carregar com você hoje?',
    'Transformar esperança em uma intenção simples e um primeiro movimento.',
    array[
      'Complete a frase: “hoje, eu quero cultivar…”.',
      'Escolha um gesto concreto que aproxime você dessa intenção.',
      'Escreva onde e quando vai fazer esse gesto.',
      'Releia a intenção ao fim do dia, sem julgamento.'
    ],
    null,
    array['esperanca']::public.emotion[],
    90
  ),
  (
    'minuto-de-silencio',
    'Um minuto de silêncio',
    'contemplacao', 2,
    'Silêncio que acolhe',
    'Às vezes não é preciso fazer nada — só estar. Se fizer sentido para você, transforme este minuto em oração, gratidão ou simples presença.',
    'Uma pausa contemplativa curta, aberta à sua forma de fé ou de silêncio.',
    array[
      'Feche os olhos ou deixe o olhar repousar em um ponto fixo.',
      'Perceba três respirações completas.',
      'Se quiser, entregue em palavras ou em silêncio aquilo que está carregando.',
      'Termine agradecendo por algo simples deste dia.'
    ],
    null,
    array['paz', 'cansaco', 'esperanca']::public.emotion[],
    100
  ),
  (
    'minuto-de-presenca',
    'Um minuto para você',
    'pausa', 2,
    'Nem tudo cabe em uma palavra',
    'E está tudo bem. Comece se dando um minuto de presença, do jeito que você está, sem precisar entender tudo agora.',
    'Uma pausa curta para notar o que existe, antes de dar nome.',
    array[
      'Apoie os pés no chão e perceba o peso do seu corpo.',
      'Respire algumas vezes no seu próprio ritmo.',
      'Pergunte: onde, no corpo, eu sinto o que estou sentindo?',
      'Apenas observe por alguns instantes, com curiosidade e gentileza.'
    ],
    null,
    array['outro']::public.emotion[],
    110
  )
on conflict (slug) do update set
  title = excluded.title,
  kind = excluded.kind,
  duration_minutes = excluded.duration_minutes,
  key_title = excluded.key_title,
  key_message = excluded.key_message,
  summary = excluded.summary,
  steps = excluded.steps,
  breath_pattern = excluded.breath_pattern,
  emotions = excluded.emotions,
  sort_order = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- Planos
-- ---------------------------------------------------------------------------

insert into public.plans
  (slug, title, summary, description, theme, minutes_per_day, emotions, palette, sort_order)
values
  (
    'quando-a-ansiedade-aperta',
    'Quando a ansiedade aperta',
    'Três dias para respirar, organizar os pensamentos e voltar ao presente.',
    'Um plano curto para os dias em que a cabeça corre mais rápido que o corpo. Cada dia traz uma mensagem, uma ação pequena e um espaço para você registrar como foi.',
    'emocoes', '5 a 10 min',
    array['ansiedade', 'sensibilidade']::public.emotion[],
    'azul', 10
  ),
  (
    'voz-e-limites',
    'Voz e limites',
    'Aprender a dizer o que precisa, com firmeza e gentileza.',
    'Para quem anda dizendo “sim” quando queria dizer “não”. Em três dias, você percebe onde os limites estão faltando e ensaia formas leves de colocá-los.',
    'limites', '5 a 10 min',
    array['irritacao', 'cansaco']::public.emotion[],
    'lavanda', 20
  ),
  (
    'recomecar-com-leveza',
    'Recomeçar com leveza',
    'Pequenos movimentos para os dias de pouca energia.',
    'Quando o desânimo pesa, grandes metas assustam. Este plano propõe recomeços pequenos e possíveis, um dia de cada vez.',
    'recomeco', '5 min',
    array['desanimo', 'cansaco']::public.emotion[],
    'rosa', 30
  ),
  (
    'fe-em-dias-cansados',
    'Fé em dias cansados',
    'Silêncio, gratidão e esperança para quando a fé estiver cansada.',
    'Um plano contemplativo e aberto à sua forma de fé ou espiritualidade. Três pausas para reencontrar sentido, sem cobrança.',
    'fe', '5 a 10 min',
    array['paz', 'esperanca', 'cansaco']::public.emotion[],
    'aurora', 40
  )
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  theme = excluded.theme,
  minutes_per_day = excluded.minutes_per_day,
  emotions = excluded.emotions,
  palette = excluded.palette,
  sort_order = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- Dias dos planos
-- ---------------------------------------------------------------------------

insert into public.plan_days
  (plan_id, day_number, title, subtitle, message, action, reflection_prompt)
select p.id, d.day_number, d.title, d.subtitle, d.message, d.action, d.reflection_prompt
from (values
  (
    'quando-a-ansiedade-aperta', 1,
    'Respirar e reconhecer', 'Antes de resolver, perceber',
    'Antes de exigir força de você, vamos aprender a respirar. Nem todo dia precisa ser produtivo. Hoje, o convite é apenas reconhecer como você está e se permitir um novo começo.',
    'Faça três ciclos de respiração quadrada: inspire em 4, segure em 4, solte em 4, descanse em 4. Depois, escreva em uma frase o que mais ocupou sua mente hoje.',
    'O que você percebeu no corpo depois de respirar?'
  ),
  (
    'quando-a-ansiedade-aperta', 2,
    'Nomear o que pesa', 'Pensamento não é fato',
    'Pensamentos ansiosos costumam falar alto e com certeza. Dar nome a eles ajuda a enxergar que são possibilidades, não sentenças.',
    'Escreva uma preocupação que está te acompanhando. Ao lado, anote: “isso é um fato ou uma possibilidade?”. Depois, escreva o que você diria a uma pessoa querida no seu lugar.',
    'Como foi olhar para essa preocupação de fora?'
  ),
  (
    'quando-a-ansiedade-aperta', 3,
    'Um passo de cada vez', 'O próximo passo possível',
    'Você não precisa enxergar a escada inteira para subir o primeiro degrau. Hoje, o foco é só o próximo passo possível.',
    'Escolha uma tarefa que está te preocupando e divida em partes bem pequenas. Faça apenas a primeira parte hoje.',
    'Qual foi o primeiro passo que você deu?'
  ),
  (
    'voz-e-limites', 1,
    'Perceber onde dói', 'Os sinais do corpo',
    'Muitas vezes o corpo percebe um limite antes da mente: um aperto no peito, um cansaço repentino, uma irritação que parece desproporcional. Hoje, vamos escutar esses sinais.',
    'Lembre-se de um momento recente em que você disse “sim” querendo dizer “não”. Anote o que sentiu no corpo e o que gostaria de ter dito.',
    'Que sinal o seu corpo deu naquele momento?'
  ),
  (
    'voz-e-limites', 2,
    'Um “não” pequeno', 'Treinar com leveza',
    'Colocar limites é uma habilidade, e habilidades se treinam com coisas pequenas. Um “não” pequeno hoje prepara o terreno para conversas maiores.',
    'Diga um “não” pequeno para algo que você faria apenas para não desagradar. Pode ser simples, como recusar um compromisso extra.',
    'Como você se sentiu depois de dizer esse “não”?'
  ),
  (
    'voz-e-limites', 3,
    'Limites com gentileza', 'Firmeza sem dureza',
    'Colocar limites não é se afastar das pessoas: é se aproximar de quem você é. Dá para ser firme e gentil ao mesmo tempo.',
    'Escreva uma frase de limite usando a estrutura “eu me sinto… quando… e eu preciso…”. Se fizer sentido, compartilhe com alguém de confiança.',
    'Que frase de limite você escreveu?'
  ),
  (
    'recomecar-com-leveza', 1,
    'Acolher o cansaço', 'Começar de onde você está',
    'Recomeçar não exige estar com energia. Exige apenas começar de onde você está — mesmo que seja do sofá, mesmo que seja devagar.',
    'Escreva, sem julgamento, três coisas que estão pesando. Depois, risque uma delas que pode esperar.',
    'O que você decidiu deixar para depois?'
  ),
  (
    'recomecar-com-leveza', 2,
    'Pequenos movimentos', 'O corpo puxa a mente',
    'Às vezes o ânimo vem depois do movimento, e não antes. Um gesto pequeno com o corpo pode abrir espaço para o resto.',
    'Faça cinco minutos de algo que movimente o corpo de leve: uma caminhada curta, um alongamento, arrumar uma gaveta.',
    'Que movimento você escolheu e como se sentiu depois?'
  ),
  (
    'recomecar-com-leveza', 3,
    'Voltar a acreditar', 'Reconhecer o caminho',
    'Olhar para trás e reconhecer o que você já atravessou ajuda a confiar no que ainda vem pela frente.',
    'Escreva sobre um momento difícil que você superou. O que te ajudou naquela época? O que disso pode te ajudar agora?',
    'O que você descobriu sobre a sua própria força?'
  ),
  (
    'fe-em-dias-cansados', 1,
    'Silêncio que acolhe', 'Estar, sem precisar fazer',
    'Nem sempre a fé se manifesta com palavras. Em dias cansados, o silêncio também pode ser uma forma de conversa.',
    'Reserve dois minutos de silêncio. Se fizer sentido para você, entregue em oração aquilo que está pesando. Se não, apenas respire.',
    'O que apareceu no silêncio?'
  ),
  (
    'fe-em-dias-cansados', 2,
    'Gratidão pelo pequeno', 'Notar o que sustenta',
    'A gratidão não apaga as dificuldades, mas ilumina o que continua de pé. Hoje, o convite é notar o que sustenta você.',
    'Anote três coisas simples pelas quais você é grato hoje — uma pessoa, um gesto, um detalhe do dia.',
    'Pelo que você agradeceu hoje?'
  ),
  (
    'fe-em-dias-cansados', 3,
    'Esperança para amanhã', 'Um gesto de confiança',
    'Esperança não é certeza: é a decisão de continuar caminhando. Hoje, escolha um gesto que expresse essa confiança.',
    'Escreva uma intenção para amanhã e um gesto concreto de cuidado com você ou com alguém.',
    'Que intenção você quer levar para amanhã?'
  )
) as d (plan_slug, day_number, title, subtitle, message, action, reflection_prompt)
join public.plans p on p.slug = d.plan_slug
on conflict (plan_id, day_number) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  message = excluded.message,
  action = excluded.action,
  reflection_prompt = excluded.reflection_prompt;
