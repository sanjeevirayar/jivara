import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowRight,
  Heart,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  useWishlist,
} from "../context/WishlistContext.jsx";

import collections from "../data/collections";
import products from "../data/products";

import "./CollectionDetails.css";


function CollectionDetails() {

  const {
    collectionId,
  } = useParams();


  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();


  /* =====================================================
     FIND COLLECTION
  ===================================================== */

  const collection =
    collections.find(
      (item) =>
        item.id ===
        collectionId
    );


  /* =====================================================
     FIND PRODUCTS FROM THIS COLLECTION
  ===================================================== */

  const collectionProducts =
    products.filter((product) => {

      if (
        Array.isArray(
          product.collectionId
        )
      ) {

        return product.collectionId.includes(
          collectionId
        );

      }


      return (
        product.collectionId ===
        collectionId
      );

    });


  /* =====================================================
     COLLECTION NOT FOUND
  ===================================================== */

  if (!collection) {

    return (
      <>
        <Header />


        <main className="collection-not-found">

          <h1>
            Collection not found.
          </h1>


          <Link to="/collections">
            Return to Collections
          </Link>

        </main>


        <Footer />
      </>
    );

  }


  return (
    <>
      <Header />


      <main className="collection-details-page">


        {/* =====================================================
            COLLECTION HERO
        ===================================================== */}

        <section className="collection-details-hero">

          <div className="collection-details-hero__content">

            <p className="collection-details-hero__eyebrow">
              JIVARA COLLECTION
            </p>


            <h1>
              {collection.name}
            </h1>


            <p className="collection-details-hero__description">
              {collection.description}
            </p>


            <div className="collection-details-hero__divider">

              <span></span>

              <b>
                ◇
              </b>

              <span></span>

            </div>

          </div>

        </section>


        {/* =====================================================
            PRODUCTS / DESIGNS
        ===================================================== */}

        <section className="collection-products">




          {/* =================================================
              NO PRODUCTS YET
          ================================================= */}

          {collectionProducts.length ===
            0 ? (

            <div className="collection-products__empty">

              <p>
                Designs from this collection
                are being added.
              </p>


              <Link to="/collections">
                EXPLORE OTHER COLLECTIONS
              </Link>

            </div>

          ) : (

            /* =================================================
               PRODUCT GRID
            ================================================= */

            <div className="collection-products__grid">

              {collectionProducts.map(
                (product) => {

                  const saved =
                    isWishlisted(
                      product.id
                    );


                  return (

                    <article
                      className="jivara-product-card"
                      key={
                        product.id
                      }
                    >


                      {/* =======================================
                          IMAGE
                      ======================================= */}

                      <div className="jivara-product-card__image">


                        <Link
                          to={
                            `/product/${product.slug}`
                          }
                          className="jivara-product-card__image-link"
                          aria-label={
                            `View ${product.name}`
                          }
                        >

                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                          />

                        </Link>


                        {/* =====================================
                            WISHLIST HEART
                        ===================================== */}

                        <button
                          type="button"
                          className={
                            saved
                              ? "jivara-product-card__wishlist jivara-product-card__wishlist--active"
                              : "jivara-product-card__wishlist"
                          }
                          onClick={() =>
                            toggleWishlist(
                              product
                            )
                          }
                          aria-label={
                            saved
                              ? `Remove ${product.name} from wishlist`
                              : `Add ${product.name} to wishlist`
                          }
                        >

                          <Heart
                            size={19}
                            strokeWidth={1.3}
                            fill={
                              saved
                                ? "currentColor"
                                : "none"
                            }
                          />

                        </button>

                      </div>


                      {/* =======================================
                          CONTENT
                      ======================================= */}

                      <div className="jivara-product-card__content">

                        <p className="jivara-product-card__category">
                          {product.category}
                        </p>


                        <Link
                          to={
                            `/product/${product.slug}`
                          }
                          className="jivara-product-card__title"
                        >

                          <h3>
                            {product.name}
                          </h3>

                        </Link>


                        <Link
                          to={
                            `/product/${product.slug}`
                          }
                          className="jivara-product-card__link"
                        >

                          <span>
                            VIEW DESIGN
                          </span>


                          <ArrowRight
                            size={16}
                            strokeWidth={1.4}
                          />

                        </Link>

                      </div>

                    </article>

                  );

                }
              )}

            </div>

          )}

        </section>

      </main>


      <Footer />
    </>
  );

}


export default CollectionDetails;