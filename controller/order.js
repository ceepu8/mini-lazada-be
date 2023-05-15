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
      status: 'active',
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
      data: {
        order: {
          customer: {
            name: order.customer.name,
            address: order.customer.address,
          },
          products: [...resProd],
          totalPrice: order.totalPrice,
          status: order.status,
        },
        hub: {
          name: order.hub.name,
          address: order.hub.address,
        },
      },
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
        quantity: prod.quantity,
      })),
      id: order.id,
      totalPrice: order.totalPrice,
      status: order.status,
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

const updateOrderStatus = async (req, res) => {
  const {
    data: { userId },
  } = req.tokenDecode;
  const { status } = req.query;
  const { id } = req.params;

  const isStatusValid =
    ['active', 'delivered', 'canceled'].findIndex((each) => {
      return each == status;
    }) > -1;

  if (!isStatusValid) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: 'Status changed invalid',
    });
  }

  if (!status) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: 'There is no status changed',
    });
  }

  try {
    const shipper = await User.findById(userId).populate('hub');
    const order = await Order.findById(id).populate('hub');

    if (shipper.hub.id !== order.hub.id) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "You are not allowed to change status of other hub's order",
      });
    }

    const updatingOrder = await Order.findByIdAndUpdate(id, {
      status,
    });

    if (!updatingOrder) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'There is no product',
      });
    }

    const updatedOrder = await Order.findById(id);

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Update order status successfully!',
      data: updatedOrder,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { createOrder, getOrderById, getOrder, updateOrderStatus };
