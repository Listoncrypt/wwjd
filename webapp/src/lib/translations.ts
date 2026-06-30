export type Language = 'en' | 'fr' | 'es' | 'ig' | 'yo';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Francais' },
  { code: 'es', name: 'Spanish', nativeName: 'Espanol' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yoruba' },
];

export type TranslationKey =
  | 'title'
  | 'subtitle'
  | 'yourQuestion'
  | 'relatedScripture'
  | 'askPlaceholder'
  | 'seekingWisdom'
  | 'backToHome'
  | 'askAnother'
  | 'loading'
  | 'errorLoading'
  | 'tryAgain'
  | 'holyScripture'
  | 'exampleQuestions'
  | 'orTryThese'
  | 'pressEnter'
  | 'footerText'
  | 'noReference'
  | 'askQuestion'
  | 'returnHome'
  | 'backToQuestions'
  | 'theWordOfGod'
  | 'psalmQuote'
  | 'psalmRef'
  | 'share'
  | 'save'
  | 'saved'
  | 'listen'
  | 'favorites'
  | 'noFavorites'
  | 'verseOfTheDay'
  | 'quickTopics'
  | 'quickTopic1'
  | 'quickTopic2'
  | 'quickTopic3'
  | 'quickTopic4';

type TranslationValue = string | string[];

type Translations = {
  [key in Language]: {
    [k in TranslationKey]: TranslationValue;
  };
};

