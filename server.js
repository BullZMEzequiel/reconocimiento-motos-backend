import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Endpoint correcto PARA API KEY de AI STUDIO (imagenes soportadas)
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
  process.env.GEMINI_API_KEY;

// Ruta principal del backend
app.post("/analizar", async (req, res) => {
  try {
    const { imageBase64, prompt } = req.body;

    if (!imageBase64 || !prompt) {
      return res.status(400).json({ error: "Faltan parámetros." });
    }

    const googleRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64
                }
              },
              { text: prompt }
            ]
          }
        ]
      })
    });

    const data = await googleRes.json();
    return res.json(data);

  } catch (error) {
    console.error("Error backend:", error);
    res.status(500).json({ error: error.toString() });
  }
});

// Ruta debug (ELIMÍNALA cuando confirmemos que todo funciona)
app.get("/debug", (req, res) => {
  res.json({
    keyExists: !!process.env.GEMINI_API_KEY,
    keyLength: process.env.GEMINI_API_KEY?.length || 0
  });
});

// Render asigna el puerto automáticamente
app.listen(process.env.PORT || 3000, () =>
  console.log("Servidor backend ejecutándose en Render")
);

