const User = require("../models/User");

const getUsers = async (req, res) => {
    const users = await User.find()
    const totalUsers = await User.countDocuments();
    res.status(200).json({ users, totalUsers })
};

module.exports = { getUsers };