export const translations: Translations = {
  en: {
    title: "What Would Jesus Do?",
    subtitle: "Ask any question about life, faith, relationships, or challenges. Receive wisdom inspired by Jesus's teachings.",
    yourQuestion: "Your question",
    relatedScripture: "Related Scripture",
    askPlaceholder: "Ask a question about life, relationships, faith, or any challenge you're facing...",
    seekingWisdom: "Seeking wisdom",
    backToHome: "Back to Home",
    askAnother: "Ask Another Question",
    loading: "Loading scripture...",
    errorLoading: "Unable to load verse",
    tryAgain: "Try Again",
    holyScripture: "Holy Scripture",
    exampleQuestions: [
      "How do I forgive someone who hurt me deeply?",
      "What does Jesus say about anxiety and worry?",
      "How should I treat my enemies?",
      "What is the meaning of true love?"
    ],
    orTryThese: "Or try one of these questions",
    pressEnter: "Press Enter to submit or Shift+Enter for a new line",
    footerText: "Answers are inspired by biblical teachings and the example of Christ",
    noReference: "No scripture reference provided.",
    askQuestion: "Ask a Question",
    returnHome: "Return Home",
    backToQuestions: "Back to Questions",
    theWordOfGod: "The Word of God",
    psalmQuote: "Thy word is a lamp unto my feet, and a light unto my path.",
    psalmRef: "Psalm 119:105",
    share: "Share",
    save: "Save to Favorites",
    saved: "Saved!",
    listen: "Listen",
    favorites: "Favorites",
    noFavorites: "No saved answers yet. Tap the heart on an answer to save it here.",
    verseOfTheDay: "Verse of the Day",
    quickTopics: "Quick Topics",
    quickTopic1: "Anxiety & Worry",
    quickTopic2: "Forgiveness",
    quickTopic3: "Finding Direction",
    quickTopic4: "Relationships"
  },
  fr: {
    title: "Que Ferait Jesus?",
    subtitle: "Posez n'importe quelle question sur la vie, la foi, les relations ou les defis. Recevez la sagesse inspiree des enseignements de Jesus.",
    yourQuestion: "Votre question",
    relatedScripture: "Ecritures Connexes",
    askPlaceholder: "Posez une question sur la vie, les relations, la foi ou tout defi que vous rencontrez...",
    seekingWisdom: "Recherche de sagesse",
    backToHome: "Retour a l'Accueil",
    askAnother: "Poser une Autre Question",
    loading: "Chargement des ecritures...",
    errorLoading: "Impossible de charger le verset",
    tryAgain: "Reessayer",
    holyScripture: "Sainte Ecriture",
    exampleQuestions: [
      "Comment pardonner a quelqu'un qui m'a profondement blesse?",
      "Que dit Jesus sur l'anxiete et l'inquietude?",
      "Comment devrais-je traiter mes ennemis?",
      "Quel est le sens du vrai amour?"
    ],
    orTryThese: "Ou essayez une de ces questions",
    pressEnter: "Appuyez sur Entree pour soumettre ou Maj+Entree pour une nouvelle ligne",
    footerText: "Les reponses sont inspirees par les enseignements bibliques et l'exemple du Christ",
    noReference: "Aucune reference biblique fournie.",
    askQuestion: "Poser une Question",
    returnHome: "Retour a l'Accueil",
    backToQuestions: "Retour aux Questions",
    theWordOfGod: "La Parole de Dieu",
    psalmQuote: "Ta parole est une lampe a mes pieds et une lumiere sur mon sentier.",
    psalmRef: "Psaume 119:105",
    share: "Partager",
    save: "Sauvegarder",
    saved: "Sauvegardé!",
    listen: "Ecouter",
    favorites: "Favoris",
    noFavorites: "Aucune reponse sauvegardee. Cliquez sur le coeur pour sauvegarder.",
    verseOfTheDay: "Verset du Jour",
    quickTopics: "Sujets Rapides",
    quickTopic1: "Anxiete",
    quickTopic2: "Pardon",
    quickTopic3: "Direction",
    quickTopic4: "Relations"
  },
  es: {
    title: "Que Haria Jesus?",
    subtitle: "Haz cualquier pregunta sobre la vida, la fe, las relaciones o los desafios. Recibe sabiduria inspirada en las ensenanzas de Jesus.",
    yourQuestion: "Tu pregunta",
    relatedScripture: "Escrituras Relacionadas",
    askPlaceholder: "Haz una pregunta sobre la vida, las relaciones, la fe o cualquier desafio que enfrentes...",
    seekingWisdom: "Buscando sabiduria",
    backToHome: "Volver al Inicio",
    askAnother: "Hacer Otra Pregunta",
    loading: "Cargando escrituras...",
    errorLoading: "No se pudo cargar el versiculo",
    tryAgain: "Intentar de Nuevo",
    holyScripture: "Sagrada Escritura",
    exampleQuestions: [
      "Como perdono a alguien que me hirio profundamente?",
      "Que dice Jesus sobre la ansiedad y la preocupacion?",
      "Como debo tratar a mis enemigos?",
      "Cual es el significado del amor verdadero?"
    ],
    orTryThese: "O prueba una de estas preguntas",
    pressEnter: "Presiona Enter para enviar o Shift+Enter para nueva linea",
    footerText: "Las respuestas estan inspiradas en las ensenanzas biblicas y el ejemplo de Cristo",
    noReference: "No se proporciono referencia de escritura.",
    askQuestion: "Hacer una Pregunta",
    returnHome: "Volver al Inicio",
    backToQuestions: "Volver a las Preguntas",
    theWordOfGod: "La Palabra de Dios",
    psalmQuote: "Tu palabra es una lampara a mis pies y una luz en mi camino.",
    psalmRef: "Salmo 119:105",
    share: "Compartir",
    save: "Guardar",
    saved: "Guardado!",
    listen: "Escuchar",
    favorites: "Favoritos",
    noFavorites: "Aún no hay respuestas guardadas. Toca el corazón para guardar.",
    verseOfTheDay: "Versículo del Día",
    quickTopics: "Temas Rápidos",
    quickTopic1: "Ansiedad",
    quickTopic2: "Perdón",
    quickTopic3: "Dirección",
    quickTopic4: "Relaciones"
  },
  ig: {
    title: "Gini Ka Jizos Ga-Eme?",
    subtitle: "Juo ajuju o bula gbasara ndu, okwukwe, mmekoriita, ma o bu nsogbu. Nata amamihe sitere na nkuzi Jizos.",
    yourQuestion: "Ajuju gi",
    relatedScripture: "Akwukwo Nso Metutara",
    askPlaceholder: "Juo ajuju gbasara ndu, mmekoriita, okwukwe, ma o bu nsogbu o bula i na-eche...",
    seekingWisdom: "Na-acho amamihe",
    backToHome: "Laghachi n'Ulo",
    askAnother: "Juo Ajuju Ozo",
    loading: "Na-ebugo akwukwo nso...",
    errorLoading: "Enweghi ike ibunye amaokwu",
    tryAgain: "Gbalia Ozo",
    holyScripture: "Akwukwo Nso",
    exampleQuestions: [
      "Kedu ka m ga-esi gbaghara onye meruru m ahu nke ukwuu?",
      "Gini ka Jizos kwuru gbasara nchegbu na nsogbu?",
      "Kedu ka m kwesiri isi mesoo ndi iro m?",
      "Gini bu nghota nke ihunanya n'ezie?"
    ],
    orTryThese: "Ma o bu nwalee otu n'ime ajuju ndi a",
    pressEnter: "Pịa Enter iji zipu ma o bu Shift+Enter maka ahiri ohuru",
    footerText: "Aziza bu ihe nkuzi Baịbụl na omume Kraịst kpalitere",
    noReference: "Enyeghi akwukwo nso.",
    askQuestion: "Juo Ajuju",
    returnHome: "Laghachi n'Ulo",
    backToQuestions: "Laghachi na Ajuju",
    theWordOfGod: "Okwu Chineke",
    psalmQuote: "Okwu gi bu oriọna nye ukwu m, na ìhè n'uzo m.",
    psalmRef: "Abu Oma 119:105",
    share: "Kekọrịta",
    save: "Chekwaa",
    saved: "Echekwara!",
    listen: "Gee nti",
    favorites: "Ndi ọkacha mmasị",
    noFavorites: "Enweghi azịza echekwara. Pịa obi iji chekwaa ya.",
    verseOfTheDay: "Amaokwu nke Ubochi",
    quickTopics: "Isiokwu Ngwa Ngwa",
    quickTopic1: "Nchegbu",
    quickTopic2: "Mgbaghara",
    quickTopic3: "Uzo",
    quickTopic4: "Mmekọrịta"
  },
  yo: {
    title: "Ki Ni Jesu Yoo Se?",
    subtitle: "Bi ibeere eyikeyi nipa igbesi aye, igbagbo, ibatan, tabi awon italaya. Gba ogbon ti o ni itara lati inu eko Jesu.",
    yourQuestion: "Ibeere re",
    relatedScripture: "Iwe Mimo Ti O Jomo",
    askPlaceholder: "Bi ibeere nipa igbesi aye, ibatan, igbagbo, tabi italaya eyikeyi ti o n koju...",
    seekingWisdom: "N wa ogbon",
    backToHome: "Pada si Ile",
    askAnother: "Bi Ibeere Miran",
    loading: "N gba iwe mimo...",
    errorLoading: "Ko le gba ese naa",
    tryAgain: "Gbiyanju Leekansi",
    holyScripture: "Iwe Mimo",
    exampleQuestions: [
      "Bawo ni mo se le dariji enikan ti o se mi ni ipalara jinna?",
      "Kini Jesu so nipa aibale ati aniyan?",
      "Bawo ni mo se ye ki n toju awon ota mi?",
      "Kini itumọ ife otito?"
    ],
    orTryThese: "Tabi gbiyanju ọkan ninu awọn ibeere wọnyi",
    pressEnter: "Tẹ Enter lati fi silẹ tabi Shift+Enter fun ila titun",
    footerText: "Awọn idahun jẹ atilẹyin nipasẹ awọn ẹkọ Bibeli ati apẹẹrẹ Kristi",
    noReference: "Ko si itọkasi iwe-mimọ ti a pese.",
    askQuestion: "Bi Ibeere",
    returnHome: "Pada si Ile",
    backToQuestions: "Pada si Awọn Ibeere",
    theWordOfGod: "Oro Olorun",
    psalmQuote: "Oro re ni fitila fun ese mi, ati imole si ona mi.",
    psalmRef: "Orin Dafidi 119:105",
    share: "Pin",
    save: "Fi pamọ",
    saved: "O ti fi pamọ!",
    listen: "Gbọ",
    favorites: "Awọn Ayanfẹ",
    noFavorites: "Ko si awọn idahun ti a fi pamọ sibẹsibẹ. Tẹ ọkan lati fi pamọ.",
    verseOfTheDay: "Ẹsẹ ti Ọjọ",
    quickTopics: "Awọn Koko-ọrọ Kia",
    quickTopic1: "Aibalẹ",
    quickTopic2: "Idariji",
    quickTopic3: "Itọsọna",
    quickTopic4: "Ibasepo"
  }
};

export function getTranslation(language: Language, key: TranslationKey): TranslationValue {
  return translations[language][key];
}

export function t(language: Language, key: TranslationKey): string {
  const value = translations[language][key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export function tArray(language: Language, key: TranslationKey): string[] {
  const value = translations[language][key];
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}
