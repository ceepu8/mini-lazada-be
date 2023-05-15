require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token not found' });
  }
  try {
    const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.tokenDecode = decode;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(403).json({ success: false, message: 'Invalid Token' });
  }
};

const authenticateWithTokenOnly = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.data.userId;

    if (!userId) {
      return res.status(404).json({
        success: false, message: "Invalid token!"
      })
    } else {
      req.tokenDecode = decodedToken
      next()
    }
  } catch (error) {
    res.status(401).json({
      error: new Error('Invalid request!'),
    });
  }
}

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.data.userId;
    if (req.params.id !== userId) {
      res.status(403).json({ success: false, message: 'Unauthorized!' });
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!'),
    });
  }
};

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

module.exports = { authorize, authenticate, authenticateWithTokenOnly, verifyToken };
