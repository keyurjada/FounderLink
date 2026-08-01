import mongoose from "mongoose";

const IdeaformSchema = new mongoose.Schema(

    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
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
        },
        skillsRequired: {
            type: [String],
            default: []
        }

    },
    {
        timestamps:true
    }
);

export default mongoose.model("Ideaform",IdeaformSchema);