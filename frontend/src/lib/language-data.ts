export type LanguagePhrase = {
  english: string;
  translation: string;
  say: string; // romanization / pronunciation guide
};

export type TeachableLanguage = {
  id: string;
  name: string;
  locale: string; // BCP-47 tag for speech synthesis
  hello: string;
  phrases: LanguagePhrase[];
};

export const LANGUAGES: TeachableLanguage[] = [
  {
    id: 'french',
    name: 'French',
    locale: 'fr-FR',
    hello: 'Bonjour!',
    phrases: [
      { english: 'Hello', translation: 'Bonjour', say: 'bon-ZHOOR' },
      { english: 'Thank you', translation: 'Merci', say: 'mehr-SEE' },
      { english: 'Please', translation: "S'il vous plaît", say: 'seel voo PLEH' },
      { english: 'Excuse me', translation: 'Excusez-moi', say: 'ex-koo-zay MWAH' },
      { english: 'How much is this?', translation: 'Combien ça coûte ?', say: 'kom-BYEN sa KOOT' },
      { english: 'Where is the airport?', translation: 'Où est l’aéroport ?', say: 'oo eh la-ay-ro-POR' },
      { english: 'I have a reservation', translation: 'J’ai une réservation', say: 'zhay oon ray-zair-va-SYON' },
      { english: 'The bill, please', translation: 'L’addition, s’il vous plaît', say: 'la-dee-SYON seel voo PLEH' },
      { english: 'Welcome to our hotel', translation: 'Bienvenue à notre hôtel', say: 'byen-ve-NOO ah notr oh-TEL' },
      { english: 'Goodbye', translation: 'Au revoir', say: 'oh ruh-VWAR' },
    ],
  },
  {
    id: 'spanish',
    name: 'Spanish',
    locale: 'es-ES',
    hello: '¡Hola!',
    phrases: [
      { english: 'Hello', translation: 'Hola', say: 'OH-la' },
      { english: 'Thank you', translation: 'Gracias', say: 'GRA-syas' },
      { english: 'Please', translation: 'Por favor', say: 'por fa-VOR' },
      { english: 'Excuse me', translation: 'Perdón', say: 'pair-DON' },
      { english: 'How much is this?', translation: '¿Cuánto cuesta?', say: 'KWAN-to KWES-ta' },
      { english: 'Where is the airport?', translation: '¿Dónde está el aeropuerto?', say: 'DON-deh es-TA el a-eh-ro-PWER-to' },
      { english: 'I have a reservation', translation: 'Tengo una reserva', say: 'TEN-go OO-na reh-SER-va' },
      { english: 'The bill, please', translation: 'La cuenta, por favor', say: 'la KWEN-ta por fa-VOR' },
      { english: 'Welcome to our hotel', translation: 'Bienvenido a nuestro hotel', say: 'byen-veh-NEE-do ah NWES-tro oh-TEL' },
      { english: 'Goodbye', translation: 'Adiós', say: 'ah-DYOS' },
    ],
  },
  {
    id: 'japanese',
    name: 'Japanese',
    locale: 'ja-JP',
    hello: 'こんにちは!',
    phrases: [
      { english: 'Hello', translation: 'こんにちは', say: 'kon-nee-chee-WAH (Konnichiwa)' },
      { english: 'Thank you', translation: 'ありがとうございます', say: 'ah-ree-GAH-toh go-zai-mas (Arigatō gozaimasu)' },
      { english: 'Please', translation: 'お願いします', say: 'oh-neh-GAI-shee-mas (Onegaishimasu)' },
      { english: 'Excuse me', translation: 'すみません', say: 'soo-mee-mah-SEN (Sumimasen)' },
      { english: 'How much is this?', translation: 'いくらですか', say: 'ee-KOO-ra des-KA (Ikura desu ka)' },
      { english: 'Where is the airport?', translation: '空港はどこですか', say: 'KOO-koh wa DO-ko des-KA (Kūkō wa doko desu ka)' },
      { english: 'I have a reservation', translation: '予約があります', say: 'yo-YA-koo ga ah-ree-MAS (Yoyaku ga arimasu)' },
      { english: 'The bill, please', translation: 'お会計お願いします', say: 'oh-kai-KEH oh-neh-GAI-shee-mas (Okaikei onegaishimasu)' },
      { english: 'Welcome', translation: 'いらっしゃいませ', say: 'ee-rah-shai-mah-SEH (Irasshaimase)' },
      { english: 'Goodbye', translation: 'さようなら', say: 'sa-yoh-NA-ra (Sayōnara)' },
    ],
  },
  {
    id: 'korean',
    name: 'Korean',
    locale: 'ko-KR',
    hello: '안녕하세요!',
    phrases: [
      { english: 'Hello', translation: '안녕하세요', say: 'an-nyeong-ha-SEH-yo (Annyeonghaseyo)' },
      { english: 'Thank you', translation: '감사합니다', say: 'kam-sa-ham-NEE-da (Kamsahamnida)' },
      { english: 'Please', translation: '주세요', say: 'joo-SEH-yo (Juseyo)' },
      { english: 'Excuse me', translation: '실례합니다', say: 'shil-leh-ham-NEE-da (Sillyehamnida)' },
      { english: 'How much is this?', translation: '얼마예요?', say: 'eol-ma-YEH-yo (Eolmayeyo)' },
      { english: 'Where is the airport?', translation: '공항이 어디예요?', say: 'gong-hang-ee eo-dee-YEH-yo (Gonghang-i eodiyeyo)' },
      { english: 'I have a reservation', translation: '예약했어요', say: 'yeh-yak-HESS-eo-yo (Yeyakhaesseoyo)' },
      { english: 'The bill, please', translation: '계산서 주세요', say: 'gyeh-san-seo joo-SEH-yo (Gyesanseo juseyo)' },
      { english: 'Welcome', translation: '환영합니다', say: 'hwan-yeong-ham-NEE-da (Hwanyeonghamnida)' },
      { english: 'Goodbye', translation: '안녕히 가세요', say: 'an-nyeong-hee ga-SEH-yo (Annyeonghi gaseyo)' },
    ],
  },
  {
    id: 'mandarin',
    name: 'Mandarin Chinese',
    locale: 'zh-CN',
    hello: '你好!',
    phrases: [
      { english: 'Hello', translation: '你好', say: 'nee-HOW (Nǐ hǎo)' },
      { english: 'Thank you', translation: '谢谢', say: 'shyeh-shyeh (Xièxie)' },
      { english: 'Please', translation: '请', say: 'ching (Qǐng)' },
      { english: 'Excuse me', translation: '不好意思', say: 'boo-how-EE-si (Bù hǎoyìsi)' },
      { english: 'How much is this?', translation: '多少钱?', say: 'dwo-shao chyen (Duōshǎo qián)' },
      { english: 'Where is the airport?', translation: '机场在哪里?', say: 'jee-chang dzai na-lee (Jīchǎng zài nǎlǐ)' },
      { english: 'I have a reservation', translation: '我有预订', say: 'wo yo yoo-DING (Wǒ yǒu yùdìng)' },
      { english: 'The bill, please', translation: '买单', say: 'my-DAN (Mǎidān)' },
      { english: 'Welcome', translation: '欢迎光临', say: 'hwan-ying gwang-LIN (Huānyíng guānglín)' },
      { english: 'Goodbye', translation: '再见', say: 'dzai-JYEN (Zàijiàn)' },
    ],
  },
  {
    id: 'italian',
    name: 'Italian',
    locale: 'it-IT',
    hello: 'Ciao!',
    phrases: [
      { english: 'Hello', translation: 'Ciao', say: 'CHOW' },
      { english: 'Thank you', translation: 'Grazie', say: 'GRA-tsyeh' },
      { english: 'Please', translation: 'Per favore', say: 'pair fa-VO-reh' },
      { english: 'Excuse me', translation: 'Scusi', say: 'SKOO-zee' },
      { english: 'How much is this?', translation: 'Quanto costa?', say: 'KWAN-to KOS-ta' },
      { english: 'Where is the airport?', translation: "Dov'è l'aeroporto?", say: 'doh-VEH la-eh-ro-POR-to' },
      { english: 'I have a reservation', translation: 'Ho una prenotazione', say: 'oh OO-na preh-no-ta-TSYO-neh' },
      { english: 'The bill, please', translation: 'Il conto, per favore', say: 'eel KON-to pair fa-VO-reh' },
      { english: 'Welcome to our hotel', translation: 'Benvenuti nel nostro hotel', say: 'ben-veh-NOO-tee nel NOS-tro oh-TEL' },
      { english: 'Goodbye', translation: 'Arrivederci', say: 'ah-ree-veh-DAIR-chee' },
    ],
  },
];

let voicesCache: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    voicesCache = window.speechSynthesis.getVoices();
  };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function speakPhrase(text: string, locale: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.rate = 0.85;
  const voice =
    voicesCache.find((v) => v.lang === locale) ??
    voicesCache.find((v) => v.lang.startsWith(locale.split('-')[0]));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
  return true;
}
