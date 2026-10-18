import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  CreditCard,
  LogOut,
  MapPin,
  Package,
  Palette,
  RefreshCw,
  Ruler,
  Scissors,
  Truck,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "./CustomerOrderDetails.css";


const API_URL =
  "http://localhost:5000";


/* =====================================================
   ORDER JOURNEY
===================================================== */

const ORDER_STEPS = [
  "Awaiting Review",
  "Confirmed",
  "In Production",
  "Ready",
  "Shipped",
  "Delivered",
];


/* =====================================================
   HELPERS
===================================================== */

const formatPrice = (
  price,
  currency = "INR"
) =>
  new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  ).format(
    Number(price) || 0
  );


const formatDate = (
  value
) => {

  if (!value) {
    return "—";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);

};


const formatMeasurementName = (
  key
) =>
  String(key)
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(
      /^./,
      (character) =>
        character.toUpperCase()
    );


function CustomerOrderDetails() {

  const {
    id,
  } = useParams();


  const navigate =
    useNavigate();


  const [
    order,
    setOrder,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {

    sessionStorage.removeItem(
      "jivara-customer-token"
    );


    sessionStorage.removeItem(
      "jivara-customer"
    );


    navigate(
      "/account/login",
      {
        replace: true,
      }
    );

  };


  /* =====================================================
     LOAD ORDER
  ===================================================== */

  const loadOrder =
    async () => {

      const token =
        sessionStorage.getItem(
          "jivara-customer-token"
        );


      if (!token) {

        navigate(
          "/account/login",
          {
            replace: true,
          }
        );

        return;
      }


      setLoading(true);

      setError("");


      try {

        const response =
          await fetch(
            `${API_URL}/api/customer/account/orders/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          await response.json();


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          logout();

          return;
        }


        if (
          !response.ok ||
          !data.success
        ) {

          throw new Error(
            data.message ||
            "Unable to load this order."
          );

        }


        setOrder(
          data.order
        );

      } catch (
        loadError
      ) {

        console.error(
          loadError
        );


        setError(
          loadError.message ||
          "Unable to load this order."
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadOrder();

  }, [id]);


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <>
        <Header />

        <main className="customer-order-state">

          <RefreshCw
            size={24}
            strokeWidth={1.2}
          />

          <p>
            Loading your order...
          </p>

        </main>

        <Footer />
      </>
    );

  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (
    error &&
    !order
  ) {

    return (
      <>
        <Header />

        <main className="customer-order-state">

          <AlertCircle
            size={30}
            strokeWidth={1.2}
          />

          <h1>
            We couldn't load this order.
          </h1>

          <p>
            {error}
          </p>

          <Link to="/account">
            RETURN TO MY ACCOUNT
          </Link>

        </main>

        <Footer />
      </>
    );

  }


  if (!order) {
    return null;
  }


  const {
    customer,
    items = [],
    pricing,
  } = order;


  const currentStepIndex =
    ORDER_STEPS.indexOf(
      order.orderStatus
    );


  const isCancelled =
    order.orderStatus ===
    "Cancelled";


  return (
    <>
      <Header />


      <main className="customer-order-detail">

        <div className="customer-order-detail__container">

          {/* =================================================
              TOP
          ================================================= */}

          <div className="customer-order-detail__top">

            <Link
              to="/account"
              className="customer-order-detail__back"
            >

              <ArrowLeft
                size={15}
                strokeWidth={1.4}
              />

              MY ACCOUNT

            </Link>


            <button
              type="button"
              onClick={logout}
            >

              <LogOut
                size={15}
                strokeWidth={1.4}
              />

              LOG OUT

            </button>

          </div>


          {/* =================================================
              INTRO
          ================================================= */}

          <section className="customer-order-detail__intro">

            <div>

              <p className="customer-order-detail__eyebrow">
                YOUR JIVARA ORDER
              </p>


              <h1>
                {order.orderNumber}
              </h1>


              <p className="customer-order-detail__date">
                Ordered on{" "}
                {formatDate(
                  order.createdAt
                )}
              </p>

            </div>


            <div className="customer-order-detail__status">

              <span>
                CURRENT STATUS
              </span>

              <strong>
                {order.orderStatus}
              </strong>

            </div>

          </section>


          {/* =================================================
              CANCELLED
          ================================================= */}

          {isCancelled && (

            <div className="customer-order-cancelled">

              <AlertCircle
                size={20}
                strokeWidth={1.3}
              />

              <div>

                <span>
                  ORDER CANCELLED
                </span>

                <p>
                  This order has been marked
                  as cancelled. Please contact
                  Jivara if you need assistance.
                </p>

              </div>

            </div>

          )}


          {/* =================================================
              TIMELINE
          ================================================= */}

          {!isCancelled && (

            <section className="customer-order-progress">

              <div className="customer-order-progress__heading">

                <p>
                  ORDER JOURNEY
                </p>

                <h2>
                  Your Design's Journey
                </h2>

              </div>


              <div className="customer-order-progress__track">

                {ORDER_STEPS.map(
                  (
                    step,
                    index
                  ) => {

                    const completed =
                      index <
                      currentStepIndex;


                    const current =
                      index ===
                      currentStepIndex;


                    return (

                      <div
                        key={step}
                        className={[
                          "customer-order-progress__step",

                          completed
                            ? "completed"
                            : "",

                          current
                            ? "current"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >

                        <div className="customer-order-progress__marker">

                          {completed ? (

                            <Check
                              size={14}
                              strokeWidth={1.7}
                            />

                          ) : index + 1}

                        </div>


                        <span>
                          {step}
                        </span>

                      </div>

                    );

                  }
                )}

              </div>

            </section>

          )}


          {/* =================================================
              DELIVERY + ADDRESS
          ================================================= */}

          <section className="customer-order-detail__summary-grid">

            <article className="customer-order-summary-card">

              <div className="customer-order-summary-card__heading">

                <MapPin
                  size={18}
                  strokeWidth={1.3}
                />

                <div>

                  <p>
                    DELIVERY
                  </p>

                  <h2>
                    Shipping Address
                  </h2>

                </div>

              </div>


              <address>

                {customer?.firstName}{" "}
                {customer?.lastName}

                <br />

                {customer?.address}

                {customer?.apartment && (
                  <>
                    <br />
                    {customer.apartment}
                  </>
                )}

                <br />

                {customer?.city},{" "}
                {customer?.state}

                <br />

                {customer?.postalCode}

                <br />

                {customer?.country}

              </address>

            </article>


            <article className="customer-order-summary-card">

              <div className="customer-order-summary-card__heading">

                <CreditCard
                  size={18}
                  strokeWidth={1.3}
                />

                <div>

                  <p>
                    PAYMENT
                  </p>

                  <h2>
                    Order Summary
                  </h2>

                </div>

              </div>


              <div className="customer-order-price">

                <div>

                  <span>
                    SUBTOTAL
                  </span>

                  <strong>
                    {formatPrice(
                      pricing?.subtotal,
                      pricing?.currency
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    SHIPPING
                  </span>

                  <strong>
                    {formatPrice(
                      pricing?.shippingAmount,
                      pricing?.currency
                    )}
                  </strong>

                </div>


                <div className="customer-order-price__total">

                  <span>
                    TOTAL PAID
                  </span>

                  <strong>
                    {formatPrice(
                      pricing?.total,
                      pricing?.currency
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    PAYMENT STATUS
                  </span>

                  <strong>
                    {order.paymentStatus}
                  </strong>

                </div>

              </div>

            </article>

          </section>


          {/* =================================================
              DESIGNS
          ================================================= */}

          <section className="customer-order-designs">

            <div className="customer-order-designs__heading">

              <Package
                size={20}
                strokeWidth={1.3}
              />

              <div>

                <p>
                  YOUR DESIGNS
                </p>

                <h2>
                  Made for You
                </h2>

              </div>

            </div>


            {items.map(
              (
                item,
                itemIndex
              ) => (

                <article
                  className="customer-order-design"
                  key={`${item.productId}-${itemIndex}`}
                >

                  {/* =========================================
                      PRODUCT
                  ========================================= */}

                  <div className="customer-order-design__product">

                    <div className="customer-order-design__image">

                      {item.image ? (

                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                        />

                      ) : (

                        <Package
                          size={30}
                          strokeWidth={1.2}
                        />

                      )}

                    </div>


                    <div className="customer-order-design__info">

                      <p>
                        {item.category}
                      </p>


                      <h3>
                        {item.name}
                      </h3>


                      <div className="customer-order-design__facts">

                        <div>

                          <span>
                            QUANTITY
                          </span>

                          <strong>
                            {item.quantity}
                          </strong>

                        </div>


                        <div>

                          <span>
                            COLOUR
                          </span>

                          <strong>
                            {item.color ||
                              "Original"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            PRICE
                          </span>

                          <strong>
                            {formatPrice(
                              item.subtotal,
                              item.currency
                            )}
                          </strong>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* =========================================
                      DATES
                  ========================================= */}

                  <div className="customer-order-design__section">

                    <div className="customer-order-design__section-heading">

                      <CalendarDays
                        size={17}
                        strokeWidth={1.3}
                      />

                      <span>
                        DATES
                      </span>

                    </div>


                    <div className="customer-order-date-grid">

                      <div>

                        <span>
                          REQUIRED BY
                        </span>

                        <strong>
                          {formatDate(
                            item.requiredBy
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          ESTIMATED DISPATCH
                        </span>

                        <strong>

                          {item
                            .estimatedDispatch
                            ?.earliest
                            ? `${formatDate(
                                item
                                  .estimatedDispatch
                                  .earliest
                              )} — ${formatDate(
                                item
                                  .estimatedDispatch
                                  .latest
                              )}`
                            : "—"}

                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* =========================================
                      CUSTOMISATION
                  ========================================= */}

                  <div className="customer-order-design__section">

                    <div className="customer-order-design__section-heading">

                      <Palette
                        size={17}
                        strokeWidth={1.3}
                      />

                      <span>
                        CUSTOMISATION
                      </span>

                    </div>


                    <div className="customer-order-customisation">

                      <div>

                        <span>
                          OPTION
                        </span>

                        <strong>
                          {item.customisation
                            ?.choice ||
                            "Keep Original"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          NOTES
                        </span>

                        <p>
                          {item.customisation
                            ?.notes ||
                            "No additional customisation requested."}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* =========================================
                      MEASUREMENTS
                  ========================================= */}

                  <div className="customer-order-design__section">

                    <div className="customer-order-design__section-heading">

                      <Ruler
                        size={17}
                        strokeWidth={1.3}
                      />

                      <div>

                        <span>
                          YOUR MEASUREMENTS
                        </span>

                        <p>
                          Recorded in{" "}
                          {item.measurementUnit ===
                          "cm"
                            ? "centimetres"
                            : "inches"}
                        </p>

                      </div>

                    </div>


                    {Array.isArray(
                      item.measurements
                    ) &&
                    item.measurements.length >
                      0 ? (

                      <div className="customer-measurement-pieces">

                        {item.measurements.map(
                          (
                            measurementSet,
                            measurementIndex
                          ) => (

                            <div
                              className="customer-measurement-piece"
                              key={
                                measurementIndex
                              }
                            >

                              <h4>

                                <Scissors
                                  size={14}
                                  strokeWidth={1.3}
                                />

                                PIECE{" "}
                                {measurementIndex +
                                  1}

                              </h4>


                              <div className="customer-measurement-grid">

                                {Object.entries(
                                  measurementSet
                                ).map(
                                  ([
                                    key,
                                    value,
                                  ]) => (

                                    <div
                                      key={
                                        key
                                      }
                                    >

                                      <span>
                                        {formatMeasurementName(
                                          key
                                        )}
                                      </span>

                                      <strong>

                                        {value ||
                                          "—"}

                                        {value
                                          ? ` ${
                                              item.measurementUnit ||
                                              "in"
                                            }`
                                          : ""}

                                      </strong>

                                    </div>

                                  )
                                )}

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <p className="customer-order-design__empty">
                        No measurements were
                        recorded for this design.
                      </p>

                    )}

                  </div>

                </article>

              )
            )}

          </section>

        </div>

      </main>


      <Footer />
    </>
  );

}


export default CustomerOrderDetails;