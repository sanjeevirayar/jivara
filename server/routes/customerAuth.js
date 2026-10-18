import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Customer from "../models/Customer.js";


const router =
  express.Router();


/* =====================================================
   CREATE TOKEN
===================================================== */

const createCustomerToken =
  (customer) => {

    return jwt.sign(
      {
        customerId:
          customer._id.toString(),

        email:
          customer.email,

        role:
          "customer",
      },

      process.env.JWT_SECRET,

      {
        expiresIn:
          "7d",
      }
    );

  };


/* =====================================================
   REGISTER
===================================================== */

router.post(
  "/register",

  async (
    req,
    res
  ) => {

    try {

      const {
        firstName,
        lastName,
        email,
        phone,
        password,
      } = req.body;


      if (
        !firstName ||
        !lastName ||
        !email ||
        !password
      ) {

        return res
          .status(400)
          .json({
            success: false,
            message:
              "First name, last name, email and password are required.",
          });

      }


      if (
        String(password).length <
        8
      ) {

        return res
          .status(400)
          .json({
            success: false,
            message:
              "Password must contain at least 8 characters.",
          });

      }


      const normalisedEmail =
        String(email)
          .trim()
          .toLowerCase();


      const existingCustomer =
        await Customer.findOne({
          email:
            normalisedEmail,
        });


      if (
        existingCustomer
      ) {

        return res
          .status(409)
          .json({
            success: false,
            message:
              "An account already exists with this email.",
          });

      }


      const passwordHash =
        await bcrypt.hash(
          password,
          12
        );


      const customer =
        await Customer.create({

          firstName:
            String(firstName)
              .trim(),

          lastName:
            String(lastName)
              .trim(),

          email:
            normalisedEmail,

          phone:
            String(
              phone || ""
            ).trim(),

          passwordHash,

        });


      const token =
        createCustomerToken(
          customer
        );


      return res
        .status(201)
        .json({

          success: true,

          token,

          customer: {
            id:
              customer._id,

            firstName:
              customer.firstName,

            lastName:
              customer.lastName,

            email:
              customer.email,

            phone:
              customer.phone,
          },

        });

    } catch (error) {

      console.error(
        "Customer registration error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to create your account.",
        });

    }

  }
);


/* =====================================================
   LOGIN
===================================================== */

router.post(
  "/login",

  async (
    req,
    res
  ) => {

    try {

      const {
        email,
        password,
      } = req.body;


      if (
        !email ||
        !password
      ) {

        return res
          .status(400)
          .json({
            success: false,
            message:
              "Email and password are required.",
          });

      }


      const normalisedEmail =
        String(email)
          .trim()
          .toLowerCase();


      const customer =
        await Customer.findOne({
          email:
            normalisedEmail,
        });


      if (
        !customer ||
        !customer.isActive
      ) {

        return res
          .status(401)
          .json({
            success: false,
            message:
              "Invalid email or password.",
          });

      }


      const passwordMatches =
        await bcrypt.compare(
          password,
          customer.passwordHash
        );


      if (
        !passwordMatches
      ) {

        return res
          .status(401)
          .json({
            success: false,
            message:
              "Invalid email or password.",
          });

      }


      customer.lastLoginAt =
        new Date();


      await customer.save();


      const token =
        createCustomerToken(
          customer
        );


      return res.json({

        success: true,

        token,

        customer: {
          id:
            customer._id,

          firstName:
            customer.firstName,

          lastName:
            customer.lastName,

          email:
            customer.email,

          phone:
            customer.phone,
        },

      });

    } catch (error) {

      console.error(
        "Customer login error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to sign in.",
        });

    }

  }
);


export default router;