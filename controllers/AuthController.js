// const { signToken } = require("./manageSession")
import supabase from "../supabase.js"

import { signToken } from '../manageSession.js'

export const Login =async(req,res)=>{
    try {
        if (!req.body || !req.body.username || !req.body.password) {
            console.error("data login tidak lengkap, req.body\n",req.body)
            return res.status(400).json()
        }

        const {data: mahasiswa, error} = await supabase.from("mahasiswa")
        .select("*")
        .eq("username",req.body.username)
        .eq("password",req.body.password)

        if (error) {
            console.error("error mahasiswa login supabase",error)
            return res.status(500).json()
        }

        if (mahasiswa.length===0) {
            console.error("error query database login mahasiswa",mahasiswa)
            return res.status(404).json()
        }

        const {data: dosen, error: err} = await supabase.from("dosen")
        .select("*")
        .eq("username",req.body.username)
        .eq("password",req.body.password)

        if (err) {
            console.error("error dosen login supabase",error)
            return res.status(500).json()
        }

        if (dosen.length===0) {
            console.error("error query database login dosen",dosen)
            return res.status(404).json()
        }

        console.log("login\n mahasiswa",mahasiswa,"\ndosen",dosen,"\n")

        const token = signToken({
            username: req.body.username,
            password: req.body.password
        })

        return res.status(200).json({
            token
        })
    } catch (error) {
        console.error("error catch login")
        console.error(error)
        return res.status(500).json()
    }
}