import mongoose from "mongoose";

const database = async () => {
    try {
        mongoose.connection.on('connected', ()=> console.log('Database connected successfully'));
        await mongoose.connect(`${process.env.MONGO_URI}/chatAI`)
    } 
    catch (error) {
        console.log('Database connection error : ', error?.message)
        process.exit(1)
    }
}

export default database