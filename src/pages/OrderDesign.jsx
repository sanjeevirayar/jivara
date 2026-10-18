import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowRight,
  ChevronLeft,
  Minus,
  Plus,
  Palette,
  Clock3,
  Ruler,
  ExternalLink,
  CalendarDays,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import products from "../data/products";

import "./OrderDesign.css";


/* =====================================================
   MEASUREMENT FIELDS
===================================================== */

const measurementFields = {
  lehenga: [
    { key: "bust", label: "Bust" },
    { key: "underBust", label: "Under Bust" },
    { key: "shoulder", label: "Shoulder" },
    { key: "blouseLength", label: "Blouse Length" },
    { key: "sleeveLength", label: "Sleeve Length" },
    { key: "upperArm", label: "Upper Arm" },
    { key: "waist", label: "Waist" },
    { key: "hip", label: "Hip" },
    { key: "lehengaLength", label: "Lehenga Length" },
  ],

  blouse: [
    { key: "bust", label: "Bust" },
    { key: "underBust", label: "Under Bust" },
    { key: "shoulder", label: "Shoulder" },
    { key: "blouseLength", label: "Blouse Length" },
    { key: "sleeveLength", label: "Sleeve Length" },
    { key: "armhole", label: "Armhole" },
    { key: "upperArm", label: "Upper Arm" },
  ],

  saree: [
    { key: "bust", label: "Bust" },
    { key: "underBust", label: "Under Bust" },
    { key: "shoulder", label: "Shoulder" },
    { key: "blouseLength", label: "Blouse Length" },
    { key: "sleeveLength", label: "Sleeve Length" },
    { key: "armhole", label: "Armhole" },
  ],
};


/* =====================================================
   DATE HELPERS
===================================================== */

const addDays = (date, days) => {
  const result = new Date(date);

  result.setDate(
    result.getDate() + days
  );

  return result;
};


const formatDate = (date) => {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
};


const getInputDate = (date) => {
  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(date.getDate())
      .padStart(2, "0");

  return `${year}-${month}-${day}`;
};


