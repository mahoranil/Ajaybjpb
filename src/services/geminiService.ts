import { GoogleGenAI, Type } from "@google/genai";

// User explicitly requested to hardcode this key for Netlify deployment
const apiKey = "AIzaSyDmO7cg3THok8VKzCxLen5ov-_QUzcULpw";
const ai = new GoogleGenAI({ apiKey });

export async function generateMCQs(
  subject: string,
  topic: string,
  count: number,
  language: 'Hindi' | 'English'
) {
  try {
    const model = "gemini-3-flash-preview";
    
    const response = await ai.models.generateContent({
      model,
      contents: `Generate ${count} high-quality MCQs for UPSC/PCS exam preparation in ${language}. 
      Subject: ${subject}
      Topic: ${topic}
      
      Ensure the questions are challenging and relevant to the current UPSC pattern.
      Provide the response in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Exactly 4 options"
              },
              correctAnswer: { 
                type: Type.INTEGER, 
                description: "Index of the correct option (0-3)" 
              },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    if (!response.text) throw new Error("Empty response from AI");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating MCQs:", error);
    throw new Error("Failed to generate MCQs. Please try again or change the topic.");
  }
}

export async function evaluateMainsAnswer(
  subject: string,
  question: string,
  answer: string,
  totalMarks: number,
  language: 'Hindi' | 'English',
  imageData?: { data: string; mimeType: string }
) {
  try {
    const model = "gemini-3-flash-preview";

    const parts: any[] = [
      {
        text: `Evaluate the following UPSC Mains answer in ${language}.
        Subject: ${subject}
        Question: ${question}
        Answer Text: ${answer || "See attached image"}
        Total Marks: ${totalMarks}
        
        Provide a detailed evaluation including:
        1. Marks obtained out of ${totalMarks}.
        2. Strengths of the answer.
        3. Weaknesses/Mistakes.
        4. Suggestions for improvement.
        
        Provide the response in JSON format.`
      }
    ];

    if (imageData) {
      parts.push({
        inlineData: {
          data: imageData.data,
          mimeType: imageData.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marks: { type: Type.INTEGER },
            feedback: { type: Type.STRING, description: "Detailed feedback with strengths, weaknesses, and improvements" }
          },
          required: ["marks", "feedback"]
        }
      }
    });

    if (!response.text) throw new Error("Empty response from AI");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error evaluating Mains answer:", error);
    throw new Error("Failed to evaluate answer. Please try again.");
  }
}

export async function getDailyCurrentAffairs(language: 'Hindi' | 'English') {
  try {
    const model = "gemini-3-flash-preview";
    const newsApiKey = "7c4027b1f8b90a8d4b1ecbcc624c6975";
    let newsContext = "";

    // Try fetching real-time news using the provided API key
    try {
      // Trying GNews API format first
      const gnewsRes = await fetch(`https://gnews.io/api/v4/top-headlines?category=nation&country=in&max=5&apikey=${newsApiKey}`);
      if (gnewsRes.ok) {
        const data = await gnewsRes.json();
        if (data.articles && data.articles.length > 0) {
          newsContext = data.articles.map((a: any, i: number) => `${i + 1}. Title: ${a.title}\nDescription: ${a.description}`).join('\n\n');
        }
      } else {
        // Fallback to NewsData.io format if GNews fails
        const newsdataRes = await fetch(`https://newsdata.io/api/1/news?apikey=${newsApiKey}&country=in&category=politics,top`);
        if (newsdataRes.ok) {
          const data = await newsdataRes.json();
          if (data.results && data.results.length > 0) {
            newsContext = data.results.map((a: any, i: number) => `${i + 1}. Title: ${a.title}\nDescription: ${a.description}`).join('\n\n');
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch from News API, falling back to Gemini's internal knowledge.", e);
    }
    
    let prompt = `Provide a comprehensive daily current affairs analysis for UPSC preparation in ${language}.
      Focus on 3 major news items today. For each item, provide:
      1. Title
      2. Context/Background
      3. Key Analysis (UPSC relevance)
      4. Location/Map relevance (if any, e.g., "Places in News")
      
      Return the response as a JSON array of objects.`;

    if (newsContext) {
      prompt = `Based on the following latest news articles:\n\n${newsContext}\n\n` + prompt;
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              context: { type: Type.STRING },
              analysis: { type: Type.STRING },
              locationRelevance: { type: Type.STRING }
            },
            required: ["title", "context", "analysis", "locationRelevance"]
          }
        }
      }
    });

    if (!response.text) throw new Error("Empty response from AI");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error fetching current affairs:", error);
    throw new Error("Failed to fetch current affairs. Please try again later.");
  }
}
