import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyCUt934PSIt19DmdO8A3SO_ySBJaSba9MY"

const genAI = new GoogleGenerativeAI(API_KEY)

export const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });