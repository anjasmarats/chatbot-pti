import supabase from "../supabase.js";

import chatbotData from '../chatbot-data.js';
import { model } from "../gemini.js";

// Simpan session chat (dalam production, gunakan database)
// const chatSessions = new Map();

export const message = async(req, res) => {
  // const { sessionId, message, optionId,feedback } = req.body;
  const question = req.body.question;
  const feedback = req.body.feedback;

  if (!question) {
    console.error("error message, data question diperlukan\nquestion",question);
    return res.status(400).json({
      message:"Error"
    });
  }
  
  let response;

  if (feedback) {
          const queryResult = await model.generateContent(`
          ${feedback}
          Analisis itu dalam bahasa indonesia formal dan baik serta berikan output analisisnya berdasarkan JSON :
          {
            "analytics":{
              "result":"....",
              "isContainPositive":
            }
          }
      `)
      const result = JSON.parse(queryResult.response.text())
      console.log(result.analytics)

      const { error:errFeedback } = await supabase.from("feedback").insert([{
        content: feedback,
        analysis: result.analytics.result,
        category: result.analytics.isContainPositive
      }]).select()

      if (errFeedback) {
        console.error("error insert database feedback",errFeedback)
        return res.status(500).json()
      }

      response = {
        message: "Masukkan anda telah kami proses. Terimakasih telah menggunakan chatbot ini. Ada lagi yang bisa kami bantu",
        options: chatbotData.welcome.options
      };
  } else {
    const {data,error} = await supabase
      .from('data')
      .select("*")
      .eq("question",question)
  
    if (error) {
      console.error("error query data question ke database supabase\nerror",error);
      return res.status(500).json({
        message:"Error"
      });
    }
  
    if (data.length===0) {
      console.error("error message data kosong\ndata",data);
      return res.status(400).json({
        message:"Error"
      });
    }

    response = {
        message: data[0],
        options: chatbotData.welcome.options
      };
  }

  // // Simpan history bot
  // if (response.message) {
  //   session.history.push({
  //     type: 'bot',
  //     content: response.message,
  //     timestamp: new Date().toISOString()
  //   });
  // }
  
  return res.json({
    response
  });
}

export const startChat = async(req, res) => {  
  try {
    const {data,error} = await supabase
      .from("data")
      .select("*");

    if (error) {
      console.error("error start chat query data question ke database supabase\nerror",error);
      return res.status(500).json({
        message:"Error"
      });
    }

    if (data.length===0) {
      console.error("error start chat data kosong\ndata",data);
      return res.status(400).json({
        message:"Error"
      });
    }

    return res.status(200).json({
      options:data
    })
  } catch (error) {
    
  }
}