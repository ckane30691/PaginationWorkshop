const User = require("../models/User");

const getUsers = async (req, res) => {
    const users = await User.find()
    const totalUsers = await User.countDocuments();
    res.status(200).json({ users, totalUsers })
};

// curl "http://localhost:5000/users?page=1&limit=5"

const getUsersOffsetBased = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const users = await User.find()
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit);

    const totalUsers = await User.countDocuments();

    page += 1

    res.json({
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page
    });
}

// curl "http://localhost:5000/users?cursor=2025-03-29T00:09:11.898Z&limit=5"

const getUsersCursorBased = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor; // Last fetched timestamp

    let query = {};
    if (cursor) {
        query.createdAt = { $lt: new Date(cursor) }; // Fetch users created before cursor
    }

    const users = await User.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .limit(limit)
        .lean();

    const totalUsers = await User.countDocuments();

    const nextCursor = users.length > 0 ? users[users.length - 1].createdAt : null;

    res.json({ users, totalUsers, nextCursor });
}

module.exports = {
    getUsers,
    getUsersOffsetBased,
    getUsersCursorBased
};
