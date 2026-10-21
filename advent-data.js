/* ============================================
   Адвент-календарь — данные выпусков
   --------------------------------------------
   Чтобы подставить настоящий файл, впишите путь в `src`
   (для видео можно добавить `poster`). Пока `src` пустой,
   на странице показывается подписанный плейсхолдер с `path` —
   туда и стоит положить файл.
   type:  'image' | 'video'
   ratio: пропорции блока (ширина / высота)
   ============================================ */

window.ADVENT_ISSUES = [
  {
    id: 'issue-01',
    num: '01',
    door: 'Тест',
    category: 'Интерактивный тест',
    title: 'Какой ты дизайнер?',
    layout: 'test',
    body: [
      'Первый номер в календаре я решила начать с интерактива. Придумала тест и забавные вопросы на тему «Какой ты дизайнер?». Коллега открывал номер в Figma, переходил в Telegram-бота, отвечал на вопросы и получал ссылку на один из четырёх результатов: панк, чилловый дизайнер, охотник за трендами и ювелир.',
      'Дизайнеры рассказывали, что весь день офис на ушах стоял, выясняя, у кого какой тип дизайнера получился 💅'
    ],
    media: {
      video: { type: 'video', src: 'images/advent/issue-01/bot.mp4', poster: 'images/advent/issue-01/bot-poster.jpg', ratio: '720/1564', autoplay: true, label: 'Запись Telegram-бота', path: 'images/advent/issue-01/bot.mp4' },
      /* Видео результатов — показываются в мокапе ноутбука со слайдером */
      results: [
        { type: 'video', src: 'images/advent/issue-01/result-1.mp4', poster: 'images/advent/issue-01/result-1-poster.jpg', ratio: '20/13', label: 'Панк-дизайнер', path: 'images/advent/issue-01/result-1.mp4' },
        { type: 'video', src: 'images/advent/issue-01/result-2.mp4', poster: 'images/advent/issue-01/result-2-poster.jpg', ratio: '20/13', label: 'Чилловый дизайнер', path: 'images/advent/issue-01/result-2.mp4' },
        { type: 'video', src: 'images/advent/issue-01/result-3.mp4', poster: 'images/advent/issue-01/result-3-poster.jpg', ratio: '20/13', label: 'Охотник за трендами', path: 'images/advent/issue-01/result-3.mp4' },
        { type: 'video', src: 'images/advent/issue-01/result-4.mp4', poster: 'images/advent/issue-01/result-4-poster.jpg', ratio: '20/13', label: 'Ювелир', path: 'images/advent/issue-01/result-4.mp4' }
      ]
    }
  },
  {
    id: 'issue-02',
    num: '02',
    door: 'Коллаба',
    doorTitle: 'UX‑тексты',
    category: 'Экспертная подборка',
    title: 'Коллаборация с UX‑редакторами',
    layout: 'library',
    body: [
      'Во втором номере я обратилась к руководителю Центра UX-редактуры. Мы собрали рекомендации для дизайнеров по улучшению навыков работы с текстами: книги, материалы для просмотра и Telegram-каналы.',
      'Мне хотелось оформить их не просто списком ссылок, а небольшой удобной библиотекой, к которой можно вернуться после праздников. Я организовала интервью с экспертом, а затем подготовила дизайн номера.'
    ],
    expert: 'Руководитель Центра UX-редактуры',
    media: {
      screen: { type: 'video', src: 'images/advent/issue-02/screen.mp4', poster: 'images/advent/issue-02/screen-poster.jpg', ratio: '20/13', label: 'Номер с рекомендациями UX-редакторов', path: 'images/advent/issue-02/screen.mp4' }
    }
  },
  {
    id: 'issue-03',
    num: '03',
    door: 'Коллаба',
    doorTitle: 'UX-исследования',
    category: 'Экспертная подборка',
    title: 'Коллаборация с UX‑исследователями',
    layout: 'gallery',
    body: [
      'Третий выпуск я посвятила UX-исследованиям. Вместе с руководителем Центра UX-исследований собрали книги, YouTube-материалы и полезные каналы для тех, кто хочет глубже разобраться в исследовательском подходе.'
    ],
    expert: 'Руководитель Центра UX-исследований',
    media: {
      screen: { type: 'video', src: 'images/advent/issue-03/screen.mp4', poster: 'images/advent/issue-03/screen-poster.jpg', ratio: '20/13', label: 'Номер с рекомендациями по UX-исследованиям', path: 'images/advent/issue-03/screen.mp4' }
    }
  },
  {
    id: 'issue-04',
    num: '04',
    door: 'Мои находки',
    doorTitle: 'Дизайн и нейросети',
    category: 'Авторская подборка',
    title: 'Теперь моя очередь делиться находками',
    layout: 'picks',
    body: [
      'После двух экспертных выпусков я решила поделиться собственными рекомендациями. Собрала книги, полезные источники и нейросети, которые стоит попробовать в работе.',
      'Я люблю дизайн, и Гарри Поттера — поэтому этот номер посвящён и тому, и другому 💫'
    ],
    media: {
      screen: { type: 'video', src: 'images/advent/issue-04/screen.mp4', poster: 'images/advent/issue-04/screen-poster.jpg', ratio: '20/13', label: 'Номер «Учишься балету, Поттер?» с моими рекомендациями', path: 'images/advent/issue-04/screen.mp4' }
    }
  },
  {
    id: 'issue-05',
    num: '05',
    door: 'Тест',
    category: 'Интерактивный тест',
    title: 'Expecto Patronum!',
    layout: 'patronus',
    body: [
      'Какой декабрь без капельки магии? В пятом выпуске я придумала тест «Какой у тебя Патронус?». Участник отвечал на вопросы в созданном мной Telegram-боте, получал ссылку и открывал свой результат в Figma.',
      'Особенное внимание я уделила визуалам: с помощью генеративного ИИ подготовила выразительные 3D-образы магических животных. Мне хотелось, чтобы результат ощущался как маленький персональный подарок.'
    ],
    media: {
      /* Фоновое видео с драконом (отражено по горизонтали в CSS) */
      bg: { src: 'images/advent/issue-05/dragon-bg.mp4', poster: 'images/advent/issue-05/dragon-bg-poster.jpg' },
      video: { type: 'video', src: 'images/advent/issue-05/bot.mp4', poster: 'images/advent/issue-05/bot-poster.jpg', ratio: '720/1564', autoplay: true, label: 'Запись Telegram-бота «Какой у тебя Патронус?»', path: 'images/advent/issue-05/bot.mp4' },
      /* Сколько Патронусов было — добавьте столько элементов, сколько в исходнике */
      gallery: [
        { type: 'image', src: 'images/advent/issue-05/patronus-1-poster.jpg', ratio: '7/5', label: 'Патронус: дракон венгерский хвосторог', path: 'images/advent/issue-05/patronus-1-poster.jpg' },
        { type: 'image', src: 'images/advent/issue-05/patronus-deer.jpg', ratio: '7/5', label: 'Патронус: дикий олень', path: 'images/advent/issue-05/patronus-deer.jpg' },
        { type: 'image', src: 'images/advent/issue-05/patronus-hippogriff.jpg', ratio: '7/5', label: 'Патронус: гиппогриф', path: 'images/advent/issue-05/patronus-hippogriff.jpg' },
        { type: 'image', src: 'images/advent/issue-05/patronus-phoenix.jpg', ratio: '7/5', label: 'Патронус: феникс', path: 'images/advent/issue-05/patronus-phoenix.jpg' }
      ]
    }
  },
  {
    id: 'issue-06',
    num: '06',
    door: 'Подборка',
    category: 'Новогодняя подборка',
    title: 'Подари себе сам',
    layout: 'gifts',
    body: [
      'Шестой выпуск посвятила выбору подарков. Я собрала интересные вещи для дизайнеров на разные бюджеты — от небольших приятных покупок до более серьёзных.',
      'Иногда лучший повод порадовать себя — просто завершение насыщенного рабочего года.'
    ],
    media: {
      screen: { type: 'video', src: 'images/advent/issue-06/screen.mp4', poster: 'images/advent/issue-06/screen-poster.jpg', ratio: '20/13', label: 'Номер с подарками для дизайнеров', path: 'images/advent/issue-06/screen.mp4' }
    }
  },
  {
    id: 'issue-07',
    num: '07',
    door: 'Интерактив',
    category: 'Интерактив',
    title: 'Ёлочка, гори!',
    layout: 'tree',
    body: [
      'Последний выпуск я хотела сделать максимально уютным. Никаких тестов или полезных статей — только цифровая ёлка, подготовленные игрушки и возможность загадать желание.',
      'Каждый мог самостоятельно украсить ёлочку в Figma и ненадолго вернуться в детство.'
    ],
    media: {
      screen: { type: 'video', src: 'images/advent/issue-07/screen.mp4', poster: 'images/advent/issue-07/screen-poster.jpg', ratio: '20/13', label: 'Запись экрана: украшение ёлки в Figma', path: 'images/advent/issue-07/screen.mp4' }
    }
  }
];

/* Медиа остальных разделов */
window.ADVENT_MEDIA = {
  /* Реальные отзывы коллег (без личных данных): { text, role } */
  feedback: []
};
