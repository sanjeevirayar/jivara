import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const router =
  express.Router();


/* =====================================================
   ADMIN LOGIN
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


      const adminEmail =
        process.env.ADMIN_EMAIL
          ?.trim()
          .toLowerCase();


      const submittedEmail =
        String(email)
          .trim()
          .toLowerCase();


      /* =================================================
         EMAIL CHECK
      ================================================= */

      if (
        submittedEmail !==
        adminEmail
      ) {

        return res
          .status(401)
          .json({
            success: false,
            message:
              "Invalid email or password.",
          });

      }


      /* =================================================
         PASSWORD CHECK
      ================================================= */

      const passwordMatches =
        await bcrypt.compare(
          password,
          process.env
            .ADMIN_PASSWORD_HASH
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


      /* =================================================
         JWT
      ================================================= */

      const token =
        jwt.sign(
          {
            email:
              adminEmail,

            role:
              "admin",
          },

          process.env.JWT_SECRET,

          {
            expiresIn:
              "8h",
          }
        );


      return res.json({
        success: true,

        token,

        admin: {
          email:
            adminEmail,
        },
      });

    } catch (error) {

      console.error(
        "Admin login error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to log in.",
        });

    }

  }
);


export default router;