const OrderModel = require("../../models/order");
const UserModel = require("../../models/user");

const getStats = async (req, res, next) => {
  try {
    const users = await UserModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              1
            ),
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

    console.log(users);

    return res.json({
      status: 200,
      data: { users: users.length ? users[0].count : 0, orders },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
