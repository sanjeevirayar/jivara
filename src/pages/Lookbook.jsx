import "./Lookbook.css";

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";


const looks = [
    {
        id: 1,
        image: "/images/lookbook/look-1.png",
        title: "A Jivara Celebration",
        category: "Occasion Wear",
        alt: "Jivara custom occasion wear",
        position: "center center",
    },

    {
        id: 2,
        image: "/images/lookbook/look-2.png",
        title: "Crafted in Colour",
        category: "Jivara Original",
        alt: "Jivara handcrafted outfit",
        position: "center 15%",
    },

    {
        id: 3,
        image: "/images/lookbook/look-3.png",
        title: "Made for the Moment",
        category: "Celebration Wear",
        alt: "Jivara celebration wear",
        position: "center 15%",
    },

    {
        id: 4,
        image: "/images/lookbook/look-4.png",
        title: "A Personal Creation",
        category: "Custom Creation",
        alt: "Jivara custom designer look",
        position: "center 20%",
    },

    {
        id: 5,
        image: "/images/lookbook/look-5.png",
        title: "Designed to Be Yours",
        category: "Jivara Original",
        alt: "Jivara original design worn by a client",
        position: "center 15%",
    },

    {
        id: 6,
        image: "/images/lookbook/look-6.png",
        title: "Made with a Story",
        category: "Custom Creation",
        alt: "Jivara client wearing an original design",
        position: "center 20%",
    },
];


function Lookbook() {
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
                            <b>◇</b>
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
            LOOKBOOK GALLERY
        ===================================================== */}

                <section className="lookbook-gallery">

                    {looks.map((look, index) => (

                        <article
                            key={look.id}
                            className={
                                index % 5 === 0
                                    ? "lookbook-card lookbook-card--large"
                                    : "lookbook-card"
                            }
                        >

                            <div className="lookbook-card__image">

                                <img
                                    src={look.image}
                                    alt={look.alt}
                                    loading="lazy"
                                    style={{
                                        objectPosition: look.position,
                                    }}
                                />

                                <div className="lookbook-card__overlay"></div>

                            </div>


                            <div className="lookbook-card__copy">

                                <span>
                                    {look.category}
                                </span>

                                <h2>
                                    {look.title}
                                </h2>

                            </div>

                        </article>

                    ))}

                </section>


                {/* =====================================================
            STORY
        ===================================================== */}

                <section className="lookbook-story">

                    <div className="lookbook-story__inner">

                        <p className="lookbook-story__eyebrow">
                            BEYOND THE FINISHED PIECE
                        </p>

                        <h2>
                            Created for People,
                            <span>Not Just Occasions.</span>
                        </h2>

                        <p>
                            No two Jivara stories are exactly alike.
                            Colours, silhouettes, detailing and finishing
                            are thoughtfully adapted around the person,
                            the celebration and the feeling they want
                            to carry with them.
                        </p>

                    </div>

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
        </>
    );
}


export default Lookbook;