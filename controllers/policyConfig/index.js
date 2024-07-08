const { PolicyConfigModel } = require("../../models/config");

const getPolicyConfig = async (req, res, next) => {
  const name = req.params.name;
  const policyConfig = await PolicyConfigModel.findOne({ name: name });
  return res.json({ status: 200, data: { policy: policyConfig } });
};

const updatePolicyConfig = async (req, res, next) => {
  const name = req.body.name;
  const policyConfig = await PolicyConfigModel.findOneAndUpdate(
    { name: name },
    req.body
  );
  return res.json({ status: 200, data: {} });
};
const fetchPolicyConfig = async (req, res, next) => {
  const policyConfigs = await PolicyConfigModel.find();
  return res.json({ status: 200, data: { policies: policyConfigs } });
};

module.exports = { fetchPolicyConfig, getPolicyConfig, updatePolicyConfig };
