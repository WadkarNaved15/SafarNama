import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
import qs from "qs";
import FormData from "form-data";
import translate from 'google-translate-api-x';
dotenv.config();

const ELEVEN_KEY = process.env.ELEVEN_LABS;
console.log("🔑 ElevenLabs Key:", ELEVEN_KEY ? "Found" : "Not Found");

// 🎤 Transcribe audio (Deepgram)
export async function transcribeAudio(filePath) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath)); // 👈 audio file
    formData.append("model_id", "scribe_v1");               // 👈 required
    formData.append("tag_audio_events", "true");            // optional
    formData.append("diarize", "true");                     // optional

    const res = await axios.post(
      "https://api.elevenlabs.io/v1/speech-to-text",
      formData,
      {
        headers: {
          "xi-api-key": ELEVEN_KEY,
          ...formData.getHeaders(), // 👈 important: sets correct multipart boundaries
        },
      }
    );

    console.log("🎤 Transcription:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ STT Error:", err.response?.data || err.message);
    throw err;
  }
}
// 🌍 Translate text (LibreTranslate)
export async function translateText(text,sourceLang, targetLang) {
  try {
    const res = await translate(text, { from:sourceLang, to: targetLang, autoCorrect: true});
    console.log("🌍 Translated:", res.text);
    return res.text;
  } catch (err) {
    console.error("❌ Google Translate Error:", err);
    throw err;
  }
}


export async function textToSpeech(text, voiceId = "EXAVITQu4vr4xnSDxMaL") {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    }
  );

  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer);
}

