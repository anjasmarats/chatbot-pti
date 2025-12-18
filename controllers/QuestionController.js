import supabase from "../supabase.js";

export const sendQuestion = async(req,res) => {
    try {
        if (!req.body || !req.body.question || !req.body.answer) {
            console.error("error sendQuestion data tidak lengkap\nreq.body",req.body,"\nreq.body.question",req.body.question,"\nreq.body.answer",req.body.answer);
            return res.status(400).json({
                message:"Error"
            });
        }

        const {data,error} = await supabase
            .from("data")
            .insert([{
                question:req.body.question,
                answer:req.body.answer
            }])
            .select();

        if (error) {
            console.error("error insert data question server supabase\nerror",error);
            return res.status(500).json({
                message:"Error"
            });
        }

        if (data.length===0) {
            console.error("error data.length sendQuestion server supabase\ndata",data);
            return res.status(500).json({
                message:"Error"
            });
        }

        return res.status(200).json()
    } catch (error) {
        console("error catch senQuestion\nerror",error);
        return res.status(500).json();
    }
}

export const allQuestions = async (req,res) => {
    try {
        const {error,data} = await supabase
            .from("data")
            .select("*");

        if (error) {
            console.error("error allQuestions server supabase\nerror",error);
            return res.status(500).json({
                message:"Error"
            });
        }

        return res.status(200).json({
            data
        })
    } catch (error) {
        console.error("error catch allQuestions\nerror",error);
        return res.status(500).json({
            message:"Error"
        });
    }
}