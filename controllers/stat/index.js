const OrderModel = require("../../models/order");
const UserModel = require("../../models/user");

const getStats = async (req, res) => {
  const users = await UserModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    },
    {
      $count: "count",
    },
  ]);

  const orders = await OrderModel.find({
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
  }).count();

  const recentOrders = await OrderModel.find()
    .populate({
      path: "user",
      select: "_id username email firstName lastName",
    })
    .sort("createdAt")
    .limit(10);

  const revenue = await OrderModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$total" },
      },
    },
  ]);

  return res.json({
    status: 200,
    data: {
      users: users.length ? users[0].count : 0,
      orders,
      revenue: revenue.length ? revenue[0].total : 0,
      recentOrders,
    },
  });
};

module.exports = { getStats };
