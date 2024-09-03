import mongoose from "mongoose"


async function dbConnect()
{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/x-twitter");
        console.log(`db connection successfull: ${conn.connection.host}`);
    }
    catch(err) {
        console.log(`error connection in db: ${err.message}`);
    }
}


export default dbConnect