import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Ensure environment variables are loaded
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Initialize Gemini safely, lazy initializing client where possible,
// but tracking key availability
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Scientific Analysis Endpoint using Gemini 3.5 Flash
app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(403).json({
        error: "A chave API do Gemini não foi configurada.",
        promptConfigurationNeeded: true,
        message: "Por favor, adicione sua GEMINI_API_KEY no menu de Configurações (Settings > Secrets) para ativar a inteligência analítica do oráculo.",
      });
    }

    const { params, metrics, stimType, amp, freq, customPrompt, chatHistory } = req.body;

    const systemContext = `
Você é o Oráculo Científico e Epistemólogo de Prisantemotria, um sistema analítico sênior de física teórica e filosofia de complexidade.
Sua missão é debater, justificar e provar a filosofia e o modelo físico-matemático de Prisantemotria v2.0 com base na simulação atual.

Sobre Prisantemotria:
- A teoria abandona misticismo ou psicologia de senso comum. É um modelo mecânico baseado no acoplamento entre as coordenadas físicas instantâneas S(t) e um campo de memória viscoelástica representado pela variável de histórico ΔF(t).
- Funciona como uma Equação Integrodiferencial de Langevin Geral (Generalized Langevin Equation): m*S'' + gamma*S' + V'(S) = E(t) + beta*ΔF
- A memória local dinâmica decai via tauH: tauH*ΔF' = -ΔF + alpha*S' + eta*S
- O Lagrangiano do sistema é estendido: L = 1/2 m S'^2 - V(S) + 1/2 m_H ΔF'^2 - U(ΔF) + beta S ΔF - gamma_H ΔF ΔF'
- Provamos o sistema através de 4 métricas rigorosas de falseamento:
  1. Φ (Índice de Historicidade): Mede se fornecer a memória ΔF melhora a predição estatística de próximo passo comparado a um baseline markoviano clássico puramente local.
  2. D(t) (Divergência de Clones Causal): Dois corpos idênticos soltos na MESMA coordenada S no presente divergem drasticamente devido à diferença histórica priming invisível de seu ΔF prévio, provando a causalidade não-local do tempo.
  3. k* (Embedding Dimension Mínimo): Dimensionamento de atrasos ARIMA lineares necessários para mimetizar o kernel viscoelástico. Se k* for alto (ex: >=3), indica irredução de complexidade de histórico.
  4. Área de Histerese (Loop de Perda): Quantifica a energia térmica viscoelástica dissipada no poço em ciclos repetitivos, mostrando histerese fásica típica de materiais polimétricos com memória residual.

Parâmetros Ativos do Sistema:
- Massa/Inércia (m): ${params?.m}
- Fricção Amortecimento (gamma): ${params?.gamma}
- Acoplamento de Memória (beta): ${params?.beta}
- Escala de Tempo de Memória (tau_H): ${params?.tauH}s
- Peso Impressão de Transição Abrupta (alpha): ${params?.alpha}
- Peso Impressão de Exposição Estática (eta): ${params?.eta}
- Tipo de Sinal de Excitação E(t): ${stimType} (Amplitude: ${amp}, Frequência: ${freq} Hz)
- Tipo de Poço V(S): ${params?.potential} (Altura da barreira: ${params?.V_height ?? 0})

Métricas de Desempenho Calculadas na Rodada Ativa:
- Índice de Historicidade Φ (Acréscimo de Info): ${(metrics?.phi * 100).toFixed(2)}%
- Divergência Máxima D_max (Clone Test): ${metrics?.cloneDivergence?.toFixed(4)} unidades
- Dimensão Mínima de Autoregressão k*: ${metrics?.kStar} lags (passos)
- Área de Histerese Observada: ${metrics?.hysteresisArea?.toFixed(4)} u.a.

Instruções para Resposta:
- Escreva de maneira profundamente acadêmica, científica e cativante em Português.
- Cruze diretamente os coeficientes numéricos ativos com as consequências físicas observadas.
- Faça paralelos elegantes usando o glossário de Prisantemotria (Trauma como potencial duplo, Hábito como poço de potencial de memória, etc.).
- Rejeite explicações místicas; em vez disso, apoie-se no formalismo variacional analítico, viscoelasticidade clássica e atratores de Langevin.
- Adote um tom de conselheiro científico e epistemólogo sênior que estimula a mente do usuário.
- Se o usuário fez uma pergunta direta ou mandou uma mensagem no Chat, responda essa pergunta mantendo todo o contexto científico e as equações em mente.
- Use markdown limpo. Escreva equações em notação de texto limpa clara.
`;

    const contents: any[] = [];
    
    // Build chat history context if available to maintain conversation
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add current user prompt
    const userPrompt = customPrompt 
      ? `Pergunta/Tema do Usuário: ${customPrompt}\n\nPor favor, responda de forma conectada ao estado físico atual citado no sistema.`
      : `Analise as métricas calculadas e dê sugestões epistemológicas de manipulação dos botões físicos para guiar o experimento a um regime de Historicidade Perfeita (GREENLIGHT), interpretando os resultados à luz de Euler-Lagrange.`;
    
    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction: systemContext,
        temperature: 0.7,
      }
    });

    return res.json({
      text: response.text,
      success: true,
    });
  } catch (error: any) {
    console.error("Gemini route error:", error);
    return res.status(500).json({
      error: "Ocorreu um erro ao processar o oráculo.",
      success: false,
      message: error.message || "Erro desconhecido durante a comunicação com o servidor Gemini."
    });
  }
});

// Serve frontend assets or mount Vite in dev mode
const setupServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Use Vite middleware
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PRISANTEMOTRIA BACKEND] Servidor operacional na porta ${PORT}`);
    console.log(`- Modo: ${process.env.NODE_ENV || 'development'}`);
  });
};

setupServer();
