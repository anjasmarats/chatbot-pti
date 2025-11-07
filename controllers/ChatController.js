import supabase from "../supabase.js";

import chatbotData from '../chatbot-data.js';
import { model } from "../gemini.js";

// Simpan session chat (dalam production, gunakan database)
const chatSessions = new Map();

export const message = async(req, res) => {
  const { sessionId, message, optionId,feedback } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID diperlukan' });
  }
  
  // Cek session
  const session = chatSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session tidak ditemukan' });
  }
  
  let response;
  
  // Jika memilih opsi
  if (optionId !== undefined) {
    if (optionId === 'main') {
      // Kembali ke menu utama
      response = {
        message: chatbotData.welcome.message,
        options: chatbotData.welcome.options
      };
      session.currentStep = 'welcome';
    } else if (chatbotData.responses[optionId]) {
      const selectedOption = chatbotData.responses[optionId];
      
      if (selectedOption.type === 'input') {
        // Menunggu input user
        session.currentStep = selectedOption.next;
        response = {
          message: selectedOption.message,
          requiresInput: true,
          inputType: selectedOption.type
        };
      } else {
        // Langsung memberikan respons
        response = {
          message: selectedOption.message,
          options: chatbotData.welcome.options
        };
        session.currentStep = optionId;
      }
    } else {
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

        const { error } = await supabase.from("feedback").insert([{
          content: feedback,
          analysis: result.analytics.result,
          category: result.analytics.isContainPositive
        }]).select()

        if (error) {
          console.error("error insert database",error)
          return res.status(500).json()
        }

        // await Feedback.create({
        //   content: message,
        //   analysis: result.analytics.result,
        //   category: result.analytics.isContainPositive
        // })
        response = {
          message: "Masukkan anda telah kami proses. Terimakasih telah menggunakan chatbot ini. Ada lagi yang bisa kami bantu",
          options: chatbotData.welcome.options
        };
      } else {
        console.log("message",message)
        if (!message) {
          return res.status(400).json({
            message:"Bad Request"
          })
        } else {
          const {data: knowledge,error} = await supabase
            .from("knowledge")
            .select("answers")
            .ilike("key",`%${message}%`)

            console.log("knowledge",knowledge)

          if (error) {
            console.error(`error query knowledge ${message} di database\nerror`,error)
            return res.status(500).json({
              message:"Error"
            })
          }

          if (knowledge.length===0) {
            response = {
              message: "Mohon maaf, data yang anda minta tidak ditemukan. Kami akan mencoba mempertimbangakn untuk mengupdate data informasi kami. Terimakasih telah menggunakan chatbot. Ada lagi yang bisa kami bantu?",
              options: chatbotData.welcome.options
            }
  
            return res.status(200).json(response)
          }

          let result = ""

          for (let i = 0; i < knowledge.length; i++) {
            result += knowledge[i].answers+" ";
          }

            response = {
              message: `${result} Ada lagi yang bisa kami bantu?`,
              options: chatbotData.welcome.options
            }
        }
      }
    }
  } 
  // // Jika mengirim pesan teks
  // else if (message) {
  //   if (session.currentStep && session.currentStep !== 'welcome') {
  //     // Proses input khusus (seperti nomor order)
  //     const processedResponse = chatbotData.processInput(session.currentStep, message);
  //     response = {
  //       message: processedResponse.message,
  //       options: processedResponse.options
  //     };
  //     session.currentStep = 'welcome';
  //   } else {
  //     // Respons untuk pesan bebas
  //     response = {
  //       message: "Terima kasih atas pesan Anda! Untuk bantuan lebih cepat, silakan pilih salah satu opsi di bawah:",
  //       options: chatbotData.welcome.options
  //     };
  //   }
    
  //   // Simpan history
  //   session.history.push({
  //     type: 'user',
  //     content: message,
  //     timestamp: new Date().toISOString()
  //   });
  // } else {
  //   response = {
  //     message: "Silakan pilih opsi atau ketik pesan Anda.",
  //     options: chatbotData.welcome.options
  //   };
  // }
  
  // Simpan history bot
  if (response.message) {
    session.history.push({
      type: 'bot',
      content: response.message,
      timestamp: new Date().toISOString()
    });
  }
  
  return res.json(response);
}

export const startChat = (req, res) => {
  const { sessionId } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID diperlukan' });
  }
  
  // Inisialisasi session baru
  chatSessions.set(sessionId, {
    currentStep: 'welcome',
    history: []
  });
  
  return res.json({
    message: chatbotData.welcome.message,
    options: chatbotData.welcome.options,
    sessionId: sessionId
  });
}