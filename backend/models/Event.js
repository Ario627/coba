import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    location: String,
});

const Event = mongoose.model("Event", eventSchema);
export default Event;