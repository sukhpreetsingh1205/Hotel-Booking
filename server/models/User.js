import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    _id:{
        type:String,
        default: () => new mongoose.Types.ObjectId().toString(),
    },

    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    image:{
        type:String,
        default: "",
    },
    passwordHash: {
        type: String,
        select: false,
    },
    role:{
        type:String,
        enum: ["user","hotelOwner"],
        default:"user"
    },
    recentSearchedCities:{
        type: [String],
        default: [],
    },

},{timestamps:true});

const User = mongoose.model("User",userSchema)
export default User
