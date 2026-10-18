import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    ArrowRight,
    ChevronLeft,
    Ruler,
    Palette,
    Sparkles,
    Clock3,
    Heart,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
    useWishlist,
} from "../context/WishlistContext.jsx";

import products from "../data/products";

import "./ProductDetails.css";


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
    ).format(price);

};


function ProductDetails() {

    const {
        slug,
    } = useParams();


    /* =====================================================
       WISHLIST
    ===================================================== */

    const {
        isWishlisted,
        toggleWishlist,
    } = useWishlist();


    /* =====================================================
       FIND PRODUCT
    ===================================================== */

    const product =
        products.find(
            (item) =>
                item.slug === slug
        );


    /* =====================================================
       PRODUCT IMAGES
    ===================================================== */

    const productImages =
        product?.images?.length
            ? product.images
            : product?.image
                ? [product.image]
                : [];


    const [
        selectedImage,
        setSelectedImage,
    ] =
        useState("");


    useEffect(() => {

        if (
            productImages.length >
            0
        ) {

            setSelectedImage(
                productImages[0]
            );

        }

    }, [slug]);


    /* =====================================================
       PRODUCT NOT FOUND
    ===================================================== */

    if (!product) {

        return (
            <>
                <Header />


                <main className="product-not-found">

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
       WISHLIST STATE
    ===================================================== */

    const saved =
        isWishlisted(
            product.id
        );


    return (
        <>
            <Header />


            <main className="product-details-page">


                {/* =====================================================
                    BACK LINK
                ===================================================== */}

                <div className="product-details__back">

                    <Link
                        to={`/collections/${product.collectionId}`}
                    >

                        <ChevronLeft
                            size={15}
                            strokeWidth={1.5}
                        />


                        <span>
                            BACK TO COLLECTION
                        </span>

                    </Link>

                </div>


                {/* =====================================================
                    MAIN PRODUCT AREA
                ===================================================== */}

                <section className="product-details">


                    {/* =================================================
                        IMAGE GALLERY
                    ================================================= */}

                    <div className="product-gallery">


                        {/* MAIN IMAGE */}

                        <div className="product-gallery__main">

                            {selectedImage && (

                                <img
                                    src={
                                        selectedImage
                                    }
                                    alt={
                                        product.name
                                    }
                                />

                            )}


                            {/* =========================================
                                IMAGE WISHLIST HEART
                            ========================================= */}

                            <button
                                type="button"
                                className={
                                    saved
                                        ? "product-gallery__wishlist product-gallery__wishlist--active"
                                        : "product-gallery__wishlist"
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
                                    size={20}
                                    strokeWidth={1.3}
                                    fill={
                                        saved
                                            ? "currentColor"
                                            : "none"
                                    }
                                />

                            </button>

                        </div>


                        {/* THUMBNAILS */}

                        {productImages.length >
                            1 && (

                            <div className="product-gallery__thumbnails">

                                {productImages.map(
                                    (
                                        image,
                                        index
                                    ) => (

                                        <button
                                            type="button"
                                            key={`${image}-${index}`}
                                            className={
                                                selectedImage ===
                                                image
                                                    ? "product-gallery__thumbnail product-gallery__thumbnail--active"
                                                    : "product-gallery__thumbnail"
                                            }
                                            onClick={() =>
                                                setSelectedImage(
                                                    image
                                                )
                                            }
                                            aria-label={`View ${product.name} image ${index + 1}`}
                                        >

                                            <img
                                                src={
                                                    image
                                                }
                                                alt=""
                                            />

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    <div className="product-info">

                        <p className="product-info__eyebrow">
                            ORIGINAL JIVARA DESIGN
                        </p>


                        <h1>
                            {product.name}
                        </h1>


                        {/* =================================================
                            PRICE
                        ================================================= */}

                        {typeof product.price ===
                            "number" && (

                            <div className="product-info__price">

                                <span className="product-info__price-value">

                                    {formatPrice(
                                        product.price,
                                        product.currency
                                    )}

                                </span>


                                <span className="product-info__price-label">
                                    MADE TO ORDER
                                </span>

                            </div>

                        )}


                        {/* =================================================
                            WISHLIST BUTTON
                        ================================================= */}

                        <button
                            type="button"
                            className={
                                saved
                                    ? "product-info__wishlist product-info__wishlist--active"
                                    : "product-info__wishlist"
                            }
                            onClick={() =>
                                toggleWishlist(
                                    product
                                )
                            }
                        >

                            <Heart
                                size={17}
                                strokeWidth={1.3}
                                fill={
                                    saved
                                        ? "currentColor"
                                        : "none"
                                }
                            />


                            <span>

                                {saved
                                    ? "SAVED TO WISHLIST"
                                    : "SAVE TO WISHLIST"}

                            </span>

                        </button>


                        <div className="product-info__divider">

                            <span></span>

                            <b>
                                ◇
                            </b>

                            <span></span>

                        </div>


                        <p className="product-info__description">
                            {product.description}
                        </p>


                        {product.details && (

                            <p className="product-info__details">
                                {product.details}
                            </p>

                        )}


                        {/* =================================================
                            DESIGN HIGHLIGHTS
                        ================================================= */}

                        <div className="product-info__highlights">


                            {product.work && (

                                <div className="product-info__highlight">

                                    <Sparkles
                                        size={19}
                                        strokeWidth={1.3}
                                    />


                                    <div>

                                        <span>
                                            CRAFT
                                        </span>


                                        <p>
                                            {product.work}
                                        </p>

                                    </div>

                                </div>

                            )}


                            {product.color && (

                                <div className="product-info__highlight">

                                    <Palette
                                        size={19}
                                        strokeWidth={1.3}
                                    />


                                    <div>

                                        <span>
                                            COLOUR
                                        </span>


                                        <p>
                                            {product.color}
                                        </p>

                                    </div>

                                </div>

                            )}


                            {product.madeToMeasure && (

                                <div className="product-info__highlight">

                                    <Ruler
                                        size={19}
                                        strokeWidth={1.3}
                                    />


                                    <div>

                                        <span>
                                            FIT
                                        </span>


                                        <p>
                                            Made to your measurements
                                        </p>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            PRODUCT SPECS
                        ================================================= */}

                        <div className="product-info__specs">


                            {product.fabric && (

                                <div className="product-info__spec">

                                    <span>
                                        Fabric
                                    </span>


                                    <p>
                                        {product.fabric}
                                    </p>

                                </div>

                            )}


                            {product.occasion && (

                                <div className="product-info__spec">

                                    <span>
                                        Occasion
                                    </span>


                                    <p>
                                        {product.occasion}
                                    </p>

                                </div>

                            )}


                            {product.leadTime && (

                                <div className="product-info__spec">

                                    <span>
                                        Crafting Time
                                    </span>


                                    <p>
                                        {product.leadTime.minDays}–
                                        {product.leadTime.maxDays} days
                                    </p>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            CUSTOMISATION
                        ================================================= */}

                        {product.customisable && (

                            <div className="product-info__custom">

                                <p className="product-info__custom-title">
                                    MADE PERSONAL TO YOU
                                </p>


                                <p>
                                    This Jivara design can be recreated and
                                    personalised to your measurements, colours
                                    and preferences.
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            ORDER INFORMATION
                        ================================================= */}

                        <div className="product-info__order-message">

                            <Clock3
                                size={18}
                                strokeWidth={1.3}
                            />


                            <div>

                                <span>
                                    MADE TO ORDER
                                </span>


                                <p>
                                    Select your colour, quantity, measurements
                                    and personalisation in the next step.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            ORDER BUTTON
                        ================================================= */}

                        <Link
                            to={`/order/${product.slug}`}
                            className="product-info__button"
                        >

                            <span>
                                ORDER THIS DESIGN
                            </span>


                            <ArrowRight
                                size={18}
                                strokeWidth={1.5}
                            />

                        </Link>


                        {/* =================================================
                            CTA SUPPORT TEXT
                        ================================================= */}

                        <p className="product-info__order-benefits">

                            Made to your measurements

                            <span>
                                •
                            </span>

                            Customisable colours & details

                        </p>


                        {/* =================================================
                            HANDCRAFTED NOTE
                        ================================================= */}

                        <p className="product-info__note">

                            Every recreated piece is individually crafted.
                            Final details may vary according to your chosen
                            fabric, colour, measurements and customisation.

                        </p>

                    </div>

                </section>

            </main>


            <Footer />
        </>
    );

}


export default ProductDetails;