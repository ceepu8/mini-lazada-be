require('dotenv').config();
const Hub = require('../models/Hub');

const getHub = async (req, res) => {
  try {
    let hub = await Hub.find();

    if (hub.length > 0) {
      res.status(200).json({ success: true, message: 'Success', data: hub });
    } else {
      res.status(404).json({ success: true, message: 'There is not any products' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const createHub = async (req, res) => {
  const { name, address } = req.body;

  try {
    const hub = await Hub.findOne({ name });
    if (hub) {
      return res.status(400).json({ success: false, message: 'Hub has already existed!' });
    }
    const newHub = new Hub({
      name,
      address,
    });
    await newHub.save();

    res.status(200).json({
      success: true,
      message: 'Hub created successfully!',
      hub: {
        name,
        address,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { createHub, getHub };
