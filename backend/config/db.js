import mongoose from "mongoose";    
export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sunsystechsol_db_user:Internsaathi123@cluster0.wa76e5d.mongodb.net/Internsaathi')
    .then(() => console.log("MongoDB connected successfully"))
}