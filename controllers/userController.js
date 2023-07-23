const User = require('../models/userModel');
const Profile = require('../models/profileModel'); // Suppose you have a model for profiles

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profiles = await Profile.findAll({ where: { userId: user.id } });
        const response = {
            id: user.id,
            createdAt: user.createdAt,
            authEmail: user.email,
            profiles: [], // Initialized profiles as an empty array
        };

        if (profiles && profiles.length > 0) {
            response.profiles = profiles; // Sending entire profiles
        }

        res.json(response);
    } catch (err) {
        return next(err);
    }
};
