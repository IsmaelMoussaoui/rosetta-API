const { check, validationResult } = require('express-validator');
const Profile = require('../models/profileModel');
const User = require('../models/userModel');

exports.validate = (method) => {
    switch (method) {
        case 'createProfile':
            return [
                check('firstName', 'firstName is required').exists(),
                check('lastName', 'lastName is required').exists(),
                check('dateOfBirth', 'dateOfBirth is required').exists(),
                check('sex', 'sex is required').exists(),
                check('age', 'age is required').exists(),
                check('height', 'height is required').exists(),
                check('weight', 'weight is required').exists(),
                check('smoke', 'smoke is required').exists(),
                check('alcohol', 'alcohol is required').exists(),
                check('drugs', 'drugs is required').exists(),
                check('physicalActivity', 'physicalActivity is required').exists(),
                check('other', 'other is required').exists(),
            ];
        default:
            return [];
    }
}

exports.createProfile = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { firstName, lastName, dateOfBirth, sex, age, height, weight, smoke, alcohol, drugs, physicalActivity, other } = req.body;

    try {
        const newProfile = await Profile.create({
            userId, firstName, lastName, dateOfBirth, sex, age, height, weight, smoke, alcohol, drugs, physicalActivity, other
        });

        return res.status(201).json({ message: 'Profile created successfully', newProfile });
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred while creating the profile', error: err.toString() });
    }
};
