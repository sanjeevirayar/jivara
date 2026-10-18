import express from "express";

import Order from "../models/Order.js";
import adminAuth from "../middleware/adminAuth.js";


const router =
  express.Router();


/* =====================================================
   VALID ORDER STATUSES
===================================================== */

const ORDER_STATUSES = [
  "Awaiting Review",
  "Confirmed",
  "In Production",
  "Ready",
  "Shipped",
  "Delivered",
  "Cancelled",
];


/* =====================================================
   ALL ROUTES BELOW REQUIRE ADMIN LOGIN
===================================================== */

router.use(adminAuth);


/* =====================================================
   GET ALL ORDERS
===================================================== */

router.get(
  "/",

  async (
    req,
    res
  ) => {

    try {

      const orders =
        await Order.find({})
          .sort({
            createdAt: -1,
          });


      return res.json({
        success: true,

        count:
          orders.length,

        orders,
      });

    } catch (error) {

      console.error(
        "Get admin orders error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to load orders.",
        });

    }

  }
);


/* =====================================================
   GET ONE ORDER
===================================================== */

router.get(
  "/:id",

  async (
    req,
    res
  ) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );


      if (!order) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Order not found.",
          });

      }


      return res.json({
        success: true,
        order,
      });

    } catch (error) {

      console.error(
        "Get single order error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to load the order.",
        });

    }

  }
);


/* =====================================================
   UPDATE ORDER STATUS
===================================================== */

router.patch(
  "/:id/status",

  async (
    req,
    res
  ) => {

    try {

      const {
        status,
      } = req.body;


      if (
        !ORDER_STATUSES.includes(
          status
        )
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid order status.",

            allowedStatuses:
              ORDER_STATUSES,
          });

      }


      const order =
        await Order.findById(
          req.params.id
        );


      if (!order) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Order not found.",
          });

      }


      order.orderStatus =
        status;


      await order.save();


      return res.json({
        success: true,

        message:
          "Order status updated.",

        order,
      });

    } catch (error) {

      console.error(
        "Update order status error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to update order status.",
        });

    }

  }
);


export default router;