import {
  Search,
  Heart,
  UserRound,
  ShoppingBag,
  ChevronDown,
  X,
  ArrowRight,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useWishlist,
} from "../context/WishlistContext.jsx";

import products from "../data/products";


function Header() {

  const navigate =
    useNavigate();


  /* =====================================================
     WISHLIST
  ===================================================== */

  const {
    wishlistCount,
  } = useWishlist();


  /* =====================================================
     BAG COUNT
  ===================================================== */

  const [
    bagCount,
    setBagCount,
  ] = useState(0);


  useEffect(() => {

    const updateBagCount = () => {

      try {

        const bag =
          JSON.parse(
            localStorage.getItem(
              "jivara-bag"
            )
          ) || [];


        const total =
          bag.reduce(
            (sum, item) =>
              sum +
              (
                Number(
                  item.quantity
                ) || 1
              ),
            0
          );


        setBagCount(total);

      } catch {

        setBagCount(0);

      }

    };


    updateBagCount();


    window.addEventListener(
      "jivara-bag-updated",
      updateBagCount
    );


    window.addEventListener(
      "storage",
      updateBagCount
    );


    return () => {

      window.removeEventListener(
        "jivara-bag-updated",
        updateBagCount
      );


      window.removeEventListener(
        "storage",
        updateBagCount
      );

    };

  }, []);


  /* =====================================================
     SEARCH
  ===================================================== */

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);


  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  const searchInputRef =
    useRef(null);


  /* =====================================================
     FOCUS SEARCH INPUT
  ===================================================== */

  useEffect(() => {

    if (
      searchOpen &&
      searchInputRef.current
    ) {

      searchInputRef.current.focus();

    }

  }, [searchOpen]);


  /* =====================================================
     LOCK BODY WHILE SEARCH IS OPEN
  ===================================================== */

  useEffect(() => {

    if (searchOpen) {

      document.body.style.overflow =
        "hidden";

    } else {

      document.body.style.overflow =
        "";

    }


    return () => {

      document.body.style.overflow =
        "";

    };

  }, [searchOpen]);


  /* =====================================================
     ESC KEY CLOSE
  ===================================================== */

  useEffect(() => {

    const handleEscape =
      (event) => {

        if (
          event.key === "Escape"
        ) {

          setSearchOpen(false);
          setSearchQuery("");

        }

      };


    window.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, []);


  /* =====================================================
     SEARCH RESULTS
  ===================================================== */

  const searchSuggestions =
    useMemo(() => {

      const query =
        searchQuery
          .trim()
          .toLowerCase();


      if (!query) {
        return [];
      }


      return products
        .filter(
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
              query
            );

          }
        )
        .slice(0, 5);

    }, [searchQuery]);


  /* =====================================================
     CLOSE SEARCH
  ===================================================== */

  const closeSearch = () => {

    setSearchOpen(false);

    setSearchQuery("");

  };


  /* =====================================================
     FULL SEARCH
  ===================================================== */

  const handleSearchSubmit =
    (event) => {

      event.preventDefault();


      const query =
        searchQuery.trim();


      if (!query) {
        return;
      }


      navigate(
        `/search?q=${encodeURIComponent(
          query
        )}`
      );


      closeSearch();

    };


  return (
    <>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="site-header">


        {/* =====================================================
            ANNOUNCEMENT BAR
        ===================================================== */}

        <div className="announcement-bar">

          <span>
            CRAFTED WITH LOVE, INSPIRED BY DEVOTION
          </span>


          <span
            className="announcement-divider"
            aria-hidden="true"
          >
            |
          </span>


          <Link to="/collections">
            DISCOVER THE COLLECTIONS
          </Link>

        </div>


        {/* =====================================================
            MAIN HEADER
        ===================================================== */}

        <div className="header-main">


          {/* LEFT SIDE */}

          <div className="header-left">

            <button
              type="button"
              className="ship-to"
            >

              Ship to: India


              <ChevronDown
                size={13}
                strokeWidth={1.5}
              />

            </button>

          </div>


          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="header-logo"
            aria-label="Jivara home"
          >

            <img
              src="/images/jivara-logo.png"
              alt="Jivara"
            />

          </Link>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="header-actions">


            {/* =================================================
                SEARCH
            ================================================= */}

            <button
              type="button"
              className="header-icon"
              aria-label="Search Jivara"
              onClick={() =>
                setSearchOpen(true)
              }
            >

              <Search
                size={19}
                strokeWidth={1.4}
              />

            </button>


            {/* =================================================
                WISHLIST
            ================================================= */}

            <Link
              to="/wishlist"
              className="header-icon wishlist-button"
              aria-label={
                wishlistCount > 0
                  ? `Wishlist with ${wishlistCount} saved ${wishlistCount === 1
                    ? "design"
                    : "designs"
                  }`
                  : "Wishlist"
              }
            >

              <Heart
                size={19}
                strokeWidth={1.4}
                fill={
                  wishlistCount > 0
                    ? "currentColor"
                    : "none"
                }
              />


              {wishlistCount > 0 && (

                <span className="wishlist-count">
                  {wishlistCount}
                </span>

              )}

            </Link>


            {/* =================================================
                ACCOUNT
            ================================================= */}

            <Link
              to="/account"
              className="header-icon"
              aria-label="My Jivara account"
            >

              <UserRound
                size={19}
                strokeWidth={1.4}
              />

            </Link>


            {/* =================================================
                BAG
            ================================================= */}

            <Link
              to="/bag"
              className="header-icon bag-button"
              aria-label={
                `Shopping bag with ${bagCount} ${bagCount === 1
                  ? "item"
                  : "items"
                }`
              }
            >

              <ShoppingBag
                size={19}
                strokeWidth={1.4}
              />


              <span className="bag-count">
                {bagCount}
              </span>

            </Link>

          </div>

        </div>


        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <nav className="main-nav">

          <Link to="/collections">
            Collections
          </Link>


          <Link to="/bridal">
            Bride & Groom
          </Link>


          <Link to="/women">
            Women
          </Link>


          <Link to="/collections/menswear">
            Menswear
          </Link>


          <Link to="/collections/kidswear">
            Kidswear
          </Link>


          <Link to="/our-story">
            Our Story
          </Link>


          <Link to="/contact">
            Contact
          </Link>

        </nav>

      </header>


      {/* =====================================================
          SEARCH OVERLAY
      ===================================================== */}

      {searchOpen && (

        <div className="header-search">


          {/* BACKDROP */}

          <button
            type="button"
            className="header-search__backdrop"
            onClick={
              closeSearch
            }
            aria-label="Close search"
          ></button>


          {/* =================================================
              SEARCH PANEL
          ================================================= */}

          <div className="header-search__panel">


            {/* TOP */}

            <div className="header-search__top">

              <p>
                SEARCH JIVARA
              </p>


              <button
                type="button"
                onClick={
                  closeSearch
                }
                aria-label="Close search"
              >

                <X
                  size={21}
                  strokeWidth={1.3}
                />

              </button>

            </div>


            {/* =================================================
                SEARCH INPUT
            ================================================= */}

            <form
              className="header-search__form"
              onSubmit={
                handleSearchSubmit
              }
            >

              <Search
                size={21}
                strokeWidth={1.2}
              />


              <input
                ref={
                  searchInputRef
                }
                type="search"
                value={
                  searchQuery
                }
                onChange={
                  (event) =>
                    setSearchQuery(
                      event.target.value
                    )
                }
                placeholder="Search designs, colours, collections..."
                aria-label="Search Jivara designs"
              />


              {searchQuery && (

                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery("")
                  }
                  aria-label="Clear search"
                >

                  <X
                    size={17}
                    strokeWidth={1.3}
                  />

                </button>

              )}

            </form>


            {/* =================================================
                SEARCH INTRO
            ================================================= */}

            {!searchQuery.trim() && (

              <div className="header-search__empty">

                <p>
                  Discover original Jivara
                  designs, bridal pieces,
                  handwork and more.
                </p>

              </div>

            )}


            {/* =================================================
                SEARCH RESULTS
            ================================================= */}

            {searchQuery.trim() && (

              <div className="header-search__results">

                {searchSuggestions.length >
                  0 ? (

                  <>

                    {searchSuggestions.map(
                      (product) => (

                        <Link
                          key={
                            product.id
                          }
                          to={
                            `/product/${product.slug}`
                          }
                          className="header-search__result"
                          onClick={
                            closeSearch
                          }
                        >

                          {/* IMAGE */}

                          <div className="header-search__result-image">

                            {(product.image ||
                              product.images?.[0]) && (

                                <img
                                  src={
                                    product.image ||
                                    product.images?.[0]
                                  }
                                  alt={
                                    product.name
                                  }
                                />

                              )}

                          </div>


                          {/* DETAILS */}

                          <div className="header-search__result-copy">

                            <span>
                              {product.category}
                            </span>


                            <h3>
                              {product.name}
                            </h3>


                            {typeof product.price ===
                              "number" && (

                                <p>

                                  {new Intl.NumberFormat(
                                    "en-IN",
                                    {
                                      style:
                                        "currency",

                                      currency:
                                        product.currency ||
                                        "INR",

                                      maximumFractionDigits:
                                        0,
                                    }
                                  ).format(
                                    product.price
                                  )}

                                </p>

                              )}

                          </div>


                          <ArrowRight
                            size={16}
                            strokeWidth={1.3}
                          />

                        </Link>

                      )
                    )}


                    {/* =========================================
                        VIEW ALL
                    ========================================= */}

                    <button
                      type="button"
                      className="header-search__all"
                      onClick={() => {

                        const query =
                          searchQuery.trim();


                        navigate(
                          `/search?q=${encodeURIComponent(
                            query
                          )}`
                        );


                        closeSearch();

                      }}
                    >

                      <span>
                        VIEW ALL RESULTS
                      </span>


                      <ArrowRight
                        size={15}
                        strokeWidth={1.4}
                      />

                    </button>

                  </>

                ) : (

                  /* ===========================================
                     NO RESULTS
                  =========================================== */

                  <div className="header-search__no-results">

                    <p>
                      No designs found for
                    </p>


                    <strong>
                      “{searchQuery}”
                    </strong>


                    <span>
                      Try another design,
                      colour or category.
                    </span>

                  </div>

                )}

              </div>

            )}

          </div>

        </div>

      )}

    </>
  );

}


export default Header;