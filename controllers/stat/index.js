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

  return res.json({ status: 200, data: { users: users[0].count , orders } });
};

module.exports = { getStats };
