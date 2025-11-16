import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    name: String,
    bio: String,
    socials: {
        instagram: String,
        twitter: String,
        tiktok: String,
    },
    image: String,
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;