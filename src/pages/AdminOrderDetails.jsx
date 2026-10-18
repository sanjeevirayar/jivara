import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Package,
  UserRound,
  MapPin,
  CreditCard,
  Ruler,
  Palette,
  CalendarDays,
  FileText,
  AlertCircle,
  RefreshCw,
  LogOut,
} from "lucide-react";

import "./AdminOrderDetails.css";


const API_URL =
  "http://localhost:5000";


const ORDER_STATUSES = [
  "Awaiting Review",
  "Confirmed",
  "In Production",
  "Ready",
  "Shipped",
  "Delivered",
  "Cancelled",
];


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
    return value;
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


function AdminOrderDetails() {

  const {
    id,
  } =
    useParams();


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


  const [
    updatingStatus,
    setUpdatingStatus,
  ] = useState(false);


  /* =====================================================
     AUTH
  ===================================================== */

  const getToken = () =>
    sessionStorage.getItem(
      "jivara-admin-token"
    );


  const logout = () => {

    sessionStorage.removeItem(
      "jivara-admin-token"
    );

    sessionStorage.removeItem(
      "jivara-admin-email"
    );

    navigate(
      "/admin/login",
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
        getToken();


      if (!token) {

        navigate(
          "/admin/login",
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
            `${API_URL}/api/admin/orders/${id}`,
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
            "Unable to load order."
          );

        }


        setOrder(
          data.order
        );

      } catch (
        fetchError
      ) {

        console.error(
          fetchError
        );


        setError(
          fetchError.message ||
          "Unable to load order."
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadOrder();

  }, [id]);


  /* =====================================================
     UPDATE STATUS
  ===================================================== */

  const handleStatusChange =
    async (event) => {

      const status =
        event.target.value;


      const token =
        getToken();


      if (
        !token ||
        !order
      ) {
        return;
      }


      setUpdatingStatus(true);
      setError("");


      try {

        const response =
          await fetch(
            `${API_URL}/api/admin/orders/${order._id}/status`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  status,
                }),
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
            "Unable to update order status."
          );

        }


        setOrder(
          data.order
        );

      } catch (
        updateError
      ) {

        console.error(
          updateError
        );


        setError(
          updateError.message ||
          "Unable to update order status."
        );

      } finally {

        setUpdatingStatus(false);

      }

    };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <main className="admin-order-detail admin-order-detail--state">

        <RefreshCw
          size={24}
          strokeWidth={1.2}
        />

        <p>
          Loading order...
        </p>

      </main>
    );

  }


  /* =====================================================
     ERROR / NOT FOUND
  ===================================================== */

  if (
    error &&
    !order
  ) {

    return (
      <main className="admin-order-detail admin-order-detail--state">

        <AlertCircle
          size={30}
          strokeWidth={1.2}
        />

        <h1>
          Unable to load order.
        </h1>

        <p>
          {error}
        </p>

        <Link to="/admin/orders">
          RETURN TO ORDERS
        </Link>

      </main>
    );

  }


  if (!order) {
    return null;
  }


  const {
    customer,
    items = [],
    pricing,
    payment,
  } = order;


  return (
    <main className="admin-order-detail">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-order-detail__header">

        <div>

          <p>
            JIVARA
          </p>

          <span>
            Administration
          </span>

        </div>


        <button
          type="button"
          onClick={logout}
        >

          <LogOut
            size={16}
            strokeWidth={1.4}
          />

          LOG OUT

        </button>

      </header>


      <div className="admin-order-detail__container">

        {/* =================================================
            BACK
        ================================================= */}

        <Link
          to="/admin/orders"
          className="admin-order-detail__back"
        >

          <ArrowLeft
            size={15}
            strokeWidth={1.4}
          />

          BACK TO ORDERS

        </Link>


        {/* =================================================
            INTRO
        ================================================= */}

        <section className="admin-order-detail__intro">

          <div>

            <p className="admin-order-detail__eyebrow">
              ORDER DETAILS
            </p>

            <h1>
              {order.orderNumber}
            </h1>

            <p>
              Placed on{" "}
              {formatDate(
                order.createdAt
              )}
            </p>

          </div>


          <div className="admin-order-detail__status">

            <label>
              ORDER STATUS
            </label>

            <select
              value={
                order.orderStatus
              }
              onChange={
                handleStatusChange
              }
              disabled={
                updatingStatus
              }
            >

              {ORDER_STATUSES.map(
                (status) => (

                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>

                )
              )}

            </select>

            {updatingStatus && (
              <span>
                Updating...
              </span>
            )}

          </div>

        </section>


        {error && (

          <div className="admin-order-detail__error">

            <AlertCircle
              size={17}
              strokeWidth={1.4}
            />

            <p>
              {error}
            </p>

          </div>

        )}


        {/* =================================================
            CUSTOMER + ADDRESS
        ================================================= */}

        <section className="admin-order-detail__grid">

          <article className="admin-detail-card">

            <div className="admin-detail-card__heading">

              <UserRound
                size={18}
                strokeWidth={1.3}
              />

              <div>
                <p>
                  CUSTOMER
                </p>

                <h2>
                  Customer Details
                </h2>
              </div>

            </div>


            <div className="admin-detail-card__rows">

              <div>
                <span>
                  NAME
                </span>

                <strong>
                  {customer?.firstName}{" "}
                  {customer?.lastName}
                </strong>
              </div>


              <div>
                <span>
                  EMAIL
                </span>

                <strong>
                  {customer?.email}
                </strong>
              </div>


              <div>
                <span>
                  PHONE
                </span>

                <strong>
                  {customer?.phone}
                </strong>
              </div>

            </div>

          </article>


          <article className="admin-detail-card">

            <div className="admin-detail-card__heading">

              <MapPin
                size={18}
                strokeWidth={1.3}
              />

              <div>
                <p>
                  SHIPPING
                </p>

                <h2>
                  Address
                </h2>
              </div>

            </div>


            <address className="admin-detail-card__address">

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

        </section>


        {/* =================================================
            ITEMS
        ================================================= */}

        <section className="admin-order-items">

          <div className="admin-order-items__heading">

            <Package
              size={20}
              strokeWidth={1.3}
            />

            <div>

              <p>
                DESIGNS
              </p>

              <h2>
                Ordered Pieces
              </h2>

            </div>

          </div>


          {items.map(
            (
              item,
              itemIndex
            ) => (

              <article
                className="admin-order-item"
                key={`${item.productId}-${itemIndex}`}
              >

                {/* =========================================
                    PRODUCT
                ========================================= */}

                <div className="admin-order-item__top">

                  <div className="admin-order-item__image">

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                    ) : (

                      <Package
                        size={30}
                        strokeWidth={1.2}
                      />

                    )}

                  </div>


                  <div className="admin-order-item__info">

                    <p>
                      {item.category}
                    </p>

                    <h3>
                      {item.name}
                    </h3>


                    <div className="admin-order-item__facts">

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
                          {item.color || "—"}
                        </strong>
                      </div>


                      <div>
                        <span>
                          UNIT PRICE
                        </span>

                        <strong>
                          {formatPrice(
                            item.price,
                            item.currency
                          )}
                        </strong>
                      </div>


                      <div>
                        <span>
                          SUBTOTAL
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
                    MEASUREMENTS
                ========================================= */}

                <div className="admin-order-item__section">

                  <div className="admin-order-item__section-heading">

                    <Ruler
                      size={17}
                      strokeWidth={1.3}
                    />

                    <div>
                      <p>
                        MEASUREMENTS
                      </p>

                      <span>
                        Unit:{" "}
                        {item.measurementUnit ===
                        "cm"
                          ? "Centimetres"
                          : "Inches"}
                      </span>
                    </div>

                  </div>


                  {Array.isArray(
                    item.measurements
                  ) &&
                  item.measurements.length >
                    0 ? (

                    <div className="admin-measurement-pieces">

                      {item.measurements.map(
                        (
                          measurementSet,
                          measurementIndex
                        ) => (

                          <div
                            className="admin-measurement-piece"
                            key={measurementIndex}
                          >

                            <h4>
                              PIECE{" "}
                              {measurementIndex +
                                1}
                            </h4>


                            <div className="admin-measurement-grid">

                              {Object.entries(
                                measurementSet
                              ).map(
                                ([
                                  key,
                                  value,
                                ]) => (

                                  <div
                                    key={key}
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

                    <p className="admin-order-item__empty">
                      No measurements recorded.
                    </p>

                  )}

                </div>


                {/* =========================================
                    CUSTOMISATION
                ========================================= */}

                <div className="admin-order-item__section">

                  <div className="admin-order-item__section-heading">

                    <Palette
                      size={17}
                      strokeWidth={1.3}
                    />

                    <div>
                      <p>
                        CUSTOMISATION
                      </p>
                    </div>

                  </div>


                  <div className="admin-order-item__custom">

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
                          "No additional customisation notes."}
                      </p>
                    </div>

                  </div>

                </div>


                {/* =========================================
                    REQUIRED DATE
                ========================================= */}

                <div className="admin-order-item__section">

                  <div className="admin-order-item__section-heading">

                    <CalendarDays
                      size={17}
                      strokeWidth={1.3}
                    />

                    <div>
                      <p>
                        DELIVERY REQUIREMENT
                      </p>
                    </div>

                  </div>


                  <div className="admin-order-item__dates">

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

              </article>

            )
          )}

        </section>


        {/* =================================================
            CUSTOMER NOTES
        ================================================= */}

        {customer?.notes && (

          <section className="admin-detail-card admin-detail-card--full">

            <div className="admin-detail-card__heading">

              <FileText
                size={18}
                strokeWidth={1.3}
              />

              <div>
                <p>
                  CUSTOMER NOTES
                </p>

                <h2>
                  Additional Information
                </h2>
              </div>

            </div>


            <p className="admin-detail-card__notes">
              {customer.notes}
            </p>

          </section>

        )}


        {/* =================================================
            PAYMENT
        ================================================= */}

        <section className="admin-payment-card">

          <div className="admin-detail-card__heading">

            <CreditCard
              size={18}
              strokeWidth={1.3}
            />

            <div>
              <p>
                PAYMENT
              </p>

              <h2>
                Payment Details
              </h2>
            </div>

          </div>


          <div className="admin-payment-card__grid">

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


            <div>
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


          <div className="admin-payment-card__reference">

            <div>
              <span>
                PROVIDER
              </span>

              <p>
                {payment?.provider}
              </p>
            </div>


            <div>
              <span>
                PAYMENT ID
              </span>

              <p>
                {payment?.paymentId}
              </p>
            </div>


            <div>
              <span>
                RAZORPAY ORDER ID
              </span>

              <p>
                {payment?.razorpayOrderId}
              </p>
            </div>

          </div>

        </section>

      </div>

    </main>
  );

}


export default AdminOrderDetails;