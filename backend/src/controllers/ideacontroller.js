import Ideaform from "../models/Ideaform.js";

const createIdea = async (req, res) => {

    const{
        startuptitle,
        category,
        equity,
        description,
        teamsize,
    } = req.body;
    
    try {
        const idea = await Ideaform.create({
              startuptitle,
            category,
            equity,
            description,
            teamsize,
        });

        res.status(201).json({
            message:"StartUp Idea Uploaded Successfully",
            idea,
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            
        })
    }

};

export {createIdea};