import mongoose from "mongoose";

let cache = global.mongoose;

if (!cache) {
    cache = global.mongoose = {
        conn: null,
        promise: null
    }
}

export const connectDB = async () => {
    if (cache.conn) {
    return cache.conn;
    }
    
    if (!cache.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        }
        cache.promise = mongoose.connect(process.env.MONGODB_URI as string, opts).then((mongoose) => {
            return mongoose.connection;
        }).catch((err) => {
            console.error("Error connecting to MongoDB", err);
            throw err;
        });
    }
    
    try {
        cache.conn = await cache.promise;
        return cache.conn;
    } catch (err) {
        cache.promise = null;
        console.error("Error connecting to MongoDB", err);
        throw err;
    }
}