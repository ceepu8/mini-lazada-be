require('dotenv').config();
const bcryptjs = require('bcryptjs');

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

module.exports = { registerUser };