/* =====================================================
   PRICE HELPER
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
  ).format(price || 0);
};


function OrderDesign() {
  const { slug } = useParams();


  /* =====================================================
     PRODUCT
  ===================================================== */

  const product = products.find(
    (item) => item.slug === slug
  );


  /* =====================================================
     ORDER STATE
  ===================================================== */

  const [quantity, setQuantity] =
    useState(1);

  const [
    selectedColor,
    setSelectedColor,
  ] = useState(
    product?.colorOptions?.[0] ||
    "Original"
  );

  const [
    customColor,
    setCustomColor,
  ] = useState("");

  const [
    measurementUnit,
    setMeasurementUnit,
  ] = useState("in");

  const [
    measurementSets,
    setMeasurementSets,
  ] = useState([{}]);

  const [
    activePiece,
    setActivePiece,
  ] = useState(0);

  const [
    customisationChoice,
    setCustomisationChoice,
  ] = useState("Keep Original");

  const [
    customisationNotes,
    setCustomisationNotes,
  ] = useState("");

  const [
    requiredBy,
    setRequiredBy,
  ] = useState("");

  const [
    addedToBag,
    setAddedToBag,
  ] = useState(false);


  /* =====================================================
     RESET WHEN PRODUCT CHANGES
  ===================================================== */

  useEffect(() => {
    setQuantity(1);

    setSelectedColor(
      product?.colorOptions?.[0] ||
      "Original"
    );

    setCustomColor("");

    setMeasurementUnit("in");

    setMeasurementSets([{}]);

    setActivePiece(0);

    setCustomisationChoice(
      "Keep Original"
    );

    setCustomisationNotes("");

    setRequiredBy("");

    setAddedToBag(false);
  }, [product]);


  /* =====================================================
     PRODUCT NOT FOUND
  ===================================================== */

  if (!product) {
    return (
      <>
        <Header />

        <main className="order-design-not-found">

          <p>
            JIVARA
          </p>

          <h1>
            Design not found.
          </h1>

          <Link to="/collections">
            RETURN TO COLLECTIONS
          </Link>

        </main>

        <Footer />
      </>
    );
  }


  /* =====================================================
     PRODUCT CONFIGURATION
  ===================================================== */

  const fields =
    measurementFields[
      product.measurementType
    ] || [];


  /* =====================================================
     PRICE
  ===================================================== */

  const unitPrice =
    Number(product.price) || 0;

  const currency =
    product.currency || "INR";

  const subtotal =
    unitPrice * quantity;


  /* =====================================================
     QUANTITY
  ===================================================== */

  const increaseQuantity = () => {
    setQuantity(
      (current) => current + 1
    );

    setMeasurementSets(
      (current) => [
        ...current,
        {},
      ]
    );

    setAddedToBag(false);
  };


  const decreaseQuantity = () => {
    if (quantity <= 1) {
      return;
    }

    const nextQuantity =
      quantity - 1;

    setQuantity(nextQuantity);

    setMeasurementSets(
      (current) =>
        current.slice(
          0,
          nextQuantity
        )
    );

    if (
      activePiece >= nextQuantity
    ) {
      setActivePiece(
        nextQuantity - 1
      );
    }

    setAddedToBag(false);
  };


  /* =====================================================
     COLOUR
  ===================================================== */

  const displayColor =
    selectedColor ===
    "Custom Colour"
      ? customColor.trim() ||
        "Custom Colour"
      : selectedColor;


  /* =====================================================
     MEASUREMENTS
  ===================================================== */

  const handleMeasurementChange = (
    pieceIndex,
    key,
    value
  ) => {
    setMeasurementSets(
      (current) =>
        current.map(
          (measurementSet, index) =>
            index === pieceIndex
              ? {
                  ...measurementSet,
                  [key]: value,
                }
              : measurementSet
        )
    );

    setAddedToBag(false);
  };


  /* =====================================================
     UNIT CONVERSION
  ===================================================== */

  const changeMeasurementUnit = (
    newUnit
  ) => {
    if (
      newUnit === measurementUnit
    ) {
      return;
    }

    const converted =
      measurementSets.map(
        (measurementSet) => {
          const newMeasurements = {};

          Object.entries(
            measurementSet
          ).forEach(
            ([key, value]) => {
              if (
                value === "" ||
                value === undefined
              ) {
                newMeasurements[key] =
                  value;

                return;
              }

              const number =
                Number(value);

              if (
                Number.isNaN(number)
              ) {
                newMeasurements[key] =
                  value;

                return;
              }

              newMeasurements[key] =
                measurementUnit ===
                  "in" &&
                newUnit === "cm"
                  ? (
                      number * 2.54
                    ).toFixed(1)
                  : (
                      number / 2.54
                    ).toFixed(1);
            }
          );

          return newMeasurements;
        }
      );

    setMeasurementSets(converted);

    setMeasurementUnit(
      newUnit
    );

    setAddedToBag(false);
  };


  /* =====================================================
     MEASUREMENT PROGRESS
  ===================================================== */

  const getCompletedMeasurements = (
    pieceIndex
  ) => {
    return fields.filter(
      (field) =>
        String(
          measurementSets[
            pieceIndex
          ]?.[field.key] ?? ""
        ).trim() !== ""
    ).length;
  };


  const measurementsComplete =
    fields.length === 0 ||
    measurementSets.every(
      (measurementSet) =>
        fields.every(
          (field) =>
            String(
              measurementSet[
                field.key
              ] ?? ""
            ).trim() !== ""
        )
    );


  /* =====================================================
     CUSTOMISATION
  ===================================================== */

  const customisationComplete =
    customisationChoice ===
      "Keep Original" ||
    customisationNotes
      .trim()
      .length > 0;


  /* =====================================================
     TIMELINE
  ===================================================== */

  const today = new Date();

  const minLeadDays =
    product.leadTime?.minDays ||
    0;

  const maxLeadDays =
    product.leadTime?.maxDays ||
    0;

  const earliestDispatch =
    addDays(
      today,
      minLeadDays
    );

  const latestDispatch =
    addDays(
      today,
      maxLeadDays
    );


  const requiredDateObject =
    requiredBy
      ? new Date(
          `${requiredBy}T12:00:00`
        )
      : null;


  const requiredDateTooSoon =
    requiredDateObject &&
    requiredDateObject <
      latestDispatch;


  /* =====================================================
     VALIDATION
  ===================================================== */

  const colourComplete =
    selectedColor !==
      "Custom Colour" ||
    customColor.trim() !== "";


  const readyToAdd =
    colourComplete &&
    measurementsComplete &&
    customisationComplete &&
    requiredBy !== "" &&
    !requiredDateTooSoon;


  /* =====================================================
     ADD TO BAG
  ===================================================== */

  const handleAddToBag = () => {
    if (!readyToAdd) {
      return;
    }


    const bagItem = {
      cartItemId:
        `${product.id}-${Date.now()}`,

      productId:
        product.id,

      slug:
        product.slug,

      collectionId:
        product.collectionId,

      name:
        product.name,

      image:
        product.image,

      category:
        product.category,


      /* ===============================================
         PRICE
      =============================================== */

      price:
        unitPrice,

      currency,

      subtotal,


      /* ===============================================
         ORDER
      =============================================== */

      quantity,

      color:
        displayColor,

      measurementUnit,

      measurements:
        measurementSets,

      customisation: {
        choice:
          customisationChoice,

        notes:
          customisationNotes.trim(),
      },

      requiredBy,

      leadTime:
        product.leadTime,

      estimatedDispatch: {
        earliest:
          earliestDispatch
            .toISOString(),

        latest:
          latestDispatch
            .toISOString(),
      },

      addedAt:
        new Date()
          .toISOString(),
    };


    let currentBag = [];

    try {
      currentBag =
        JSON.parse(
          localStorage.getItem(
            "jivara-bag"
          )
        ) || [];
    } catch {
      currentBag = [];
    }


    const newBag = [
      ...currentBag,
      bagItem,
    ];


    localStorage.setItem(
      "jivara-bag",
      JSON.stringify(newBag)
    );


    window.dispatchEvent(
      new Event(
        "jivara-bag-updated"
      )
    );


    setAddedToBag(true);
  };


  return (
    <>
      <Header />


      <main className="order-design-page">

        {/* =====================================================
            BACK
        ===================================================== */}

        <div className="order-design__back">

          <Link
            to={`/product/${product.slug}`}
          >

            <ChevronLeft
              size={15}
              strokeWidth={1.5}
            />

            <span>
              BACK TO DESIGN
            </span>

          </Link>

        </div>


        {/* =====================================================
            HEADING
        ===================================================== */}

        <section className="order-design__heading">

          <p className="order-design__eyebrow">
            MADE PERSONALLY FOR YOU
          </p>


          <h1>
            Order This
            <span>
              Design.
            </span>
          </h1>


          <p className="order-design__intro">
            Personalise the design with
            your preferred colour,
            measurements and details
            before adding it to your bag.
          </p>

        </section>


        <section className="order-design__layout">


          {/* =================================================
              LEFT
          ================================================= */}

          <div className="order-design__form">


            {/* =================================================
                01 DESIGN
            ================================================= */}

            <section className="order-section">

              <div className="order-section__number">
                01
              </div>


              <div className="order-section__body">

                <p className="order-section__eyebrow">
                  YOUR DESIGN
                </p>


                <h2>
                  Selected Design
                </h2>


                <div className="order-selected-design">

                  <div className="order-selected-design__image">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                  </div>


                  <div className="order-selected-design__content">

                    <p>
                      {product.category}
                    </p>


                    <h3>
                      {product.name}
                    </h3>


                    <div className="order-selected-design__price">
                      {formatPrice(
                        unitPrice,
                        currency
                      )}
                    </div>


                    <Link
                      to={`/product/${product.slug}`}
                    >
                      VIEW DESIGN
                    </Link>

                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                02 QUANTITY
            ================================================= */}

            <section className="order-section">

              <div className="order-section__number">
                02
              </div>


              <div className="order-section__body">

                <p className="order-section__eyebrow">
                  QUANTITY
                </p>


                <h2>
                  How many would you like?
                </h2>


                <div className="order-quantity">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity === 1
                    }
                    aria-label="Decrease quantity"
                  >

                    <Minus
                      size={17}
                      strokeWidth={1.5}
                    />

                  </button>


                  <span>
                    {quantity}
                  </span>


                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    aria-label="Increase quantity"
                  >

                    <Plus
                      size={17}
                      strokeWidth={1.5}
                    />

                  </button>

                </div>


                <p className="order-section__help">
                  Each piece can have its
                  own measurements.
                </p>

              </div>

            </section>


            {/* =================================================
                03 COLOUR
            ================================================= */}

            <section className="order-section">

              <div className="order-section__number">
                03
              </div>


              <div className="order-section__body">

                <p className="order-section__eyebrow">
                  COLOUR
                </p>


                <h2>
                  Choose Your Colour
                </h2>


                <p className="order-section__description">
                  Keep the original colour
                  or request another shade.
                </p>


                <div className="order-colours">

                  {product.colorOptions?.map(
                    (color) => (

                      <button
                        type="button"
                        key={color}
                        className={
                          selectedColor ===
                          color
                            ? "order-colour order-colour--active"
                            : "order-colour"
                        }
                        onClick={() => {
                          setSelectedColor(
                            color
                          );

                          setAddedToBag(
                            false
                          );
                        }}
                      >

                        <Palette
                          size={17}
                          strokeWidth={1.35}
                        />

                        {color}

                      </button>

                    )
                  )}

                </div>


                {selectedColor ===
                  "Custom Colour" && (

                  <div className="order-custom-colour">

                    <label
                      htmlFor="custom-colour"
                    >
                      PREFERRED COLOUR
                    </label>


                    <input
                      id="custom-colour"
                      type="text"
                      value={
                        customColor
                      }
                      onChange={(e) => {
                        setCustomColor(
                          e.target.value
                        );

                        setAddedToBag(
                          false
                        );
                      }}
                      placeholder="For example: deep maroon"
                    />

                  </div>

                )}

              </div>

            </section>


            {/* =================================================
                04 MEASUREMENTS
            ================================================= */}

            <section className="order-section">

              <div className="order-section__number">
                04
              </div>


              <div className="order-section__body">

                <p className="order-section__eyebrow">
                  MEASUREMENTS
                </p>


                <h2>
                  Your Measurements
                </h2>


                <p className="order-section__description">
                  Measurements are recorded
                  separately for every piece.
                </p>


                {/* MEASUREMENT GUIDE */}

                <div className="measurement-guide">

                  <div className="measurement-guide__content">

                    <Ruler
                      size={19}
                      strokeWidth={1.3}
                    />


                    <div>

                      <span>
                        NEED HELP MEASURING?
                      </span>


                      <p>
                        Use our visual guide
                        to see where each
                        measurement should
                        be taken.
                      </p>

                    </div>

                  </div>


                  <a
                    href="/images/measurements/womens-measurement-guide.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="measurement-guide__link"
                  >

                    VIEW MEASUREMENT GUIDE

                    <ExternalLink
                      size={15}
                      strokeWidth={1.4}
                    />

                  </a>

                </div>


                {/* UNIT */}

                <div className="measurement-unit">

                  <span>
                    MEASUREMENT UNIT
                  </span>


                  <div className="measurement-unit__buttons">

                    <button
                      type="button"
                      className={
                        measurementUnit ===
                        "in"
                          ? "measurement-unit__button measurement-unit__button--active"
                          : "measurement-unit__button"
                      }
                      onClick={() =>
                        changeMeasurementUnit(
                          "in"
                        )
                      }
                    >
                      INCHES
                    </button>


                    <button
                      type="button"
                      className={
                        measurementUnit ===
                        "cm"
                          ? "measurement-unit__button measurement-unit__button--active"
                          : "measurement-unit__button"
                      }
                      onClick={() =>
                        changeMeasurementUnit(
                          "cm"
                        )
                      }
                    >
                      CM
                    </button>

                  </div>

                </div>


                {/* PIECE TABS */}

                {quantity > 1 && (

                  <div className="measurement-pieces">

                    {measurementSets.map(
                      (_, index) => (

                        <button
                          type="button"
                          key={index}
                          className={
                            activePiece ===
                            index
                              ? "measurement-piece measurement-piece--active"
                              : "measurement-piece"
                          }
                          onClick={() =>
                            setActivePiece(
                              index
                            )
                          }
                        >
                          PIECE {index + 1}
                        </button>

                      )
                    )}

                  </div>

                )}


                {/* FIELDS */}

                <div className="measurement-grid">

                  {fields.map(
                    (field) => (

                      <div
                        className="measurement-field"
                        key={field.key}
                      >

                        <label
                          htmlFor={`measurement-${activePiece}-${field.key}`}
                        >
                          {field.label}
                        </label>


                        <div className="measurement-field__input">

                          <input
                            id={`measurement-${activePiece}-${field.key}`}
                            type="number"
                            min="0"
                            step="0.1"
                            inputMode="decimal"
                            value={
                              measurementSets[
                                activePiece
                              ]?.[
                                field.key
                              ] || ""
                            }
                            onChange={(e) =>
                              handleMeasurementChange(
                                activePiece,
                                field.key,
                                e.target.value
                              )
                            }
                            placeholder="—"
                          />


                          <span>
                            {measurementUnit}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>


                <div className="measurement-progress">

                  <Ruler
                    size={17}
                    strokeWidth={1.3}
                  />


                  <p>
                    <strong>
                      {getCompletedMeasurements(
                        activePiece
                      )}
                    </strong>

                    {" "}of{" "}

                    <strong>
                      {fields.length}
                    </strong>

                    {" "}measurements entered
                    for piece{" "}
                    {activePiece + 1}
                  </p>

                </div>

              </div>

            </section>


            {/* =================================================
                05 CUSTOMISATION
            ================================================= */}

            <section className="order-section">

              <div className="order-section__number">
                05
              </div>


              <div className="order-section__body">

                <p className="order-section__eyebrow">
                  CUSTOMISATION
                </p>


                <h2>
                  Personalise the Details
                </h2>


                <p className="order-section__description">
                  Keep the design exactly as
                  shown or tell Jivara what
                  you would like adjusted.
                </p>


                <div className="customisation-options">

                  {[
                    "Keep Original",
                    "Request Changes",
                  ].map(
                    (option) => (

                      <button
                        type="button"
                        key={option}
                        className={
                          customisationChoice ===
                          option
                            ? "customisation-option customisation-option--active"
                            : "customisation-option"
                        }
                        onClick={() => {
                          setCustomisationChoice(
                            option
                          );

                          setAddedToBag(
                            false
                          );
                        }}
                      >
                        {option}
                      </button>

                    )
                  )}

                </div>


                {customisationChoice ===
                  "Request Changes" && (

                  <div className="customisation-notes">

                    <label
                      htmlFor="customisation-notes"
                    >
                      SPECIAL REQUESTS
                    </label>


                    <textarea
                      id="customisation-notes"
                      rows="5"
                      value={
                        customisationNotes
                      }
                      onChange={(e) => {
                        setCustomisationNotes(
                          e.target.value
                        );

                        setAddedToBag(
                          false
                        );
                      }}
                      placeholder="For example: change sleeve length, neckline or detailing..."
                    />


                    <p>
                      Jivara will confirm
                      feasibility before
                      production begins.
                    </p>

                  </div>

                )}


                <p className="customisation-price-note">
                  Significant design changes
                  may affect the final price.
                  Any adjustment will be
                  confirmed before payment.
                </p>

              </div>

            </section>


            {/* =================================================
                06 REQUIRED DATE
            ================================================= */}

            <section className="order-section">

              <div className="order-section__number">
                06
              </div>


              <div className="order-section__body">

                <p className="order-section__eyebrow">
                  YOUR OCCASION
                </p>


                <h2>
                  When Do You Need It?
                </h2>


                <p className="order-section__description">
                  Tell us when you need the
                  outfit so we can check it
                  against the current
                  crafting timeline.
                </p>


                <div className="required-date">

                  <label
                    htmlFor="required-by"
                  >
                    REQUIRED BY
                  </label>


                  <input
                    id="required-by"
                    type="date"
                    min={
                      getInputDate(today)
                    }
                    value={requiredBy}
                    onChange={(e) => {
                      setRequiredBy(
                        e.target.value
                      );

                      setAddedToBag(
                        false
                      );
                    }}
                  />

                </div>


                <div className="delivery-estimate">

                  <CalendarDays
                    size={19}
                    strokeWidth={1.3}
                  />


                  <div>

                    <span>
                      ESTIMATED DISPATCH
                    </span>


                    <p>
                      {formatDate(
                        earliestDispatch
                      )}
                      {" — "}
                      {formatDate(
                        latestDispatch
                      )}
                    </p>

                  </div>

                </div>


                {requiredDateTooSoon && (

                  <div className="required-date-warning">

                    <AlertTriangle
                      size={18}
                      strokeWidth={1.4}
                    />


                    <div>

                      <strong>
                        This date may be too soon.
                      </strong>


                      <p>
                        The requested date
                        falls before our
                        current maximum
                        crafting window.
                        Please contact Jivara
                        before placing this
                        order.
                      </p>


                      <Link to="/contact">
                        CONTACT JIVARA
                      </Link>

                    </div>

                  </div>

                )}

              </div>

            </section>


            {/* =================================================
                FINAL REVIEW
            ================================================= */}

            <section className="order-review">

              <p className="order-review__eyebrow">
                REVIEW YOUR ORDER
              </p>


              <h2>
                Ready for Your Bag?
              </h2>


              <div className="order-review__rows">

                <div>
                  <span>
                    Design
                  </span>

                  <p>
                    {product.name}
                  </p>
                </div>


                <div>
                  <span>
                    Unit Price
                  </span>

                  <p>
                    {formatPrice(
                      unitPrice,
                      currency
                    )}
                  </p>
                </div>


                <div>
                  <span>
                    Quantity
                  </span>

                  <p>
                    {quantity}
                  </p>
                </div>


                <div>
                  <span>
                    Colour
                  </span>

                  <p>
                    {displayColor}
                  </p>
                </div>


                <div>
                  <span>
                    Measurements
                  </span>

                  <p>
                    {measurementsComplete
                      ? "Complete"
                      : "Incomplete"}
                  </p>
                </div>


                <div>
                  <span>
                    Customisation
                  </span>

                  <p>
                    {customisationChoice}
                  </p>
                </div>


                <div>
                  <span>
                    Required By
                  </span>

                  <p>
                    {requiredDateObject
                      ? formatDate(
                          requiredDateObject
                        )
                      : "Not selected"}
                  </p>
                </div>


                <div>
                  <span>
                    Crafting Time
                  </span>

                  <p>
                    {minLeadDays}–
                    {maxLeadDays} days
                  </p>
                </div>

              </div>


              {/* ===============================================
                  PRICE TOTAL
              =============================================== */}

              <div className="order-review__total">

                <div>

                  <span>
                    SUBTOTAL
                  </span>

                  <small>
                    {quantity}{" "}
                    {quantity === 1
                      ? "piece"
                      : "pieces"}
                  </small>

                </div>


                <strong>
                  {formatPrice(
                    subtotal,
                    currency
                  )}
                </strong>

              </div>


              <p className="order-review__price-note">
                Shipping is calculated
                during checkout.
              </p>


              {!readyToAdd && (

                <p className="order-review__validation">
                  Complete all required
                  measurements, colour and
                  order details before
                  adding this design to
                  your bag.
                </p>

              )}


              <button
                type="button"
                className="order-add-to-bag"
                disabled={!readyToAdd}
                onClick={
                  handleAddToBag
                }
              >

                {addedToBag ? (
                  <>
                    <CheckCircle2
                      size={18}
                      strokeWidth={1.5}
                    />

                    <span>
                      ADDED TO BAG
                    </span>
                  </>
                ) : (
                  <>
                    <ShoppingBag
                      size={18}
                      strokeWidth={1.5}
                    />

                    <span>
                      ADD TO BAG
                    </span>

                    <ArrowRight
                      size={18}
                      strokeWidth={1.5}
                    />
                  </>
                )}

              </button>


              {addedToBag && (

                <p className="order-review__success">
                  Your design,
                  measurements and
                  customisation preferences
                  have been saved to your bag.
                </p>

              )}

            </section>

          </div>


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="order-summary">

            <p className="order-summary__eyebrow">
              YOUR ORDER
            </p>


            <h2>
              Order Summary
            </h2>


            <div className="order-summary__image">

              <img
                src={product.image}
                alt={product.name}
              />

            </div>


            <h3>
              {product.name}
            </h3>


            <div className="order-summary__details">

              <div>

                <span>
                  Unit Price
                </span>

                <p>
                  {formatPrice(
                    unitPrice,
                    currency
                  )}
                </p>

              </div>


              <div>

                <span>
                  Quantity
                </span>

                <p>
                  {quantity}
                </p>

              </div>


              <div>

                <span>
                  Colour
                </span>

                <p>
                  {displayColor}
                </p>

              </div>


              <div>

                <span>
                  Measurements
                </span>

                <p>
                  {measurementsComplete
                    ? "Complete"
                    : "Incomplete"}
                </p>

              </div>


              <div>

                <span>
                  Required By
                </span>

                <p>
                  {requiredDateObject
                    ? formatDate(
                        requiredDateObject
                      )
                    : "—"}
                </p>

              </div>


              <div>

                <span>
                  Crafting Time
                </span>

                <p>
                  {minLeadDays}–
                  {maxLeadDays} days
                </p>

              </div>

            </div>

          </aside>

        </section>

      </main>


      <Footer />
    </>
  );
}


export default OrderDesign;