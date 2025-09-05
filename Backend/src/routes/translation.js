import express from "express";
import multer from "multer";
import fs from "fs";
import { transcribeAudio, translateText , textToSpeech} from "../functions/Translation.js";

const router = express.Router();
// Ensure folder exists
fs.mkdirSync("uploads/input_audios", { recursive: true });

const upload = multer({ dest: "uploads/input_audios" });

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const { from, to } = req.body;
    console.log("to and from",to,from);

    // 🎤 Step 1: Transcribe (auto detect lang)
    const transcription = await transcribeAudio(req.file.path);
    const originalText = transcription.text;
    let detectedLang = transcription.language_code || from; // fallback

    console.log("📝 Detected language (ElevenLabs):", detectedLang);

    // 🌍 Language code mapping: ElevenLabs -> LibreTranslate
const langMap = {
  eng: "en",   // English
  spa: "es",   // Spanish
  fra: "fr",   // French
  deu: "de",   // German
  ita: "it",   // Italian
  por: "pt",   // Portuguese
  jpn: "ja",   // Japanese
  kor: "ko",   // Korean
  zho: "zh",   // Chinese
  ara: "ar",   // Arabic
  hin: "hi",   // Hindi
  urd: "ur",   // Urdu
  rus: "ru",   // Russian
  asm: "as",   // Assamese
  ben: "bn",   // Bengali
  guj: "gu",   // Gujarati
  kan: "kn",   // Kannada
  mal: "ml",   // Malayalam
  mar: "mr",   // Marathi
  nep: "ne",   // Nepali
  pan: "pa",   // Punjabi
  snd: "sd",   // Sindhi
  tam: "ta",   // Tamil
  tel: "te"    // Telugu
};

const MONGO_URI = "mongodb+srv://navedwadkar:Naved%40123@instagram.cbzhjlt.mongodb.net/SafarNama?retryWrites=true&w=majority&appName=Instagram";



    // Normalize language code
    const sourceLang = langMap[detectedLang] || "en";

        // ✅ Validation: Check if detected language matches either from or to
    if (!sourceLang || (sourceLang !== from && sourceLang !== to)) {
      fs.unlinkSync(req.file.path); // cleanup
      return res.status(400).json({
        error:
          "The detected language does not match your selected 'from' or 'to' language. Please check the audio or your language selection.",
        detectedLang,
      });
    }

    // 🌍 Step 2: Decide target language (English <-> Hindi swap for now)
    let targetLang = sourceLang === from ? to : from;

    console.log(`🔄 Translation: ${sourceLang} → ${targetLang}`);

    // 🌍 Step 3: Translate
    const translatedText = await translateText(originalText,sourceLang, targetLang);

    // 🧹 Remove file
    fs.unlinkSync(req.file.path);

    // 🔊 Step 4: Convert translation into speech
    const translatedAudio = await textToSpeech(translatedText);

    // ✅ Step 5: Return result
    res.json({
      transcription: originalText,
      detectedLang: sourceLang,
      translatedText,
      translatedAudio: translatedAudio.toString("base64"),
    });
  } catch (err) {
    console.error("❌ Error:", err);
    fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Error processing audio" });
  }
});



export default router;
