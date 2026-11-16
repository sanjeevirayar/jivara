import "./Lookbook.css";

import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";


const looks = [
    {
        id: 1,
        image: "/images/lookbook/look-1.webp",
        alt: "Jivara custom occasion wear",
        position: "center center",

        // Future:
        // description: "Description for this Jivara creation.",
    },

    {
        id: 2,
        image: "/images/lookbook/look-2.webp",
        alt: "Jivara handcrafted outfit",
        position: "center 15%",

        // Future:
        // description: "Description for this Jivara creation.",
    },

    {
        id: 3,
        image: "/images/lookbook/look-3.webp",
        alt: "Jivara celebration wear",
        position: "center 15%",
    },

    {
        id: 4,
        image: "/images/lookbook/look-4.webp",
        alt: "Jivara custom designer look",
        position: "center 20%",
    },

    {
        id: 5,
        image: "/images/lookbook/look-5.webp",
        alt: "Jivara original design worn by a client",
        position: "center 15%",
    },

    {
        id: 6,
        image: "/images/lookbook/look-6.webp",
        alt: "Jivara client wearing an original design",
        position: "center 20%",
    },
        {
        id: 7,
        image: "/images/lookbook/look-7.webp",
        alt: "Jivara original design worn by a client",
        position: "center center",
    },

    {
        id: 8,
        image: "/images/lookbook/look-8.webp",
        alt: "Jivara client wearing an original design",
        position: "center center",
    },
];


