import mongoose from "mongoose";


/* =====================================================
   ADDRESS SCHEMA
===================================================== */

const addressSchema =
  new mongoose.Schema(
    {
      label: {
        type: String,
        default: "Home",
        trim: true,
      },

      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      lastName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      apartment: {
        type: String,
        default: "",
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      postalCode: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        required: true,
        default: "India",
        trim: true,
      },

      isDefault: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );


/* =====================================================
   CUSTOMER SCHEMA
===================================================== */

const customerSchema =
  new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      lastName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      passwordHash: {
        type: String,
        required: true,
      },

      addresses: {
        type: [addressSchema],
        default: [],
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      lastLoginAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );


const Customer =
  mongoose.model(
    "Customer",
    customerSchema
  );


export default Customer;