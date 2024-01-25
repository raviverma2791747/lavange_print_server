const Ajv = require("ajv");

const validate = (schema) => {
  const ajv = new Ajv({ strictTuples: false, allErrors: true });

  return (req, res, next) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);

    if (!valid) {

      console.log(ajv.errors);
      return res.json({
        status: 500,
        data: {},
        errors: ['Validation failed'],
      });
    }

    next();
  };
};


module.exports = validate;


