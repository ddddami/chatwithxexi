import { OpenAIApi, Configuration } from "openai-edge";
import { GoogleGenerativeAI } from "@google/generative-ai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI API KEY IS REQUIRED");
}
export const openai = new OpenAIApi(config);
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function useGeminiApi(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    // console.log("Embeddings", embedding);
    return embedding.values;
  } catch (error) {
    throw error;
  }
}

async function useOpenAi(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = await response.json();
    console.log("Embeddings: ", result.data[0].embedding);
    return result.data[0].embedding as number[];
  } catch (error) {
    throw error;
  }
}

export async function getEmbeddings(text: string) {
  try {
    // const response = await openai.createEmbedding({
    //   model: "text-embedding-ada-002",
    //   input: text.replace(/\n/g, " "),
    // });
    // const result = await response.json();
    // console.log(result);
    // console.log(result.data[0].embedding);
    // return result.data[0].embedding as number[];

    // Open AI
    // const embeddingResult = await useOpenAi(text);
    // console.log("Embedding Result: ", embeddingResult);
    // return embeddingResult;
    // console.log("Embedding result: ", embeddingResult);

    // Gemini AI
    const embeddingResult = await useGeminiApi(text);
    return embeddingResult;
  } catch (error: any) {
    console.log("Error calling openai embeddings api", error);
    throw error;
  }
}
