require('dotenv').config();
const Hub = require('../models/Hub');

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

module.exports = { createHub };
