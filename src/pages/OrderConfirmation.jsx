import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  ChevronLeft,
  MapPin,
  User,
  ShoppingBag,
  Palette,
  Ruler,
  CalendarDays,
  Clock3,
  Sparkles,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "./OrderConfirmation.css";


/* =====================================================
   DATE FORMATTER
===================================================== */

const formatDate = (value) => {

  if (!value) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(value)
  );

};


/* =====================================================
   PRICE FORMATTER
===================================================== */

const formatPrice = (
  price,
  currency = "INR"
) => {

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  ).format(
    Number(price) || 0
  );

};


/* =====================================================
   ITEM SUBTOTAL
===================================================== */

const getItemSubtotal = (item) => {

  if (
    typeof item.subtotal === "number"
  ) {
    return item.subtotal;
  }


  const price =
    Number(item.price) || 0;

  const quantity =
    Number(item.quantity) || 1;


  return price * quantity;

};


/* =====================================================
   MEASUREMENT LABEL
===================================================== */

const formatMeasurementLabel = (key) => {

  return key
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(
      /^./,
      (letter) =>
        letter.toUpperCase()
    );

};


function OrderConfirmation() {

  const navigate =
    useNavigate();


  /* =====================================================
     CHECKOUT DATA
  ===================================================== */

  const [
    checkout,
    setCheckout,
  ] = useState(null);


  useEffect(() => {

    try {

      const savedCheckout =
        JSON.parse(
          localStorage.getItem(
            "jivara-checkout"
          )
        );


      setCheckout(
        savedCheckout
      );

    } catch {

      setCheckout(null);

    }

  }, []);


  /* =====================================================
     NO CHECKOUT
  ===================================================== */

  if (!checkout) {

    return (
      <>
        <Header />


        <main className="order-confirmation-empty">

          <ShoppingBag
            size={34}
            strokeWidth={1.2}
          />


          <p>
            NO ORDER TO REVIEW
          </p>


          <h1>

            Your order details

            <span>
              aren't ready yet.
            </span>

          </h1>


          <Link to="/bag">
            RETURN TO BAG
          </Link>

        </main>


        <Footer />
      </>
    );

  }


  /* =====================================================
     CHECKOUT VALUES
  ===================================================== */

  const {
    customer,
    bag = [],
    totalPieces,
    pricing,
  } = checkout;


  /* =====================================================
     PRICING
  ===================================================== */

  const currency =
    pricing?.currency ||
    bag[0]?.currency ||
    "INR";


  const calculatedSubtotal =
    bag.reduce(
      (total, item) =>
        total +
        getItemSubtotal(item),
      0
    );


  const subtotal =
    typeof pricing?.subtotal ===
    "number"
      ? pricing.subtotal
      : calculatedSubtotal;


  const shippingAmount =
    typeof pricing?.shippingAmount ===
    "number"
      ? pricing.shippingAmount
      : null;


  const finalTotal =
    shippingAmount === null
      ? null
      : subtotal +
        shippingAmount;


  /* =====================================================
     CONTINUE TO PAYMENT
  ===================================================== */

  const handleProceedToPayment = () => {

    const paymentDraft = {

      customer,

      bag,

      totalPieces,

      pricing: {

        currency,

        subtotal,

        shippingAmount,

        finalTotal,

      },

      createdAt:
        new Date()
          .toISOString(),

    };


    localStorage.setItem(
      "jivara-payment-draft",
      JSON.stringify(
        paymentDraft
      )
    );


    /*
      IMPORTANT:

      We do NOT clear the bag here.

      We do NOT mark the order as confirmed here.

      We only continue to payment.

      The bag should be cleared AFTER the
      payment gateway confirms a successful
      payment.
    */


    navigate(
      "/payment"
    );

  };


  return (
    <>
      <Header />


      <main className="order-confirmation-page">


        {/* =====================================================
            BACK
        ===================================================== */}

        <div className="confirmation-back">

          <Link to="/checkout">

            <ChevronLeft
              size={15}
              strokeWidth={1.5}
            />

            EDIT CHECKOUT DETAILS

          </Link>

        </div>


        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="confirmation-heading">

          <p>
            FINAL REVIEW
          </p>


          <h1>

            Review Your

            <span>
              Jivara Order.
            </span>

          </h1>


          <p className="confirmation-heading__text">
            Please check your design,
            measurements, customisation
            and delivery details carefully
            before continuing to payment.
          </p>

        </section>


        {/* =====================================================
            LAYOUT
        ===================================================== */}

        <section className="confirmation-layout">


          {/* =================================================
              LEFT
          ================================================= */}

          <div className="confirmation-content">


            {/* ===============================================
                CUSTOMER
            =============================================== */}

            <section className="confirmation-card">

              <div className="confirmation-card__heading">

                <User
                  size={19}
                  strokeWidth={1.3}
                />


                <div>

                  <p>
                    CUSTOMER
                  </p>


                  <h2>
                    Contact Details
                  </h2>

                </div>

              </div>


              <div className="confirmation-info-grid">


                <div>

                  <span>
                    Name
                  </span>


                  <p>
                    {customer.firstName}
                    {" "}
                    {customer.lastName}
                  </p>

                </div>


                <div>

                  <span>
                    Email
                  </span>


                  <p>
                    {customer.email}
                  </p>

                </div>


                <div>

                  <span>
                    Phone / WhatsApp
                  </span>


                  <p>
                    {customer.phone}
                  </p>

                </div>

              </div>


              <Link
                to="/checkout"
                className="confirmation-edit"
              >
                EDIT DETAILS
              </Link>

            </section>


            {/* ===============================================
                SHIPPING
            =============================================== */}

            <section className="confirmation-card">

              <div className="confirmation-card__heading">

                <MapPin
                  size={19}
                  strokeWidth={1.3}
                />


                <div>

                  <p>
                    SHIPPING
                  </p>


                  <h2>
                    Delivery Address
                  </h2>

                </div>

              </div>


              <div className="confirmation-address">

                <p>
                  {customer.address}
                </p>


                {customer.apartment && (

                  <p>
                    {customer.apartment}
                  </p>

                )}


                <p>

                  {customer.city},
                  {" "}
                  {customer.state}
                  {" "}
                  {customer.postalCode}

                </p>


                <p>
                  {customer.country}
                </p>

              </div>


              <Link
                to="/checkout"
                className="confirmation-edit"
              >
                EDIT ADDRESS
              </Link>

            </section>


            {/* ===============================================
                DESIGNS
            =============================================== */}

            <section className="confirmation-designs">

              <div className="confirmation-designs__heading">

                <p>
                  YOUR DESIGNS
                </p>


                <h2>
                  Made Personally for You
                </h2>

              </div>


              {bag.map((item) => {

                const itemSubtotal =
                  getItemSubtotal(
                    item
                  );


                const itemCurrency =
                  item.currency ||
                  currency;


                return (

                  <article
                    className="confirmation-product"
                    key={
                      item.cartItemId
                    }
                  >


                    {/* IMAGE */}

                    <div className="confirmation-product__image">

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                    </div>


                    {/* CONTENT */}

                    <div className="confirmation-product__content">

                      <p className="confirmation-product__eyebrow">
                        MADE TO ORDER
                      </p>


                      <h3>
                        {item.name}
                      </h3>


                      {/* =====================================
                          BASIC INFO
                      ====================================== */}

                      <div className="confirmation-product__details">


                        <div>

                          <ShoppingBag
                            size={16}
                            strokeWidth={1.3}
                          />


                          <span>
                            Quantity
                          </span>


                          <p>
                            {item.quantity}
                          </p>

                        </div>


                        <div>

                          <Palette
                            size={16}
                            strokeWidth={1.3}
                          />


                          <span>
                            Colour
                          </span>


                          <p>
                            {item.color}
                          </p>

                        </div>


                        <div>

                          <CalendarDays
                            size={16}
                            strokeWidth={1.3}
                          />


                          <span>
                            Required By
                          </span>


                          <p>
                            {formatDate(
                              item.requiredBy
                            )}
                          </p>

                        </div>


                        <div>

                          <Clock3
                            size={16}
                            strokeWidth={1.3}
                          />


                          <span>
                            Crafting
                          </span>


                          <p>

                            {
                              item.leadTime
                                ?.minDays
                            }
                            –
                            {
                              item.leadTime
                                ?.maxDays
                            }
                            {" "}days

                          </p>

                        </div>

                      </div>


                      {/* =====================================
                          PRICE
                      ====================================== */}

                      <div className="confirmation-product__price">

                        <div>

                          <span>
                            UNIT PRICE
                          </span>


                          <p>

                            {formatPrice(
                              item.price,
                              itemCurrency
                            )}

                          </p>

                        </div>


                        <div>

                          <span>
                            ITEM SUBTOTAL
                          </span>


                          <strong>

                            {formatPrice(
                              itemSubtotal,
                              itemCurrency
                            )}

                          </strong>

                        </div>

                      </div>


                      {/* =====================================
                          MEASUREMENTS
                      ====================================== */}

                      {item.measurements?.map(
                        (
                          measurementSet,
                          index
                        ) => (

                          <div
                            className="confirmation-measurements"
                            key={index}
                          >

                            <div className="confirmation-measurements__title">

                              <Ruler
                                size={16}
                                strokeWidth={1.3}
                              />


                              <span>
                                MEASUREMENTS —
                                PIECE {index + 1}
                              </span>

                            </div>


                            <div className="confirmation-measurements__grid">

                              {Object.entries(
                                measurementSet
                              ).map(
                                (
                                  [
                                    key,
                                    value,
                                  ]
                                ) => (

                                  <div key={key}>

                                    <span>

                                      {formatMeasurementLabel(
                                        key
                                      )}

                                    </span>


                                    <p>

                                      {value}
                                      {" "}
                                      {
                                        item
                                          .measurementUnit
                                      }

                                    </p>

                                  </div>

                                )
                              )}

                            </div>

                          </div>

                        )
                      )}


                      {/* =====================================
                          CUSTOMISATION
                      ====================================== */}

                      <div className="confirmation-customisation">

                        <span>
                          CUSTOMISATION
                        </span>


                        <p>

                          {
                            item
                              .customisation
                              ?.choice ||
                            "Keep Original"
                          }

                        </p>


                        {item.customisation
                          ?.notes && (

                          <small>

                            {
                              item
                                .customisation
                                .notes
                            }

                          </small>

                        )}

                      </div>

                    </div>

                  </article>

                );

              })}

            </section>


            {/* ===============================================
                NOTES
            =============================================== */}

            {customer.notes && (

              <section className="confirmation-card">

                <div className="confirmation-card__heading">

                  <Sparkles
                    size={19}
                    strokeWidth={1.3}
                  />


                  <div>

                    <p>
                      ORDER NOTES
                    </p>


                    <h2>
                      Additional Details
                    </h2>

                  </div>

                </div>


                <p className="confirmation-notes">
                  {customer.notes}
                </p>

              </section>

            )}

          </div>


          {/* =================================================
              RIGHT SUMMARY
          ================================================= */}

          <aside className="confirmation-summary">


            <p className="confirmation-summary__eyebrow">
              FINAL ORDER
            </p>


            <h2>
              Order Summary
            </h2>


            {/* ===============================================
                BASIC INFO
            =============================================== */}

            <div className="confirmation-summary__rows">


              <div>

                <span>
                  Designs
                </span>


                <p>
                  {bag.length}
                </p>

              </div>


              <div>

                <span>
                  Total Pieces
                </span>


                <p>
                  {totalPieces}
                </p>

              </div>


              <div>

                <span>
                  Order Type
                </span>


                <p>
                  Made to Order
                </p>

              </div>

            </div>


            {/* ===============================================
                PRICE SUMMARY
            =============================================== */}

            <div className="confirmation-price">


              <div className="confirmation-price__row">

                <span>
                  SUBTOTAL
                </span>


                <p>

                  {formatPrice(
                    subtotal,
                    currency
                  )}

                </p>

              </div>


              <div className="confirmation-price__row">

                <span>
                  SHIPPING
                </span>


                <p className="confirmation-price__pending">

                  {shippingAmount === null
                    ? "Calculated before payment"
                    : formatPrice(
                        shippingAmount,
                        currency
                      )}

                </p>

              </div>


              <div className="confirmation-price__total">


                <div>

                  <span>

                    {finalTotal === null
                      ? "CURRENT ORDER VALUE"
                      : "TOTAL"}

                  </span>


                  {finalTotal === null && (

                    <small>
                      Before shipping
                    </small>

                  )}

                </div>


                <strong>

                  {formatPrice(
                    finalTotal === null
                      ? subtotal
                      : finalTotal,
                    currency
                  )}

                </strong>

              </div>

            </div>


            {/* ===============================================
                NOTICE
            =============================================== */}

            <div className="confirmation-summary__notice">

              <Clock3
                size={18}
                strokeWidth={1.3}
              />


              <p>
                Crafting begins only after
                your payment, measurements
                and requested customisations
                are confirmed by Jivara.
              </p>

            </div>


            {/* ===============================================
                PAYMENT BUTTON
            =============================================== */}

            <button
              type="button"
              className="confirmation-submit"
              onClick={
                handleProceedToPayment
              }
            >

              <span>
                CONTINUE TO SECURE PAYMENT
              </span>


              <ArrowRight
                size={18}
                strokeWidth={1.5}
              />

            </button>


            <p className="confirmation-summary__small">
              Please verify all measurements
              and order details before
              continuing to payment.
            </p>

          </aside>

        </section>

      </main>


      <Footer />
    </>
  );

}


export default OrderConfirmation;