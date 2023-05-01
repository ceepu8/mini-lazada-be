const Order = require('../models/Order');
const User = require('../models/User');

const createOrder = async (req, res) => {
  const {
    data: { userId },
  } = req.tokenDecode;

  const { products, hub, totalPrice } = req.body;

  try {
    const newOrder = new Order({
      customer: userId,
      products,
      hub,
      totalPrice,
    });

    await newOrder.save();
    const order = await newOrder.populate(['customer', 'hub', 'products.productID']);

    const resProd = order.products.map((prod) => ({
      name: prod.productID.name,
      price: prod.productID.price,
      image: prod.productID.image,
      quantity: prod.quantity,
    }));
    res.status(200).json({
      success: true,
      message: 'Order created successfully!',
      order: {
        customer: {
          name: order.customer.name,
          address: order.customer.address,
        },
        products: [...resProd],
      },
      hub: {
        name: order.hub.name,
        address: order.hub.address,
      },
      totalPrice: order.totalPrice,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOrderById = async (req, res) => {
  const {
    data: { userId },
  } = req.tokenDecode;
  const { id: orderId } = req.params;

  try {
    const user = await User.findById(userId).populate('hub');
    const order = await Order.findById(orderId).populate(['customer', 'hub', 'products.productID']);

    if (user.role === 'shipper') {
      if (user.hub.name !== order.hub.name) {
        return res
          .status(403)
          .json({ success: false, message: 'Not allow to access this order information' });
      }
    } else if (user.role === 'customer') {
      if (userId != order.customer._id) {
        return res.status(401).json({ success: false, message: 'You do not own this order' });
      }
    }

    const resProd = order.products.map((prod) => ({
      name: prod.productID.name,
      price: prod.productID.price,
      image: prod.productID.image,
      quantity: prod.quantity,
    }));
    return res.status(200).json({
      success: true,
      message: 'Order created successfully!',
      order: {
        customer: {
          name: order.customer.name,
          address: order.customer.address,
        },
        products: [...resProd],
      },
      hub: {
        name: order.hub.name,
        address: order.hub.address,
      },
      totalPrice: order.totalPrice,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOrder = async (req, res) => {
  const {
    data: { userId },
  } = req.tokenDecode;

  try {
    const user = await User.findById(userId).populate('hub');

    const ordersByHub = await Order.find({ hub: user.hub._id }).populate([
      'customer',
      'hub',
      'products.productID',
    ]);

    const resOrder = ordersByHub.map((order) => ({
      customer: {
        name: order.customer.name,
        address: order.customer.address,
      },
      product: order.products.map((prod) => ({
        name: prod.productID.name,
        image: prod.productID.image,
        price: prod.productID.price,
        name: prod.quantity,
      })),
      totalPrice: order.totalPrice,
    }));

    return res.status(200).json({
      success: true,
      message: 'Order created successfully!',
      order: {
        hub: {
          name: user.hub.name,
          address: user.hub.address,
        },
        order: resOrder,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { createOrder, getOrderById, getOrder };
