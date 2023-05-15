require('dotenv').config();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { Customer } = require('../models/Customer');
const { Shipper } = require('../models/Shipper');
const { Vendor } = require('../models/Vendor');

const registerUser = async (req, res) => {
  switch (req.body.role) {
    case 'customer':
      const { username, password, role, address, name } = req.body;
      try {
        const user = await Customer.findOne({ username });
        if (user) {
          return res.status(400).json({ success: false, message: 'Customer has already existed!' });
        }
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(password, salt);
        const newCustomer = new Customer({
          username,
          password: hashedPassword,
          role,
          profileImage: '',
          address,
          name,
        });
        await newCustomer.save();
        res.status(200).json({
          success: true,
          message: 'Customer created successfully!',
          user: {
            username,
            role,
            address,
            name,
          },
        });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
      break;

    case 'vendor':
      const {
        username: vendorUsername,
        password: vendorPassword,
        role: vendorRole,
        businessName,
        businessAddress,
      } = req.body;

      try {
        const user = await Vendor.findOne({ vendorUsername });
        if (user) {
          return res.status(400).json({ success: false, message: 'Vendor has already existed!' });
        }
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(vendorPassword, salt);
        const newVendor = new Vendor({
          username: vendorUsername,
          password: hashedPassword,
          role: vendorRole,
          profileImage: '',
          businessName,
          businessAddress,
        });
        await newVendor.save();
        res.status(200).json({
          success: true,
          message: 'Vendor created successfully!',
          user: {
            username: vendorUsername,
            role: vendorRole,
            businessName,
            businessAddress,
          },
        });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
      break;

    case 'shipper':
      const {
        username: shipperUsername,
        password: shipperPassword,
        role: shipperRole,
        hub,
      } = req.body;

      try {
        const user = await Shipper.findOne({ shipperUsername });
        if (user) {
          return res.status(400).json({ success: false, message: 'Shipper has already existed!' });
        }
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(shipperPassword, salt);
        const newShipper = new Shipper({
          username: shipperUsername,
          password: hashedPassword,
          profileImage: '',
          role: shipperRole,
          hub,
        });
        await newShipper.save();
        res.status(200).json({
          success: true,
          message: 'Shipper created successfully!',
          user: {
            username: shipperUsername,
            password: hashedPassword,
            role: shipperRole,
            hub,
          },
        });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
      break;

    default:
      break;
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).populate('hub');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid username/ email or password',
      });
    }

    const isAuth = bcryptjs.compareSync(password, user.password);

    if (!isAuth) {
      return res.status(400).json({
        success: false,
        message: 'Invalid username/ email or password',
      });
    }
    const payload = { data: { userId: user._id, username, role: user.role } };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 10 * 60 * 60,
    });

    let userPayload = {
      username: user.username,
      role: user.role,
      profileImage: user.profileImage,
    };

    if (user.role === 'customer') {
      userPayload.name = user.name;
      userPayload.address = user.address;
    } else if (user.role === 'vendor') {
      userPayload.businessName = user.businessName;
      userPayload.businessAddress = user.businessAddress;
    } else if (user.role === 'shipper') {
      userPayload.hub = {
        name: user.hub.name,
        address: user.hub.address,
      };
    }

    res.status(200).json({
      success: true,
      message: 'User logged in successfully!',
      accessToken,
      user: {
        ...userPayload,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  const {
    data: { username },
  } = req.tokenDecode;
  try {
    const user = await User.findOne({ username }).select('-password').populate('hub');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }

    const userPayload = {
      username: user.username,
      role: user.role,
      profileImage: user.profileImage || '',
    };

    switch (user.role) {
      case 'vendor':
        userPayload.businessAddress = user.businessAddress;
        userPayload.businessName = user.businessName;
        break;

      case 'customer':
        userPayload.address = user.address;
        userPayload.name = user.name;
        break;

      case 'shipper':
        userPayload.hub = {
          name: user.hub.name,
          address: user.hub.address,
        };
        break;

      default:
        break;
    }

    res.status(200).json({
      success: true,
      message: 'Get user successfully!',
      data: userPayload,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser, getProfile };
