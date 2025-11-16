import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.post('/', async (req, res) => {
    const msg = await Message.create(req.body);
    res.status(201).json({ok: true, id: msg._id});
})

router.get('/', async(req, res) => {
    const msgs = await Message.find().sort({ date: -1 });  
    res.json(msgs);
})

export default router;