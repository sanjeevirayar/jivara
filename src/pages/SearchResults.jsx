import {
  Search,
  ArrowRight,
  Heart,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import products from "../data/products";

import {
  useWishlist,
} from "../context/WishlistContext.jsx";

import "./SearchResults.css";


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


function SearchResults() {

  const [
    searchParams,
  ] = useSearchParams();


  const query =
    (
      searchParams.get(
        "q"
      ) || ""
    ).trim();


  const normalizedQuery =
    query.toLowerCase();


  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();


  const results =
    normalizedQuery
      ? products.filter(
          (product) => {

            const searchableText = [
              product.name,
              product.category,
              product.description,
              product.details,
              product.work,
              product.color,
              product.fabric,
              product.occasion,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();


            return searchableText.includes(
              normalizedQuery
            );

          }
        )
      : [];


  return (
    <>
      <Header />


      <main className="search-results-page">

        <div className="search-results__container">


          <section className="search-results__heading">

            <p>
              SEARCH JIVARA
            </p>


            <h1>
              Search
              <span>
                Results.
              </span>
            </h1>


            {query && (

              <div className="search-results__summary">

                <Search
                  size={15}
                  strokeWidth={1.3}
                />


                <span>
                  {results.length}{" "}
                  {results.length === 1
                    ? "result"
                    : "results"}{" "}
                  for “{query}”
                </span>

              </div>

            )}

          </section>


          <div className="search-results__divider">

            <span></span>

            <b>
              ◇
            </b>

            <span></span>

          </div>


          {results.length === 0 ? (

            <section className="search-results__empty">

              <Search
                size={30}
                strokeWidth={1.2}
              />


              <h2>
                No designs found.
              </h2>


              <p>
                Try searching by design,
                collection, colour, fabric
                or occasion.
              </p>


              <Link to="/collections">

                EXPLORE COLLECTIONS

                <ArrowRight
                  size={15}
                  strokeWidth={1.4}
                />

              </Link>

            </section>

          ) : (

            <section className="search-results__grid">

              {results.map(
                (product) => {

                  const saved =
                    isWishlisted(
                      product.id
                    );


                  return (

                    <article
                      className="search-product-card"
                      key={
                        product.id
                      }
                    >

                      <div className="search-product-card__image">

                        <Link
                          to={
                            `/product/${product.slug}`
                          }
                        >

                          <img
                            src={
                              product.image ||
                              product.images?.[0]
                            }
                            alt={
                              product.name
                            }
                          />

                        </Link>


                        <button
                          type="button"
                          className={
                            saved
                              ? "search-product-card__heart active"
                              : "search-product-card__heart"
                          }
                          onClick={() =>
                            toggleWishlist(
                              product
                            )
                          }
                          aria-label={
                            saved
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >

                          <Heart
                            size={18}
                            strokeWidth={1.3}
                            fill={
                              saved
                                ? "currentColor"
                                : "none"
                            }
                          />

                        </button>

                      </div>


                      <div className="search-product-card__content">

                        <p>
                          {product.category}
                        </p>


                        <Link
                          to={
                            `/product/${product.slug}`
                          }
                        >

                          <h2>
                            {product.name}
                          </h2>

                        </Link>


                        {typeof product.price ===
                          "number" && (

                          <strong>

                            {formatPrice(
                              product.price,
                              product.currency
                            )}

                          </strong>

                        )}


                        <Link
                          to={
                            `/product/${product.slug}`
                          }
                          className="search-product-card__view"
                        >

                          VIEW DESIGN

                          <ArrowRight
                            size={14}
                            strokeWidth={1.4}
                          />

                        </Link>

                      </div>

                    </article>

                  );

                }
              )}

            </section>

          )}

        </div>

      </main>


      <Footer />
    </>
  );

}


export default SearchResults;