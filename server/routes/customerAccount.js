import express from "express";

import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import customerAuth from "../middleware/customerAuth.js";


const router =
  express.Router();


/* =====================================================
   EVERYTHING BELOW REQUIRES CUSTOMER LOGIN
===================================================== */

router.use(
  customerAuth
);


/* =====================================================
   CUSTOMER PROFILE
===================================================== */

router.get(
  "/profile",

  async (
    req,
    res
  ) => {

    try {

      const customer =
        await Customer.findById(
          req.customer.customerId
        ).select(
          "-passwordHash"
        );


      if (!customer) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Customer account not found.",
          });

      }


      return res.json({
        success: true,
        customer,
      });

    } catch (error) {

      console.error(
        "Customer profile error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to load your account.",
        });

    }

  }
);


/* =====================================================
   CUSTOMER ORDERS

   IMPORTANT:
   We use the email from the verified JWT.
   We do NOT accept an email from the browser.
===================================================== */

router.get(
  "/orders",

  async (
    req,
    res
  ) => {

    try {

      const email =
        String(
          req.customer.email
        )
          .trim()
          .toLowerCase();


      const orders =
        await Order.find({
          "customer.email":
            email,
        })
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
        "Customer orders error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to load your orders.",
        });

    }

  }
);


/* =====================================================
   ONE CUSTOMER ORDER
===================================================== */

router.get(
  "/orders/:id",

  async (
    req,
    res
  ) => {

    try {

      const email =
        String(
          req.customer.email
        )
          .trim()
          .toLowerCase();


      const order =
        await Order.findOne({
          _id:
            req.params.id,

          "customer.email":
            email,
        });


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
        "Customer order details error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to load this order.",
        });

    }

  }
);

/* =====================================================
   GET SAVED ADDRESSES
===================================================== */

router.get(
  "/addresses",

  async (
    req,
    res
  ) => {

    try {

      const customer =
        await Customer.findById(
          req.customer.customerId
        ).select(
          "addresses"
        );


      if (!customer) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Customer account not found.",
          });

      }


      const addresses =
        [...customer.addresses]
          .sort(
            (a, b) =>
              Number(b.isDefault) -
              Number(a.isDefault)
          );


      return res.json({
        success: true,
        addresses,
      });

    } catch (error) {

      console.error(
        "Get customer addresses error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to load saved addresses.",
        });

    }

  }
);


/* =====================================================
   SAVE NEW ADDRESS
===================================================== */

router.post(
  "/addresses",

  async (
    req,
    res
  ) => {

    try {

      const {
        label,
        firstName,
        lastName,
        phone,
        address,
        apartment,
        city,
        state,
        postalCode,
        country,
        isDefault,
      } = req.body;


      if (
        !firstName?.trim() ||
        !lastName?.trim() ||
        !phone?.trim() ||
        !address?.trim() ||
        !city?.trim() ||
        !state?.trim() ||
        !postalCode?.trim() ||
        !country?.trim()
      ) {

        return res
          .status(400)
          .json({
            success: false,
            message:
              "Please complete all required address fields.",
          });

      }


      const customer =
        await Customer.findById(
          req.customer.customerId
        );


      if (!customer) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Customer account not found.",
          });

      }


      /*
        First saved address becomes
        the default automatically.
      */

      const shouldBeDefault =
        customer.addresses.length === 0 ||
        Boolean(isDefault);


      /*
        Only one address may be
        the default address.
      */

      if (shouldBeDefault) {

        customer.addresses.forEach(
          (savedAddress) => {

            savedAddress.isDefault =
              false;

          }
        );

      }


      customer.addresses.push({

        label:
          label?.trim() ||
          "Home",

        firstName:
          firstName.trim(),

        lastName:
          lastName.trim(),

        phone:
          phone.trim(),

        address:
          address.trim(),

        apartment:
          apartment?.trim() ||
          "",

        city:
          city.trim(),

        state:
          state.trim(),

        postalCode:
          postalCode.trim(),

        country:
          country.trim(),

        isDefault:
          shouldBeDefault,

      });


      await customer.save();


      const savedAddress =
        customer.addresses[
          customer.addresses.length -
          1
        ];


      return res
        .status(201)
        .json({
          success: true,

          message:
            "Address saved successfully.",

          address:
            savedAddress,
        });

    } catch (error) {

      console.error(
        "Save customer address error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to save this address.",
        });

    }

  }
);


/* =====================================================
   MAKE ADDRESS DEFAULT
===================================================== */

router.patch(
  "/addresses/:addressId/default",

  async (
    req,
    res
  ) => {

    try {

      const customer =
        await Customer.findById(
          req.customer.customerId
        );


      if (!customer) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Customer account not found.",
          });

      }


      const selectedAddress =
        customer.addresses.id(
          req.params.addressId
        );


      if (!selectedAddress) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Saved address not found.",
          });

      }


      customer.addresses.forEach(
        (savedAddress) => {

          savedAddress.isDefault =
            savedAddress._id.toString() ===
            selectedAddress._id.toString();

        }
      );


      await customer.save();


      return res.json({
        success: true,

        message:
          "Default address updated.",

        addresses:
          customer.addresses,
      });

    } catch (error) {

      console.error(
        "Default address update error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to update the default address.",
        });

    }

  }
);


/* =====================================================
   DELETE SAVED ADDRESS
===================================================== */

router.delete(
  "/addresses/:addressId",

  async (
    req,
    res
  ) => {

    try {

      const customer =
        await Customer.findById(
          req.customer.customerId
        );


      if (!customer) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Customer account not found.",
          });

      }


      const address =
        customer.addresses.id(
          req.params.addressId
        );


      if (!address) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Saved address not found.",
          });

      }


      const wasDefault =
        address.isDefault;


      customer.addresses.pull(
        req.params.addressId
      );


      /*
        If the deleted address was
        the default, make the first
        remaining address default.
      */

      if (
        wasDefault &&
        customer.addresses.length >
          0
      ) {

        customer.addresses[0]
          .isDefault = true;

      }


      await customer.save();


      return res.json({
        success: true,

        message:
          "Address removed.",

        addresses:
          customer.addresses,
      });

    } catch (error) {

      console.error(
        "Delete customer address error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to remove this address.",
        });

    }

  }
);


export default router;