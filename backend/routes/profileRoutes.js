import express from 'express';
import Profile from '../models/Profile.js';

const router = express.Router();

router.get('/', async(req, res) => {
    const profiles = await Profile.findOne();;
    res.json(profiles);
})

router.post('/', async(req, res) => {
    const existing = await Profile.findOne();
    if(existing) {
        return res.status(400).json({ message: "Profile already exists" });
    } else {
        const newProfile = new Profile(req.body);
        await newProfile.save();
        res.status(201).json(newProfile);
    }
})

export default router;