import express from "express";

import {
  sendContactEnquiryNotification,
} from "../services/emailService.js";


const router =
  express.Router();


/* =====================================================
   HELPERS
===================================================== */

const cleanString = (
  value,
  maxLength = 1000
) => {

  if (
    typeof value !== "string"
  ) {

    return "";

  }


  return value
    .trim()
    .slice(
      0,
      maxLength
    );

};


/* =====================================================
   CONTACT ENQUIRY
===================================================== */

router.post(
  "/",
  async (
    req,
    res
  ) => {

    try {

      const name =
        cleanString(
          req.body.name,
          120
        );


      const email =
        cleanString(
          req.body.email,
          200
        ).toLowerCase();


      const phone =
        cleanString(
          req.body.phone,
          40
        );


      const enquiryType =
        cleanString(
          req.body.enquiryType,
          100
        ) ||
        "General Enquiry";


      const message =
        cleanString(
          req.body.message,
          3000
        );


      const website =
        cleanString(
          req.body.website,
          200
        );


      /* ===============================================
         HONEYPOT
      =============================================== */

      if (website) {

        return res.status(200).json({
          success: true,
        });

      }


      /* ===============================================
         VALIDATION
      =============================================== */

      if (
        !name ||
        !email ||
        !message
      ) {

        return res
          .status(400)
          .json({
            message:
              "Name, email and message are required.",
          });

      }


      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailPattern.test(
          email
        )
      ) {

        return res
          .status(400)
          .json({
            message:
              "Please enter a valid email address.",
          });

      }


      /* ===============================================
         SEND EMAIL
      =============================================== */

      await sendContactEnquiryNotification({
        name,
        email,
        phone,
        enquiryType,
        message,
      });


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Your enquiry has been sent.",
        });

    } catch (error) {

      console.error(
        "Contact enquiry failed:",
        error
      );


      return res
        .status(500)
        .json({
          message:
            "We couldn't send your enquiry right now. Please try again.",
        });

    }

  }
);


export default router;