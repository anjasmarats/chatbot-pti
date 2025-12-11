import supabase from "../supabase.js"

export const deleteDataAnalytics =async(req,res)=>{
    try {
        if (!req.params.id) {
            return res.status(400).json({
                message:"error params id delete analytics tidak ada"
            })
        }

        const { error } = await supabase.from("feedback").delete("*").eq("id",req.params.id)

        if (error) {
            console.error("error hapus data analytics supabase",error)
            return res.status(500).json({
                message:"error hapus data analytics supabase"
            })
        }

        return res.status(200).json()
    } catch (error) {
        console.error("error hapus data analytics supabase",error)
        return res.status(500).json({
            message:"error hapus data analytics supabase"
        })
    }
}

export const getAnalytics =async (req, res) => {
  try {
    // const analytics = await Feedback.findAll({
    //   // attributes: ['id', 'content', 'analysis', 'createdAt', 'updatedAt'],
    //   order: [['createdAt', 'DESC']],
    // });

    const {data: analytics,error} = await supabase
    .from("feedback")
    .select("*")
    .order('id',{ ascending: false })

    // .select('createdAt')
    // .select('updatedAt')
    
    if (error) {
      console.error("error select data feedback analytics",error)
      return res.status(500).json()
    }

    console.log("analytics",analytics)

    return res.json({data: analytics,dosen:req.user.role==="dosen" });
  } catch (error) {
    console.error('Fetch analytics error:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}