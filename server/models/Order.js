import mongoose from "mongoose";


/* =====================================================
   CUSTOMER
===================================================== */

const customerSchema = new mongoose.Schema(
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
      trim: true,
      lowercase: true,
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
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);


/* =====================================================
   CUSTOMISATION
===================================================== */

const customisationSchema = new mongoose.Schema(
  {
    choice: {
      type: String,
      default: "Keep Original",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);


/* =====================================================
   ORDER ITEM
===================================================== */

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
    },

    slug: {
      type: String,
      default: "",
    },

    collectionId: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    color: {
      type: String,
      default: "",
    },

    measurementUnit: {
      type: String,
      default: "in",
    },

    measurements: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    customisation: {
      type: customisationSchema,
      default: () => ({
        choice: "Keep Original",
        notes: "",
      }),
    },

    requiredBy: {
      type: Date,
      default: null,
    },

    leadTime: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    estimatedDispatch: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    _id: false,
  }
);


/* =====================================================
   PRICING
===================================================== */

const pricingSchema = new mongoose.Schema(
  {
    currency: {
      type: String,
      default: "INR",
    },

    subtotal: {
      type: Number,
      required: true,
    },

    shippingAmount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);


/* =====================================================
   PAYMENT
===================================================== */

const paymentSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      default: "Razorpay",
    },

    paymentId: {
      type: String,
      required: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);


/* =====================================================
   ORDER
===================================================== */

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      type: customerSchema,
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    totalPieces: {
      type: Number,
      required: true,
    },

    pricing: {
      type: pricingSchema,
      required: true,
    },

    payment: {
      type: paymentSchema,
      required: true,
    },

    paymentStatus: {
      type: String,
      default: "Paid",
    },

    orderStatus: {
      type: String,
      default: "Awaiting Review",
    },
  },
  {
    timestamps: true,
  }
);


/* =====================================================
   PREVENT DUPLICATE PAYMENT RECORDS
===================================================== */

orderSchema.index(
  {
    "payment.paymentId": 1,
  },
  {
    unique: true,
  }
);


/* =====================================================
   EXPORT
===================================================== */

const Order = mongoose.model(
  "Order",
  orderSchema
);


export default Order;