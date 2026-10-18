import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ChevronLeft,
  ShoppingBag,
  Trash2,
  Ruler,
  Palette,
  CalendarDays,
  Clock3,
  IndianRupee,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "./Bag.css";


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
  ).format(Number(price) || 0);
};


/* =====================================================
   ITEM SUBTOTAL
===================================================== */

const getItemSubtotal = (item) => {
  /*
    Prefer the subtotal saved by OrderDesign.

    The fallback also allows older bag items
    containing price + quantity to continue working.
  */

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


function Bag() {

  const [bag, setBag] =
    useState([]);


  /* =====================================================
     LOAD BAG
  ===================================================== */

  const loadBag = () => {

    try {

      const savedBag =
        JSON.parse(
          localStorage.getItem(
            "jivara-bag"
          )
        ) || [];


      setBag(savedBag);

    } catch {

      setBag([]);

    }

  };


  useEffect(() => {

    loadBag();


    const handleBagUpdate = () => {
      loadBag();
    };


    window.addEventListener(
      "jivara-bag-updated",
      handleBagUpdate
    );


    window.addEventListener(
      "storage",
      handleBagUpdate
    );


    return () => {

      window.removeEventListener(
        "jivara-bag-updated",
        handleBagUpdate
      );


      window.removeEventListener(
        "storage",
        handleBagUpdate
      );

    };

  }, []);


  /* =====================================================
     SAVE BAG
  ===================================================== */

  const saveBag = (updatedBag) => {

    localStorage.setItem(
      "jivara-bag",
      JSON.stringify(updatedBag)
    );


    setBag(updatedBag);


    window.dispatchEvent(
      new Event(
        "jivara-bag-updated"
      )
    );

  };


  /* =====================================================
     REMOVE ITEM
  ===================================================== */

  const removeItem = (
    cartItemId
  ) => {

    const updatedBag =
      bag.filter(
        (item) =>
          item.cartItemId !==
          cartItemId
      );


    saveBag(updatedBag);

  };


  /* =====================================================
     CLEAR BAG
  ===================================================== */

  const clearBag = () => {

    localStorage.removeItem(
      "jivara-bag"
    );


    setBag([]);


    window.dispatchEvent(
      new Event(
        "jivara-bag-updated"
      )
    );

  };


  /* =====================================================
     TOTAL QUANTITY
  ===================================================== */

  const totalPieces =
    bag.reduce(
      (total, item) =>
        total +
        (Number(item.quantity) || 1),
      0
    );


  /* =====================================================
     BAG SUBTOTAL
  ===================================================== */

  const bagSubtotal =
    bag.reduce(
      (total, item) =>
        total +
        getItemSubtotal(item),
      0
    );


  /* =====================================================
     CURRENCY
  ===================================================== */

  const bagCurrency =
    bag[0]?.currency ||
    "INR";


  /* =====================================================
     DATE FORMAT
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


  return (
    <>
      <Header />


      <main className="bag-page">


        {/* =====================================================
            EMPTY BAG
        ===================================================== */}

        {bag.length === 0 ? (

          <section className="bag-empty">

            <ShoppingBag
              size={34}
              strokeWidth={1.2}
            />


            <p className="bag-empty__eyebrow">
              YOUR BAG IS EMPTY
            </p>


            <h2>
              Find a Design
              <span>
                Made for You.
              </span>
            </h2>


            <p className="bag-empty__text">
              Explore Jivara's original
              collections and personalise
              a design for your
              measurements.
            </p>


            <Link
              to="/collections"
              className="bag-empty__button"
            >

              <span>
                EXPLORE COLLECTIONS
              </span>


              <ArrowRight
                size={17}
                strokeWidth={1.4}
              />

            </Link>

          </section>

        ) : (

          /* ===================================================
             BAG CONTENT
          =================================================== */

          <section className="bag-layout">


            {/* =================================================
                LEFT — ITEMS
            ================================================= */}

            <div className="bag-items">


              {/* ===============================================
                  BAG HEADER
              =============================================== */}

              <div className="bag-items__top">

                <div>

                  <p>
                    YOUR DESIGNS
                  </p>


                  <h2>

                    {totalPieces}{" "}

                    {totalPieces === 1
                      ? "Piece"
                      : "Pieces"}

                  </h2>

                </div>


                <button
                  type="button"
                  onClick={clearBag}
                  className="bag-clear"
                >
                  CLEAR BAG
                </button>

              </div>


              {/* ===============================================
                  BAG ITEMS
              =============================================== */}

              {bag.map((item) => {

                const itemSubtotal =
                  getItemSubtotal(item);

                const itemCurrency =
                  item.currency ||
                  "INR";


                return (

                  <article
                    className="bag-item"
                    key={item.cartItemId}
                  >


                    {/* =========================================
                        IMAGE
                    ========================================= */}

                    <Link
                      to={`/product/${item.slug}`}
                      className="bag-item__image"
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                    </Link>


                    {/* =========================================
                        CONTENT
                    ========================================= */}

                    <div className="bag-item__content">


                      <p className="bag-item__eyebrow">
                        MADE TO ORDER
                      </p>


                      <Link
                        to={`/product/${item.slug}`}
                        className="bag-item__name"
                      >
                        {item.name}
                      </Link>


                      {/* =====================================
                          ITEM DETAILS
                      ====================================== */}

                      <div className="bag-item__details">


                        {/* UNIT PRICE */}

                        <div>

                          <IndianRupee
                            size={16}
                            strokeWidth={1.3}
                          />


                          <span>
                            Unit Price
                          </span>


                          <p>
                            {formatPrice(
                              item.price,
                              itemCurrency
                            )}
                          </p>

                        </div>


                        {/* QUANTITY */}

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


                        {/* COLOUR */}

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


                        {/* FIT */}

                        <div>

                          <Ruler
                            size={16}
                            strokeWidth={1.3}
                          />


                          <span>
                            Fit
                          </span>


                          <p>
                            Made to Measure
                          </p>

                        </div>


                        {/* REQUIRED DATE */}

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

                      </div>

                      {/* =====================================
                          MEASUREMENTS
                      ====================================== */}

                      <div className="bag-item__measurement-summary">

                        <span>
                          MEASUREMENTS
                        </span>


                        <p>

                          {item.measurements?.length || 0}
                          {" "}

                          {item.measurements?.length === 1
                            ? "measurement set saved"
                            : "measurement sets saved"}

                          {" "}•{" "}

                          {item.measurementUnit === "cm"
                            ? "Centimetres"
                            : "Inches"}

                        </p>

                      </div>


                      {/* =====================================
                          CUSTOMISATION
                      ====================================== */}

                      <div className="bag-item__customisation">

                        <span>
                          CUSTOMISATION
                        </span>


                        <p>

                          {item.customisation
                            ?.choice ||
                            "Keep Original"}

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


                      {/* =====================================
                          TIMELINE
                      ====================================== */}

                      {item.leadTime && (

                        <div className="bag-item__timeline">

                          <Clock3
                            size={17}
                            strokeWidth={1.3}
                          />


                          <div>

                            <span>
                              ESTIMATED CRAFTING
                            </span>


                            <p>

                              {
                                item
                                  .leadTime
                                  .minDays
                              }
                              –
                              {
                                item
                                  .leadTime
                                  .maxDays
                              }
                              {" "}days

                            </p>

                          </div>

                        </div>

                      )}


                      {/* =====================================
                          ACTIONS
                      ====================================== */}

                      <div className="bag-item__actions">


                        <Link
                          to={`/product/${item.slug}`}
                        >
                          VIEW DESIGN
                        </Link>


                        <Link
                          to={`/order/${item.slug}`}
                        >
                          ORDER AGAIN / EDIT
                        </Link>


                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.cartItemId
                            )
                          }
                        >

                          <Trash2
                            size={14}
                            strokeWidth={1.4}
                          />

                          REMOVE

                        </button>

                      </div>

                    </div>

                  </article>

                );

              })}

            </div>


            {/* =================================================
                RIGHT — SUMMARY
            ================================================= */}

            <aside className="bag-summary">


              <p className="bag-summary__eyebrow">
                ORDER SUMMARY
              </p>


              <h2>
                Your Jivara Order
              </h2>


              <div className="bag-summary__rows">


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


                <div>

                  <span>
                    Shipping
                  </span>


                  <p>
                    Calculated at checkout
                  </p>

                </div>

              </div>


              {/* ===============================================
                  PRICE SUMMARY
              =============================================== */}

              <div className="bag-summary__price">


                <div className="bag-summary__subtotal">

                  <span>
                    SUBTOTAL
                  </span>


                  <strong>

                    {formatPrice(
                      bagSubtotal,
                      bagCurrency
                    )}

                  </strong>

                </div>


                <p>
                  Taxes and shipping, if
                  applicable, will be shown
                  before payment.
                </p>

              </div>


              {/* ===============================================
                  CUSTOMISATION NOTICE
              =============================================== */}

              <div className="bag-summary__custom-note">

                <span>
                  CUSTOM ORDERS
                </span>


                <p>
                  Significant design changes
                  may affect the final price.
                  Any adjustment will be
                  confirmed before payment.
                </p>

              </div>


              {/* ===============================================
                  CRAFTING NOTICE
              =============================================== */}

              <div className="bag-summary__notice">

                <Clock3
                  size={18}
                  strokeWidth={1.3}
                />


                <p>
                  Crafting begins after
                  your order details,
                  measurements,
                  customisation and payment
                  are confirmed by Jivara.
                </p>

              </div>


              {/* ===============================================
                  CHECKOUT BUTTON
              =============================================== */}

              <Link
                to="/checkout"
                className="bag-summary__button"
              >

                <span>
                  CONTINUE TO CHECKOUT
                </span>


                <ArrowRight
                  size={18}
                  strokeWidth={1.5}
                />

              </Link>


              <Link
                to="/collections"
                className="bag-summary__continue"
              >

                <ChevronLeft
                  size={14}
                  strokeWidth={1.4}
                />

                CONTINUE EXPLORING

              </Link>

            </aside>

          </section>

        )}

      </main>


      <Footer />
    </>
  );

}


export default Bag;