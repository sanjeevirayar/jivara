import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import collections from "../data/collections";


function Collections() {
  return (
    <>
      <Header />


      <main className="collections-page">

        {/* =====================================================
            COLLECTIONS HERO
        ===================================================== */}

        <section className="collections-hero">

          <p className="collections-hero__eyebrow">
            ORIGINAL BY JIVARA
          </p>


          <h1>
            The Jivara
            <span>Collections.</span>
          </h1>


          <p className="collections-hero__description">
            Original designs created across celebrations,
            traditions and contemporary occasions — each
            thoughtfully crafted and made personal to you.
          </p>


          <div className="collections-hero__ornament">
            <span></span>

            <b>◇</b>

            <span></span>
          </div>

        </section>


        {/* =====================================================
            COLLECTIONS GRID
        ===================================================== */}

        <section className="collections-browser">

          <div className="collections-page-grid">

            {collections.map((collection) => (

              <Link
                to={collection.link}
                className="collections-page-card"
                key={collection.id}
              >

                {/* =============================================
                    IMAGE
                ============================================= */}

                <div className="collections-page-card__image">

                  <img
                    src={collection.image}
                    alt={collection.name}
                  />


                  <div className="collections-page-card__shade"></div>

                </div>


                {/* =============================================
                    CONTENT
                ============================================= */}

                <div className="collections-page-card__content">

                  <p className="collections-page-card__eyebrow">
                    JIVARA COLLECTION
                  </p>


                  <h2 className="collections-page-card__title">
                    {collection.name}
                  </h2>


                  <p className="collections-page-card__description">
                    {collection.description}
                  </p>


                  <div className="collections-page-card__link">

                    <span>
                      EXPLORE COLLECTION
                    </span>


                    <ArrowRight
                      size={17}
                      strokeWidth={1.4}
                    />

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </section>

      </main>


      <Footer />
    </>
  );
}


export default Collections;