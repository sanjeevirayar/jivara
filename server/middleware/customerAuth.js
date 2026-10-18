import jwt from "jsonwebtoken";


const customerAuth = (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;


    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {

      return res
        .status(401)
        .json({
          success: false,
          message:
            "Customer login required.",
        });

    }


    const token =
      authHeader.split(" ")[1];


    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    if (
      decoded.role !==
      "customer"
    ) {

      return res
        .status(403)
        .json({
          success: false,
          message:
            "Customer access denied.",
        });

    }


    req.customer = decoded;


    next();

  } catch (error) {

    return res
      .status(401)
      .json({
        success: false,
        message:
          "Your login session has expired. Please sign in again.",
      });

  }

};


export default customerAuth;