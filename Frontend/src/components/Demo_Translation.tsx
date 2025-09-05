import axios from "axios";
import { useState, useRef } from "react";

export default function Translation() {
  const [result, setResult] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    let chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob, "input.webm");

      try {
        const res = await axios.post(
          "http://localhost:5000/api/v1/translate",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const data = res.data;
        console.log("Translation result:", data);
        setResult(data);

        // Play translated audio
        if (data.translatedAudio) {
          playBase64Audio(data.translatedAudio);
        }
      } catch (err) {
        console.error("❌ Translation API error:", err.response?.data || err);
      }
    };

    recorder.start();
    setRecording(true);
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const playBase64Audio = (base64Data) => {
    const audio = new Audio("data:audio/mp3;base64," + base64Data);
    audio.play();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎤 Hindi ⇄ English Translator</h1>
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}

      {result && (
        <div>
          <h2>Original:</h2>
          <p>{result.transcription}</p>

          <h2>Translated:</h2>
          <p>{result.translatedText}</p>
        </div>
      )}
    </div>
  );
}
