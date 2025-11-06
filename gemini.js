import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyCayFuJErUYoNbu8rTQElGpAZCWx3KynKU"

const genAI = new GoogleGenerativeAI(API_KEY)

export const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });