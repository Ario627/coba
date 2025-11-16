import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

router.get('/', async(req, res) => {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
});

router.post('/', async(req, res) => {
    const newEvent = new Event.create(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
})

router.delete('/:id', async(req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event Deleted" });
})

export default router;