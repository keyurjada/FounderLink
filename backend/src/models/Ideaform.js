import mongoose from "mongoose";

const IdeaformSchema = new mongoose.Schema(

    {
        startuptitle:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        equity:{
            type:Number,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        teamsize:{
            type:Number,
            required:true
        }

    },
    {
        timestamps:true
    }
);

export default mongoose.model("Ideaform",IdeaformSchema);