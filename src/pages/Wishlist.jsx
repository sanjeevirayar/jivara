import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  useWishlist,
} from "../context/WishlistContext.jsx";

import "./Wishlist.css";


/* =====================================================
   PRICE
===================================================== */

const formatPrice = (
  price,
  currency = "INR"
) => {

  if (
    typeof price === "string" &&
    /[₹$€£]/.test(price)
  ) {
    return price;
  }


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


function Wishlist() {

  const navigate =
    useNavigate();


  const {
    wishlist,
    wishlistCount,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();


  /* =====================================================
     EMPTY
  ===================================================== */

  if (
    wishlist.length === 0
  ) {

    return (
      <>
        <Header />


        <main className="wishlist-empty">

          <div className="wishlist-empty__icon">

            <Heart
              size={31}
              strokeWidth={1.2}
            />

          </div>


          <p className="wishlist-empty__eyebrow">
            YOUR WISHLIST
          </p>


          <h1>
            Save the designs
            <span>
              you love.
            </span>
          </h1>


          <p className="wishlist-empty__copy">
            Keep your favourite Jivara
            designs together and return
            to them whenever inspiration
            strikes.
          </p>


          <Link
            to="/collections"
            className="wishlist-empty__button"
          >

            DISCOVER COLLECTIONS

            <ArrowRight
              size={16}
              strokeWidth={1.4}
            />

          </Link>

        </main>


        <Footer />
      </>
    );

  }


  return (
    <>
      <Header />


      <main className="wishlist-page">

        <div className="wishlist-page__container">


          {/* =================================================
              HEADING
          ================================================= */}

          <section className="wishlist-heading">

            <div>

              <p>
                MY JIVARA
              </p>


              <h1>
                Designs You've
                <span>
                  Saved.
                </span>
              </h1>


              <div className="wishlist-heading__count">

                <Heart
                  size={15}
                  strokeWidth={1.3}
                />

                {wishlistCount}{" "}
                {wishlistCount === 1
                  ? "saved design"
                  : "saved designs"}

              </div>

            </div>


            <button
              type="button"
              className="wishlist-clear"
              onClick={() => {

                const confirmed =
                  window.confirm(
                    "Remove all designs from your wishlist?"
                  );


                if (
                  confirmed
                ) {

                  clearWishlist();

                }

              }}
            >

              CLEAR WISHLIST

            </button>

          </section>


          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="wishlist-divider">

            <span></span>

            <b>
              ◇
            </b>

            <span></span>

          </div>


          {/* =================================================
              PRODUCTS
          ================================================= */}

          <section className="wishlist-grid">

            {wishlist.map(
              (product) => (

                <article
                  className="wishlist-card"
                  key={
                    product.id
                  }
                >

                  {/* =========================================
                      IMAGE
                  ========================================= */}

                  <div className="wishlist-card__image">

                    <Link
                      to={
                        `/product/${product.slug}`
                      }
                    >

                      {product.image ? (

                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                        />

                      ) : (

                        <div className="wishlist-card__placeholder">

                          <ShoppingBag
                            size={30}
                            strokeWidth={1.1}
                          />

                        </div>

                      )}

                    </Link>


                    <button
                      type="button"
                      className="wishlist-card__heart"
                      onClick={() =>
                        removeFromWishlist(
                          product.id
                        )
                      }
                      aria-label={
                        `Remove ${product.name} from wishlist`
                      }
                    >

                      <Heart
                        size={19}
                        strokeWidth={1.3}
                        fill="currentColor"
                      />

                    </button>

                  </div>


                  {/* =========================================
                      INFORMATION
                  ========================================= */}

                  <div className="wishlist-card__content">

                    <p className="wishlist-card__category">
                      {product.category ||
                        "Jivara Design"}
                    </p>


                    <Link
                      to={
                        `/product/${product.slug}`
                      }
                      className="wishlist-card__name"
                    >
                      {product.name}
                    </Link>


                    <div className="wishlist-card__bottom">

                      <strong>

                        {formatPrice(
                          product.price,
                          product.currency
                        )}

                      </strong>


                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/product/${product.slug}`
                          )
                        }
                      >

                        VIEW DESIGN

                        <ArrowRight
                          size={14}
                          strokeWidth={1.4}
                        />

                      </button>

                    </div>

                  </div>


                  {/* =========================================
                      REMOVE
                  ========================================= */}

                  <button
                    type="button"
                    className="wishlist-card__remove"
                    onClick={() =>
                      removeFromWishlist(
                        product.id
                      )
                    }
                  >

                    <Trash2
                      size={13}
                      strokeWidth={1.3}
                    />

                    REMOVE

                  </button>

                </article>

              )
            )}

          </section>


          {/* =================================================
              CONTINUE SHOPPING
          ================================================= */}

          <div className="wishlist-continue">

            <Link
              to="/collections"
            >

              CONTINUE DISCOVERING

              <ArrowRight
                size={15}
                strokeWidth={1.4}
              />

            </Link>

          </div>

        </div>

      </main>


      <Footer />
    </>
  );

}


export default Wishlist;