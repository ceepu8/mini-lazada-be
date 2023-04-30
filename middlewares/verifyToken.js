require('dotenv').config();
const jwt = require('jsonwebtoken');

const authorize = (useRoleArray) => {
  return async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    try {
      const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decode) {
        const dk =
          useRoleArray.findIndex((type) => {
            return type == decode.data.role;
          }) > -1;
        if (dk) {
          req.tokenDecode = decode;
          next();
        } else {
          return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
};

module.exports = { authorize };
