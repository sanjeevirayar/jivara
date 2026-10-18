import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LogOut,
  Package,
  Search,
  RefreshCw,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import "./AdminOrders.css";


const API_URL =
  "http://localhost:5000";


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


  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(value)
  );

};


function AdminOrders() {

  const navigate =
    useNavigate();


  const [
    orders,
    setOrders,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    search,
    setSearch,
  ] = useState("");


  /* =====================================================
     LOAD ORDERS
  ===================================================== */

  const loadOrders =
    async () => {

      const token =
        sessionStorage.getItem(
          "jivara-admin-token"
        );


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
            `${API_URL}/api/admin/orders`,
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

          return;

        }


        if (
          !response.ok ||
          !data.success
        ) {

          throw new Error(
            data.message ||
            "Unable to load orders."
          );

        }


        setOrders(
          data.orders || []
        );

      } catch (
        fetchError
      ) {

        console.error(
          fetchError
        );


        setError(
          fetchError.message ||
          "Unable to load orders."
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadOrders();

  }, []);


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {

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
     FILTER
  ===================================================== */

  const filteredOrders =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {
        return orders;
      }


      return orders.filter(
        (order) => {

          const customerName =
            `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`;


          const productNames =
            order.items
              ?.map(
                (item) =>
                  item.name
              )
              .join(" ") ||
            "";


          return [
            order.orderNumber,
            customerName,
            order.customer?.email,
            order.customer?.phone,
            order.orderStatus,
            productNames,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query);

        }
      );

    }, [
      orders,
      search,
    ]);


  return (
    <main className="admin-orders">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <header className="admin-orders__header">

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
          onClick={
            handleLogout
          }
        >

          <LogOut
            size={16}
            strokeWidth={1.4}
          />

          LOG OUT

        </button>

      </header>


      {/* =================================================
          INTRO
      ================================================= */}

      <section className="admin-orders__intro">

        <div>

          <p className="admin-orders__eyebrow">
            ORDER MANAGEMENT
          </p>


          <h1>
            Jivara
            <span>
              Orders.
            </span>
          </h1>


          <p className="admin-orders__description">
            Review customer orders,
            measurements, customisation
            requests, payments and
            production progress.
          </p>

        </div>


        <div className="admin-orders__count">

          <Package
            size={23}
            strokeWidth={1.25}
          />

          <div>

            <strong>
              {orders.length}
            </strong>

            <span>
              TOTAL ORDERS
            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          CONTROLS
      ================================================= */}

      <section className="admin-orders__controls">

        <div className="admin-orders__search">

          <Search
            size={17}
            strokeWidth={1.4}
          />


          <input
            type="search"
            placeholder="Search order, customer, email or design..."
            value={
              search
            }
            onChange={
              (event) =>
                setSearch(
                  event.target.value
                )
            }
          />

        </div>


        <button
          type="button"
          className="admin-orders__refresh"
          onClick={
            loadOrders
          }
        >

          <RefreshCw
            size={15}
            strokeWidth={1.4}
          />

          REFRESH

        </button>

      </section>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="admin-orders__error">

          <AlertCircle
            size={18}
            strokeWidth={1.4}
          />

          <p>
            {error}
          </p>

        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <section className="admin-orders__loading">

          <RefreshCw
            size={21}
            strokeWidth={1.2}
          />

          <p>
            Loading orders...
          </p>

        </section>

      ) : filteredOrders.length === 0 ? (

        <section className="admin-orders__empty">

          <Package
            size={31}
            strokeWidth={1.2}
          />

          <h2>
            No orders found.
          </h2>

          <p>
            Paid Jivara orders will
            appear here.
          </p>

        </section>

      ) : (

        <section className="admin-orders__list">

          {filteredOrders.map(
            (order) => {

              const customerName =
                `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`
                  .trim();


              const firstItem =
                order.items?.[0];


              return (

                <article
                  className="admin-order-card"
                  key={
                    order._id
                  }
                >

                  <div className="admin-order-card__image">

                    {firstItem?.image ? (

                      <img
                        src={
                          firstItem.image
                        }
                        alt={
                          firstItem.name
                        }
                      />

                    ) : (

                      <Package
                        size={28}
                        strokeWidth={1.2}
                      />

                    )}

                  </div>


                  <div className="admin-order-card__main">

                    <div className="admin-order-card__top">

                      <div>

                        <p className="admin-order-card__number">
                          {order.orderNumber}
                        </p>

                        <h2>
                          {customerName || "Customer"}
                        </h2>

                      </div>


                      <span
                        className="admin-order-card__status"
                      >
                        {order.orderStatus}
                      </span>

                    </div>


                    <div className="admin-order-card__product">

                      <strong>
                        {firstItem?.name ||
                          "Jivara Order"}
                      </strong>


                      {order.items?.length >
                        1 && (

                        <span>
                          +{" "}
                          {order.items.length -
                            1}{" "}
                          more design
                          {order.items.length -
                            1 >
                          1
                            ? "s"
                            : ""}
                        </span>

                      )}

                    </div>


                    <div className="admin-order-card__meta">

                      <div>

                        <span>
                          ORDERED
                        </span>

                        <p>
                          {formatDate(
                            order.createdAt
                          )}
                        </p>

                      </div>


                      <div>

                        <span>
                          PIECES
                        </span>

                        <p>
                          {order.totalPieces}
                        </p>

                      </div>


                      <div>

                        <span>
                          PAYMENT
                        </span>

                        <p>
                          {formatPrice(
                            order.pricing
                              ?.total,
                            order.pricing
                              ?.currency
                          )}
                        </p>

                      </div>


                      <div>

                        <span>
                          PAYMENT STATUS
                        </span>

                        <p>
                          {order.paymentStatus}
                        </p>

                      </div>

                    </div>

                  </div>


                  <button
                    type="button"
                    className="admin-order-card__open"
                    onClick={() =>
                      navigate(
                        `/admin/orders/${order._id}`
                      )
                    }
                  >

                    <span>
                      VIEW ORDER
                    </span>

                    <ChevronRight
                      size={17}
                      strokeWidth={1.4}
                    />

                  </button>

                </article>

              );

            }
          )}

        </section>

      )}

    </main>
  );

}


export default AdminOrders;