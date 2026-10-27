import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

import connectDB from "./config/db.js";
import Order from "./models/Order.js";
import { productPrices } from "./data/productPrices.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import adminOrdersRoutes from "./routes/adminOrders.js";
import customerAuthRoutes from "./routes/customerAuth.js";
import customerAccountRoutes from "./routes/customerAccount.js";
import contactRoutes from "./routes/contact.js";

import {
  sendCustomerOrderConfirmation,
  sendAdminNewOrderNotification,
} from "./services/emailService.js";

/* =====================================================
   ENVIRONMENT
===================================================== */

dotenv.config();


const PORT =
  process.env.PORT || 5000;


const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN ||
  "http://localhost:5173";


const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID;


const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET;


if (
  !RAZORPAY_KEY_ID ||
  !RAZORPAY_KEY_SECRET
) {
  console.error(
    "Razorpay credentials are missing."
  );

  process.exit(1);
}


/* =====================================================
   RAZORPAY
===================================================== */

const razorpay =
  new Razorpay({
    key_id:
      RAZORPAY_KEY_ID,

    key_secret:
      RAZORPAY_KEY_SECRET,
  });


/* =====================================================
   EXPRESS
===================================================== */

const app =
  express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://jivara.netlify.app",
  "https://jivarabyradhey.com",
].filter(Boolean);


