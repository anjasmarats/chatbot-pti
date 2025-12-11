// const { signToken } = require("./manageSession")
import supabase from "../supabase.js"

import { signToken } from '../manageSession.js'

export const Login =async(req,res)=>{
    try {
        if (!req.body || !req.body.username || !req.body.password) {
            console.error("data login tidak lengkap, req.body\n",req.body)
            return res.status(400).json()
        }

        const {data: mahasiswa, error:errMhs} = await supabase.from("mahasiswa")
        .select("*")
        .eq("username",req.body.username)
        .eq("password",req.body.password)
        .single()
        
        const {data: dosen, error: errDosen} = await supabase.from("dosen")
        .select("*")
        .eq("username",req.body.username)
        .eq("password",req.body.password)
        .single()

        if (errMhs && errMhs.code!=="PGRST116") {
            console.error("error mahasiswa login supabase",errMhs)
            return res.status(500).json()
        }
        
        if (errDosen && errDosen.code!=="PGRST116") {
            console.error("error dosen login supabase",errDosen)
            return res.status(500).json()
        }

        if ((errMhs && errMhs.code ==='PGRST116') && (errDosen && errDosen.code ==='PGRST116')) {
            console.error("error query database login \nusername",req.body.username,"\npassword",req.body.password,"\nmahasiswa",mahasiswa,"\ndosen",dosen)
            return res.status(404).json()
        }

        // console.log("login\n mahasiswa",mahasiswa,"\ndosen",dosen,"\n")

        const token = signToken({
            username: req.body.username,
            password: req.body.password,
            role:dosen?'dosen':'mahasiswa'
        })

        return res.status(200).json({
            user:{
                username:req.body.username,
                role:dosen?'dosen':'mahasiswa',
            },
            token
        })
    } catch (error) {
        console.error("error catch login")
        console.error(error)
        return res.status(500).json()
    }
}