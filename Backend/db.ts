import mongoose, {ConnectOptions} from 'mongoose';

interface MongoOptions extends ConnectOptions {
    useNewUrlParser?: boolean;
    useUnifiedTopology?: boolean;
    useCreateIndex?: boolean;
    useFindAndModify?: boolean;
}

 const connectDB = async () => {
    try {
        const mongoOptions: MongoOptions = {
            useUnifiedTopology: true,
        };
        
        await mongoose.connect('mongodb+srv://divyanshbajpai10:Divmongodb99@cluster0.jkte1p0.mongodb.net/?retryWrites=true&w=majority', mongoOptions);
        console.log('MongoDB connected');
    } catch (err: any) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
}

export default connectDB;
