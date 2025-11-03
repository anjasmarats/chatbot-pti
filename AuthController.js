const Login =async(req,res)=>{
    try {
        if (!req.body || !req.body.username || !req.body.password) {
            console.error("data login tidak lengkap, req.body\n",req.body)
            return res.status(400).json()
        }
    } catch (error) {
        
    }
}