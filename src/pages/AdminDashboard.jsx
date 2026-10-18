import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  ClipboardList,
  Clock3,
  LogOut,
  Package,
  RefreshCw,
  Scissors,
  ShoppingBag,
  Sparkles,
  Truck,
  WalletCards,
  AlertCircle,
} from "lucide-react";

import "./AdminDashboard.css";


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


function AdminDashboard() {

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
            "Unable to load dashboard."
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
          "Unable to load dashboard."
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadOrders();

  }, []);


  /* =====================================================
     STATS
  ===================================================== */

  const stats =
    useMemo(() => {

      const countStatus =
        (status) =>
          orders.filter(
            (order) =>
              order.orderStatus ===
              status
          ).length;


      const revenue =
        orders.reduce(
          (
            total,
            order
          ) => {

            if (
              order.paymentStatus !==
              "Paid"
            ) {
              return total;
            }


            return (
              total +
              Number(
                order.pricing?.total
              )
            );

          },
          0
        );


      return {

        total:
          orders.length,

        awaiting:
          countStatus(
            "Awaiting Review"
          ),

        confirmed:
          countStatus(
            "Confirmed"
          ),

        production:
          countStatus(
            "In Production"
          ),

        ready:
          countStatus(
            "Ready"
          ),

        shipped:
          countStatus(
            "Shipped"
          ),

        delivered:
          countStatus(
            "Delivered"
          ),

        revenue,

      };

    }, [orders]);


  const recentOrders =
    orders.slice(0, 5);


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


  return (
    <main className="admin-dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-dashboard__header">

        <div className="admin-dashboard__brand">

          <p>
            JIVARA
          </p>

          <span>
            Administration
          </span>

        </div>


        <nav className="admin-dashboard__nav">

          <Link
            to="/admin"
            className="active"
          >
            DASHBOARD
          </Link>


          <Link
            to="/admin/orders"
          >
            ORDERS
          </Link>


          <button
            type="button"
            onClick={
              handleLogout
            }
          >

            <LogOut
              size={15}
              strokeWidth={1.4}
            />

            LOG OUT

          </button>

        </nav>

      </header>


      <div className="admin-dashboard__container">

        {/* =================================================
            INTRO
        ================================================= */}

        <section className="admin-dashboard__intro">

          <div>

            <p className="admin-dashboard__eyebrow">
              JIVARA ADMINISTRATION
            </p>


            <h1>
              Business
              <span>
                Overview.
              </span>
            </h1>


            <p className="admin-dashboard__description">
              Track new orders, production
              progress and payments from one
              place.
            </p>

          </div>


          <button
            type="button"
            className="admin-dashboard__refresh"
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


        {error && (

          <div className="admin-dashboard__error">

            <AlertCircle
              size={18}
              strokeWidth={1.4}
            />

            <p>
              {error}
            </p>

          </div>

        )}


        {loading ? (

          <section className="admin-dashboard__loading">

            <RefreshCw
              size={22}
              strokeWidth={1.2}
            />

            <p>
              Loading Jivara dashboard...
            </p>

          </section>

        ) : (

          <>

            {/* =================================================
                PRIMARY STATS
            ================================================= */}

            <section className="admin-dashboard__stats">

              <article className="admin-stat-card">

                <ShoppingBag
                  size={21}
                  strokeWidth={1.25}
                />

                <div>

                  <span>
                    TOTAL ORDERS
                  </span>

                  <strong>
                    {stats.total}
                  </strong>

                </div>

              </article>


              <article className="admin-stat-card">

                <Clock3
                  size={21}
                  strokeWidth={1.25}
                />

                <div>

                  <span>
                    AWAITING REVIEW
                  </span>

                  <strong>
                    {stats.awaiting}
                  </strong>

                </div>

              </article>


              <article className="admin-stat-card">

                <Scissors
                  size={21}
                  strokeWidth={1.25}
                />

                <div>

                  <span>
                    IN PRODUCTION
                  </span>

                  <strong>
                    {stats.production}
                  </strong>

                </div>

              </article>


              <article className="admin-stat-card admin-stat-card--revenue">

                <WalletCards
                  size={21}
                  strokeWidth={1.25}
                />

                <div>

                  <span>
                    PAID ORDER VALUE
                  </span>

                  <strong>
                    {formatPrice(
                      stats.revenue
                    )}
                  </strong>

                </div>

              </article>

            </section>


            {/* =================================================
                PRODUCTION FLOW
            ================================================= */}

            <section className="admin-dashboard__section">

              <div className="admin-dashboard__section-title">

                <div>

                  <p>
                    PRODUCTION
                  </p>

                  <h2>
                    Order Progress
                  </h2>

                </div>

              </div>


              <div className="admin-production-grid">

                <div>

                  <ClipboardList
                    size={18}
                    strokeWidth={1.3}
                  />

                  <span>
                    CONFIRMED
                  </span>

                  <strong>
                    {stats.confirmed}
                  </strong>

                </div>


                <div>

                  <Scissors
                    size={18}
                    strokeWidth={1.3}
                  />

                  <span>
                    IN PRODUCTION
                  </span>

                  <strong>
                    {stats.production}
                  </strong>

                </div>


                <div>

                  <Sparkles
                    size={18}
                    strokeWidth={1.3}
                  />

                  <span>
                    READY
                  </span>

                  <strong>
                    {stats.ready}
                  </strong>

                </div>


                <div>

                  <Truck
                    size={18}
                    strokeWidth={1.3}
                  />

                  <span>
                    SHIPPED
                  </span>

                  <strong>
                    {stats.shipped}
                  </strong>

                </div>


                <div>

                  <Package
                    size={18}
                    strokeWidth={1.3}
                  />

                  <span>
                    DELIVERED
                  </span>

                  <strong>
                    {stats.delivered}
                  </strong>

                </div>

              </div>

            </section>


            {/* =================================================
                RECENT ORDERS
            ================================================= */}

            <section className="admin-dashboard__section">

              <div className="admin-dashboard__section-title admin-dashboard__section-title--row">

                <div>

                  <p>
                    RECENT ACTIVITY
                  </p>

                  <h2>
                    Latest Orders
                  </h2>

                </div>


                <Link
                  to="/admin/orders"
                >

                  VIEW ALL ORDERS

                  <ArrowRight
                    size={15}
                    strokeWidth={1.4}
                  />

                </Link>

              </div>


              {recentOrders.length ===
              0 ? (

                <div className="admin-dashboard__empty">

                  <Package
                    size={29}
                    strokeWidth={1.2}
                  />

                  <p>
                    No paid orders yet.
                  </p>

                </div>

              ) : (

                <div className="admin-dashboard__recent">

                  {recentOrders.map(
                    (order) => {

                      const customerName =
                        `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`
                          .trim();


                      const item =
                        order.items?.[0];


                      return (

                        <article
                          key={
                            order._id
                          }
                          className="admin-recent-order"
                          onClick={() =>
                            navigate(
                              `/admin/orders/${order._id}`
                            )
                          }
                        >

                          <div className="admin-recent-order__image">

                            {item?.image ? (

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
                                size={22}
                                strokeWidth={1.2}
                              />

                            )}

                          </div>


                          <div className="admin-recent-order__customer">

                            <span>
                              {order.orderNumber}
                            </span>

                            <strong>
                              {customerName ||
                                "Customer"}
                            </strong>

                            <p>
                              {item?.name ||
                                "Jivara Order"}
                            </p>

                          </div>


                          <div className="admin-recent-order__date">

                            <span>
                              ORDERED
                            </span>

                            <strong>
                              {formatDate(
                                order.createdAt
                              )}
                            </strong>

                          </div>


                          <div className="admin-recent-order__amount">

                            <span>
                              PAID
                            </span>

                            <strong>
                              {formatPrice(
                                order.pricing
                                  ?.total,
                                order.pricing
                                  ?.currency
                              )}
                            </strong>

                          </div>


                          <div className="admin-recent-order__status">

                            {order.orderStatus}

                          </div>


                          <ArrowRight
                            size={17}
                            strokeWidth={1.4}
                          />

                        </article>

                      );

                    }
                  )}

                </div>

              )}

            </section>

          </>

        )}

      </div>

    </main>
  );

}


export default AdminDashboard;