import {
    Link,
} from "react-router-dom";

import {
    ArrowRight,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import products from "../data/products";

import "./CoupleEdit.css";


function CoupleEdit() {

    /* =====================================================
       COUPLE EDIT PRODUCTS
    ===================================================== */

    const coupleProducts =
        products.filter(
            (product) => {

                if (
                    Array.isArray(
                        product.collectionId
                    )
                ) {

                    return product.collectionId.includes(
                        "couple-edit"
                    );

                }


                return (
                    product.collectionId ===
                    "couple-edit"
                );

            }
        );


    return (
        <>
            <Header />


            <main className="couple-edit-page">


                {/* =================================================
                    HERO
                ================================================= */}

                <section className="couple-edit-hero">

                    <div className="couple-edit-hero__content">

                        <p className="couple-edit-hero__eyebrow">
                            JIVARA COLLECTION
                        </p>


                        <h1>
                            The Couple Edit
                        </h1>


                        <p className="couple-edit-hero__description">

                            Coordinated looks thoughtfully designed
                            for two, with each ensemble created to
                            complement one another.

                        </p>


                        <div className="couple-edit-hero__divider">

                            <span></span>

                            <b>
                                ◇
                            </b>

                            <span></span>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    PRODUCTS
                ================================================= */}

                <section className="couple-edit-products">


                    {coupleProducts.length > 0 ? (

                        <div className="couple-edit-products__grid">

                            {coupleProducts.map(
                                (product) => (

                                    <article
                                        className="couple-edit-card"
                                        key={
                                            product.id
                                        }
                                    >

                                        <Link
                                            to={
                                                `/product/${product.slug}`
                                            }
                                            className="couple-edit-card__image"
                                        >

                                            <img
                                                src={
                                                    product.image
                                                }
                                                alt={
                                                    product.name
                                                }
                                            />


                                            <div className="couple-edit-card__badge">
                                                COUPLES EDIT
                                            </div>

                                        </Link>


                                        <div className="couple-edit-card__content">

                                            <p className="couple-edit-card__eyebrow">
                                                THE COUPLE EDIT
                                            </p>


                                            <Link
                                                to={
                                                    `/product/${product.slug}`
                                                }
                                            >

                                                <h3>
                                                    {product.name}
                                                </h3>

                                            </Link>


                                            <Link
                                                to={
                                                    `/product/${product.slug}`
                                                }
                                                className="couple-edit-card__link"
                                            >

                                                VIEW DESIGN

                                                <ArrowRight
                                                    size={15}
                                                    strokeWidth={1.4}
                                                />

                                            </Link>

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="couple-edit-empty">

                            <span>
                                ◇
                            </span>


                            <h3>
                                The Couple Edit is coming together.
                            </h3>


                            <p>
                                Coordinated Jivara looks for two
                                will appear here.
                            </p>

                        </div>

                    )}

                </section>

            </main>


            <Footer />
        </>
    );

}


export default CoupleEdit;