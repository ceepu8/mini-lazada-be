const Order = require('../models/Order');

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

module.exports = { createOrder };