function Lookbook() {

    /* =====================================================
       LIGHTBOX STATE
    ===================================================== */

    const [
        selectedIndex,
        setSelectedIndex,
    ] = useState(null);


    const selectedLook =
        selectedIndex !== null
            ? looks[selectedIndex]
            : null;


    /* =====================================================
       OPEN IMAGE
    ===================================================== */

    const openImage = (index) => {

        setSelectedIndex(index);

    };


    /* =====================================================
       CLOSE IMAGE
    ===================================================== */

    const closeImage = () => {

        setSelectedIndex(null);

    };


    /* =====================================================
       PREVIOUS IMAGE
    ===================================================== */

    const showPrevious = () => {

        setSelectedIndex((currentIndex) => {

            if (currentIndex === null) {
                return null;
            }

            return (
                currentIndex - 1 + looks.length
            ) % looks.length;

        });

    };


    /* =====================================================
       NEXT IMAGE
    ===================================================== */

    const showNext = () => {

        setSelectedIndex((currentIndex) => {

            if (currentIndex === null) {
                return null;
            }

            return (
                currentIndex + 1
            ) % looks.length;

        });

    };


    /* =====================================================
       KEYBOARD CONTROLS
    ===================================================== */

    useEffect(() => {

        if (selectedIndex === null) {
            return undefined;
        }


        const handleKeyDown = (event) => {

            if (event.key === "Escape") {

                closeImage();

            }


            if (event.key === "ArrowLeft") {

                setSelectedIndex(
                    (currentIndex) =>
                        (
                            currentIndex -
                            1 +
                            looks.length
                        ) %
                        looks.length
                );

            }


            if (event.key === "ArrowRight") {

                setSelectedIndex(
                    (currentIndex) =>
                        (
                            currentIndex +
                            1
                        ) %
                        looks.length
                );

            }

        };


        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [selectedIndex]);


    /* =====================================================
       PREVENT PAGE SCROLL WHILE VIEWER IS OPEN
    ===================================================== */

    useEffect(() => {

        if (selectedIndex === null) {
            return undefined;
        }


        const previousOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                previousOverflow;

        };

    }, [selectedIndex]);


    return (
        <>
            <Header />


            <main className="lookbook-page">


                {/* =====================================================
                    HERO
                ===================================================== */}

                <section className="lookbook-hero">

                    <div className="lookbook-hero__inner">

                        <p className="lookbook-hero__eyebrow">
                            JIVARA LOOKBOOK
                        </p>


                        <h1>
                            The Jivara Lookbook
                        </h1>


                        <p className="lookbook-hero__description">
                            A collection of Jivara creations brought to life for
                            real celebrations, personalities and moments worth remembering.
                        </p>


                        <div className="lookbook-hero__divider">

                            <span></span>

                            <b>
                                ◇
                            </b>

                            <span></span>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    GALLERY INTRO
                ===================================================== */}

                <section className="lookbook-intro">

                    <div className="lookbook-intro__line"></div>


                    <p>
                        A GLIMPSE INTO OUR CREATIONS
                    </p>


                    <div className="lookbook-intro__line"></div>

                </section>


                {/* =====================================================
                    PHOTO GALLERY
                ===================================================== */}

                <section className="lookbook-gallery">

                    {looks.map(
                        (look, index) => (

                            <article
                                key={look.id}
                                className="lookbook-card"
                            >

                                <button
                                    type="button"
                                    className="lookbook-card__button"
                                    onClick={() =>
                                        openImage(index)
                                    }
                                    aria-label={`View ${look.alt}`}
                                >

                                    <div className="lookbook-card__image">

                                        <img
                                            src={look.image}
                                            alt={look.alt}
                                            loading="lazy"
                                            style={{
                                                objectPosition:
                                                    look.position,
                                            }}
                                        />

                                    </div>

                                </button>

                            </article>

                        )
                    )}

                </section>


                {/* =====================================================
                    COLLECTION CTA
                ===================================================== */}

                <section className="lookbook-cta">

                    <p className="lookbook-cta__eyebrow">
                        FIND YOUR INSPIRATION
                    </p>


                    <h2>
                        Inspired by a Jivara look?
                    </h2>


                    <p>
                        Explore our collections and discover a design
                        that can be made around you.
                    </p>


                    <Link
                        to="/collections"
                        className="lookbook-cta__button"
                    >

                        <span>
                            EXPLORE THE COLLECTIONS
                        </span>


                        <ArrowRight
                            size={17}
                            strokeWidth={1.4}
                        />

                    </Link>

                </section>

            </main>


            <Footer />


            {/* =====================================================
                LIGHTBOX VIEWER
            ===================================================== */}

            {selectedLook && (

                <div
                    className="lookbook-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Jivara Lookbook image viewer"
                    onClick={closeImage}
                >

                    {/* =================================================
                        CLOSE
                    ================================================= */}

                    <button
                        type="button"
                        className="lookbook-lightbox__close"
                        onClick={closeImage}
                        aria-label="Close image viewer"
                    >

                        <X
                            size={26}
                            strokeWidth={1.3}
                        />

                    </button>


                    {/* =================================================
                        PREVIOUS
                    ================================================= */}

                    <button
                        type="button"
                        className="
                            lookbook-lightbox__nav
                            lookbook-lightbox__nav--previous
                        "
                        onClick={(event) => {

                            event.stopPropagation();

                            showPrevious();

                        }}
                        aria-label="Previous image"
                    >

                        <ChevronLeft
                            size={34}
                            strokeWidth={1.2}
                        />

                    </button>


                    {/* =================================================
                        IMAGE + FUTURE DESCRIPTION
                    ================================================= */}

                    <div
                        className="lookbook-lightbox__content"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="lookbook-lightbox__image">

                            <img
                                src={selectedLook.image}
                                alt={selectedLook.alt}
                            />

                        </div>


                        {/* =============================================
                            IMAGE COUNTER
                        ============================================= */}

                        <div className="lookbook-lightbox__counter">

                            {selectedIndex + 1}

                            <span>
                                /
                            </span>

                            {looks.length}

                        </div>


                        {/* =============================================
                            FUTURE DESCRIPTION
                        ============================================= */}

                        {selectedLook.description && (

                            <div className="lookbook-lightbox__description">

                                <p>
                                    {selectedLook.description}
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        NEXT
                    ================================================= */}

                    <button
                        type="button"
                        className="
                            lookbook-lightbox__nav
                            lookbook-lightbox__nav--next
                        "
                        onClick={(event) => {

                            event.stopPropagation();

                            showNext();

                        }}
                        aria-label="Next image"
                    >

                        <ChevronRight
                            size={34}
                            strokeWidth={1.2}
                        />

                    </button>

                </div>

            )}

        </>
    );

}


export default Lookbook;