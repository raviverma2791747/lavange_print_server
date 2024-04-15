const Ajv = require("ajv");
const { AggregateAjvError } = require("@segment/ajv-human-errors");

const validate = (schema) => {
  const ajv = new Ajv({ allErrors: true });

  return (req, res, next) => {
    const validation = ajv.compile(schema);
    const valid = validation(req.body);

    if (!valid) {
      const errors = new AggregateAjvError(validation.errors);
      return res.json({
        status: 500,
        messages: ["Validation failed", errors.message],
      });
    }

    next();
  };
};

module.exports = validate;