app.use(
  cors({
    origin: (origin, callback) => {

      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);


app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  "/api/admin/auth",
  adminAuthRoutes
);

app.use(
  "/api/admin/orders",
  adminOrdersRoutes
);

app.use(
  "/api/customer/auth",
  customerAuthRoutes
);

app.use(
  "/api/customer/account",
  customerAccountRoutes
);

app.use(
  "/api/contact",
  contactRoutes
);

/* =====================================================
   TEMPORARY PAYMENT STORAGE

   Development only.
   Later we can move this into MongoDB too.
===================================================== */

const pendingOrders =
  new Map();


/*
  TEMPORARY:
  Shipping is ₹0 while testing.
*/

const TEST_SHIPPING_AMOUNT =
  0;


/* =====================================================
   HEALTH
===================================================== */

app.get(
  "/",
  (req, res) => {

    res.json({
      success: true,
      message:
        "Jivara backend is running.",
    });

  }
);


app.get(
  "/api/health",
  (req, res) => {

    res.json({
      success: true,
      message:
        "Jivara payment server is running.",
    });

  }
);


/* =====================================================
   STRING HELPER
===================================================== */

const cleanString = (
  value,
  maxLength = 1000
) => {

  return String(
    value ?? ""
  )
    .trim()
    .slice(
      0,
      maxLength
    );

};


/* =====================================================
   CUSTOMER VALIDATION
===================================================== */

const validateCustomer = (
  customer
) => {

  if (!customer) {

    throw new Error(
      "Customer details are missing."
    );

  }


  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "postalCode",
    "country",
  ];


  for (
    const field
    of requiredFields
  ) {

    if (
      !cleanString(
        customer[field]
      )
    ) {

      throw new Error(
        `Customer ${field} is required.`
      );

    }

  }


  return {

    firstName:
      cleanString(
        customer.firstName,
        100
      ),

    lastName:
      cleanString(
        customer.lastName,
        100
      ),

    email:
      cleanString(
        customer.email,
        200
      ).toLowerCase(),

    phone:
      cleanString(
        customer.phone,
        40
      ),

    address:
      cleanString(
        customer.address,
        500
      ),

    apartment:
      cleanString(
        customer.apartment,
        200
      ),

    city:
      cleanString(
        customer.city,
        150
      ),

    state:
      cleanString(
        customer.state,
        150
      ),

    postalCode:
      cleanString(
        customer.postalCode,
        30
      ),

    country:
      cleanString(
        customer.country,
        100
      ),

    notes:
      cleanString(
        customer.notes,
        3000
      ),

  };

};


/* =====================================================
   CALCULATE TRUSTED ORDER
===================================================== */

const calculateOrder = (
  items
) => {

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {

    throw new Error(
      "Your bag is empty."
    );

  }


  let subtotal = 0;

  let totalPieces = 0;


  const trustedItems =
    items.map(
      (item) => {

        /* =============================================
           PRODUCT
        ============================================= */

        const productId =
          Number(
            item.productId
          );


        const product =
          productPrices[
          productId
          ];


        if (!product) {

          throw new Error(
            `Invalid product: ${productId}`
          );

        }


        /* =============================================
           QUANTITY
        ============================================= */

        const quantity =
          Number(
            item.quantity
          );


        if (
          !Number.isInteger(
            quantity
          ) ||
          quantity < 1 ||
          quantity > 20
        ) {

          throw new Error(
            `Invalid quantity for ${product.name}.`
          );

        }


        /* =============================================
           TRUSTED PRICE

           IMPORTANT:
           Product price comes from the server,
           NOT from the browser.
        ============================================= */

        const itemSubtotal =
          product.price *
          quantity;


        subtotal +=
          itemSubtotal;


        totalPieces +=
          quantity;


        /* =============================================
           CONFIGURATION
        ============================================= */

        return {

          productId:
            product.id,

          slug:
            cleanString(
              item.slug,
              200
            ),

          collectionId:
            cleanString(
              item.collectionId,
              200
            ),

          name:
            product.name,

          image:
            cleanString(
              item.image,
              500
            ),

          category:
            cleanString(
              item.category,
              150
            ),


          /* ===========================================
             SERVER PRICE
          =========================================== */

          price:
            product.price,

          currency:
            product.currency ||
            "INR",

          quantity,

          subtotal:
            itemSubtotal,


          /* ===========================================
             CUSTOMER DESIGN CHOICES
          =========================================== */

          color:
            cleanString(
              item.color,
              200
            ),

          measurementUnit:
            item.measurementUnit ===
              "cm"
              ? "cm"
              : "in",

          measurements:
            Array.isArray(
              item.measurements
            )
              ? item.measurements
              : [],


          customisation: {

            choice:
              cleanString(
                item.customisation
                  ?.choice ||
                "Keep Original",
                200
              ),

            notes:
              cleanString(
                item.customisation
                  ?.notes,
                3000
              ),

          },


          requiredBy:
            item.requiredBy ||
            null,


          leadTime:
            item.leadTime &&
              typeof item.leadTime ===
              "object"
              ? item.leadTime
              : null,


          estimatedDispatch:
            item.estimatedDispatch &&
              typeof item
                .estimatedDispatch ===
              "object"
              ? item
                .estimatedDispatch
              : null,

        };

      }
    );


  return {

    trustedItems,

    subtotal,

    totalPieces,

  };

};


/* =====================================================
   CREATE RAZORPAY ORDER
===================================================== */

app.post(
  "/api/payments/create-order",

  async (
    req,
    res
  ) => {

    try {

      const {
        customer,
        items,
      } = req.body;


      /* ===============================================
         CUSTOMER
      =============================================== */

      const trustedCustomer =
        validateCustomer(
          customer
        );


      /* ===============================================
         PRODUCTS + PRICES
      =============================================== */

      const {
        trustedItems,
        subtotal,
        totalPieces,
      } =
        calculateOrder(
          items
        );


      const currency =
        trustedItems[0]
          ?.currency ||
        "INR";


      const shippingAmount =
        TEST_SHIPPING_AMOUNT;


      const total =
        subtotal +
        shippingAmount;


      /*
        Razorpay expects paise.

        Example:
        ₹48,000
        =
        4,800,000 paise
      */

      const amountInPaise =
        Math.round(
          total * 100
        );


      /* ===============================================
         CREATE RAZORPAY ORDER
      =============================================== */

      const razorpayOrder =
        await razorpay
          .orders
          .create({

            amount:
              amountInPaise,

            currency,

            receipt:
              `jivara_${Date.now()}`,

            notes: {
              source:
                "Jivara Website",
            },

          });


      /* ===============================================
         STORE TRUSTED ORDER UNTIL PAYMENT COMPLETES
      =============================================== */

      pendingOrders.set(
        razorpayOrder.id,
        {

          orderId:
            razorpayOrder.id,

          customer:
            trustedCustomer,

          items:
            trustedItems,

          totalPieces,

          amount:
            amountInPaise,

          pricing: {

            currency,

            subtotal,

            shippingAmount,

            total,

          },

          createdAt:
            new Date()
              .toISOString(),

        }
      );


      /* ===============================================
         FRONTEND RESPONSE
      =============================================== */

      return res.json({

        success:
          true,

        keyId:
          RAZORPAY_KEY_ID,

        orderId:
          razorpayOrder.id,

        amount:
          amountInPaise,

        currency,

        pricing: {

          currency,

          subtotal,

          shippingAmount,

          total,

        },

      });

    } catch (
    error
    ) {

      console.error(
        "Create payment order error:",
        error
      );


      return res
        .status(400)
        .json({

          success:
            false,

          message:
            error.message ||
            "Unable to create payment order.",

        });

    }

  }
);


/* =====================================================
   VERIFY PAYMENT + SAVE ORDER TO MONGODB
===================================================== */

app.post(
  "/api/payments/verify",

  async (
    req,
    res
  ) => {

    try {

      const {

        orderId,

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

      } = req.body;


      /* ===============================================
         BASIC VALIDATION
      =============================================== */

      if (
        !orderId ||
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            verified:
              false,

            message:
              "Payment verification details are incomplete.",

          });

      }


      /* ===============================================
         ALREADY SAVED?

         Makes verification idempotent.
      =============================================== */

      const alreadySaved =
        await Order.findOne({

          "payment.paymentId":
            razorpay_payment_id,

        });


      if (
        alreadySaved
      ) {

        return res.json({

          success:
            true,

          verified:
            true,

          orderNumber:
            alreadySaved
              .orderNumber,

          paymentId:
            alreadySaved
              .payment
              .paymentId,

          razorpayOrderId:
            alreadySaved
              .payment
              .razorpayOrderId,

          paymentStatus:
            alreadySaved
              .payment
              .status,

          pricing:
            alreadySaved
              .pricing,

        });

      }


      /* ===============================================
         FIND TRUSTED PENDING ORDER
      =============================================== */

      const trustedOrder =
        pendingOrders.get(
          orderId
        );


      if (
        !trustedOrder
      ) {

        return res
          .status(404)
          .json({

            success:
              false,

            verified:
              false,

            message:
              "Payment session was not found or has expired.",

          });

      }


      /* ===============================================
         RAZORPAY ORDER ID MUST MATCH
      =============================================== */

      if (
        trustedOrder.orderId !==
        razorpay_order_id
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            verified:
              false,

            message:
              "Razorpay order ID does not match.",

          });

      }


      /* ===============================================
         VERIFY SIGNATURE
      =============================================== */

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            RAZORPAY_KEY_SECRET
          )
          .update(
            `${trustedOrder.orderId}|${razorpay_payment_id}`
          )
          .digest(
            "hex"
          );


      const expectedBuffer =
        Buffer.from(
          expectedSignature
        );


      const receivedBuffer =
        Buffer.from(
          razorpay_signature
        );


      const signatureMatches =

        expectedBuffer.length ===
        receivedBuffer.length &&

        crypto.timingSafeEqual(
          expectedBuffer,
          receivedBuffer
        );


      if (
        !signatureMatches
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            verified:
              false,

            message:
              "Payment signature verification failed.",

          });

      }


      /* ===============================================
         FETCH PAYMENT DIRECTLY FROM RAZORPAY
      =============================================== */

      const payment =
        await razorpay
          .payments
          .fetch(
            razorpay_payment_id
          );


      /* ===============================================
         VERIFY PAYMENT BELONGS TO THIS ORDER
      =============================================== */

      if (
        payment.order_id !==
        trustedOrder.orderId
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            verified:
              false,

            message:
              "Payment does not belong to this order.",

          });

      }


      /* ===============================================
         VERIFY AMOUNT
      =============================================== */

      if (
        Number(
          payment.amount
        ) !==
        Number(
          trustedOrder.amount
        )
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            verified:
              false,

            message:
              "Payment amount does not match the order total.",

          });

      }


      /* ===============================================
         VERIFY PAYMENT STATUS
      =============================================== */

      if (
        payment.status !==
        "captured"
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            verified:
              false,

            message:
              `Payment has not been captured. Current status: ${payment.status}`,

          });

      }


      /* ===============================================
         GENERATE JIVARA ORDER NUMBER
      =============================================== */

      const orderNumber =
        `JIV-${Date.now()
          .toString()
          .slice(-8)}-${crypto
            .randomBytes(2)
            .toString("hex")
            .toUpperCase()}`;


      /* ===============================================
         SAVE FINAL PAID ORDER TO MONGODB
      =============================================== */

      let savedOrder;


      try {

        savedOrder =
          await Order.create({

            orderNumber,

            customer:
              trustedOrder
                .customer,

            items:
              trustedOrder
                .items,

            totalPieces:
              trustedOrder
                .totalPieces,

            pricing:
              trustedOrder
                .pricing,

            payment: {

              provider:
                "Razorpay",

              paymentId:
                razorpay_payment_id,

              razorpayOrderId:
                razorpay_order_id,

              status:
                payment.status,

            },

            paymentStatus:
              "Paid",

            orderStatus:
              "Awaiting Review",

          });

      } catch (
      databaseError
      ) {

        /*
          Handles the rare case where
          verification is submitted twice
          at almost exactly the same time.
        */

        if (
          databaseError.code ===
          11000
        ) {

          const existingOrder =
            await Order.findOne({

              "payment.paymentId":
                razorpay_payment_id,

            });


          if (
            existingOrder
          ) {

            savedOrder =
              existingOrder;

          } else {

            throw databaseError;

          }

        } else {

          throw databaseError;

        }

      }


      console.log(
        `Order saved to MongoDB: ${savedOrder.orderNumber}`
      );

      /* =====================================================
         ORDER EMAILS
      
         Email failure must NEVER cause a paid
         order to become a failed payment.
      ===================================================== */

      const emailResults =
        await Promise.allSettled([

          sendCustomerOrderConfirmation(
            savedOrder
          ),

          sendAdminNewOrderNotification(
            savedOrder
          ),

        ]);


      emailResults.forEach(
        (
          result,
          index
        ) => {

          const emailType =
            index === 0
              ? "Customer confirmation"
              : "Admin notification";


          if (
            result.status ===
            "fulfilled"
          ) {

            console.log(
              `${emailType} email sent.`
            );

          } else {

            console.error(
              `${emailType} email failed:`,
              result.reason?.message ||
              result.reason
            );

          }

        }
      );

      /* ===============================================
         REMOVE TEMPORARY ORDER
      =============================================== */

      pendingOrders.delete(
        orderId
      );


      /* ===============================================
         SUCCESS
      =============================================== */

      return res.json({

        success:
          true,

        verified:
          true,

        orderNumber:
          savedOrder
            .orderNumber,

        paymentId:
          savedOrder
            .payment
            .paymentId,

        razorpayOrderId:
          savedOrder
            .payment
            .razorpayOrderId,

        paymentStatus:
          savedOrder
            .payment
            .status,

        pricing:
          savedOrder
            .pricing,

      });

    } catch (
    error
    ) {

      console.error(
        "Payment verification error:",
        error
      );


      return res
        .status(500)
        .json({

          success:
            false,

          verified:
            false,

          message:
            "Payment was received, but the order could not be verified or saved. Please contact Jivara before attempting another payment.",

        });

    }

  }
);

/* =====================================================
   START SERVER
===================================================== */

const startServer =
  async () => {

    await connectDB();


    app.listen(
      PORT,
      "0.0.0.0",
      () => {

        console.log(
          `Jivara server running on port ${PORT}`
        );

      }
    );

  };


startServer();