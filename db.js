import mongoose from "mongoose"

export const connectDb=async()=>{
    try {
        const {connection}=await mongoose.connect("mongodb://127.0.0.1:27017/optimisedapi")
        console.log(connection.host)
    } catch (error) {
        console.log(error.message)
    }
}