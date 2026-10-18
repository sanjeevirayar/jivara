import {
  Link,
  Navigate,
} from "react-router-dom";

import {
  ArrowRight,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import collections from "../data/collections";

import "./CategoryCollections.css";


/* =====================================================
   CATEGORY CONFIGURATION
===================================================== */

const categoryData = {

  bridal: {

    eyebrow:
      "JIVARA WEDDINGS",

    title:
      "Bride & Groom",

    accent:
      "Collections.",

    description:
      "Designs created for weddings, rituals and celebrations — thoughtfully crafted for brides, grooms and the moments they share.",

    collectionIds: [
      "eternal-love-radha-krishna",
      "bridal",
      "bride-groom",
    ],

  },


  women: {

    eyebrow:
      "JIVARA FOR WOMEN",

    title:
      "Made for",

    accent:
      "Her.",

    description:
      "From timeless Indian silhouettes to contemporary occasion wear, discover Jivara designs created for celebrations, traditions and personal expression.",

    collectionIds: [
      "bridal",
      "lehengas",
      "handwork-blouses",
      "handworked-sarees",
      "gharchola-sarees",
      "indo-western",
      "western-gowns",
    ],

  },


  men: {

    eyebrow:
      "JIVARA FOR MEN",

    title:
      "Made for",

    accent:
      "Him.",

    description:
      "Refined traditional and contemporary occasion wear designed with thoughtful details, craftsmanship and individuality.",

    collectionIds: [
      "menswear",
    ],

  },


  kids: {

    eyebrow:
      "JIVARA FOR KIDS",

    title:
      "Little Celebrations.",

    accent:
      "Beautifully Made.",

    description:
      "Celebration-ready designs created for children with colour, personality and comfort at the heart of every piece.",

    collectionIds: [
      "kidswear",
    ],

  },

};


function CategoryCollections({
  category,
}) {

  const page =
    categoryData[category];


  /* =====================================================
     INVALID CATEGORY
  ===================================================== */

  if (!page) {

    return (
      <Navigate
        to="/collections"
        replace
      />
    );

  }


  /* =====================================================
     FIND COLLECTIONS
  ===================================================== */

  const categoryCollections =
    page.collectionIds
      .map(
        (id) =>
          collections.find(
            (collection) =>
              collection.id === id
          )
      )
      .filter(Boolean);


  return (
    <>
      <Header />


      <main className="category-collections-page">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="category-collections-hero">

          <p className="category-collections-hero__eyebrow">
            {page.eyebrow}
          </p>


          <h1>

            {page.title}

            <span>
              {page.accent}
            </span>

          </h1>


          <p className="category-collections-hero__description">
            {page.description}
          </p>


          <div className="category-collections-hero__ornament">

            <span></span>

            <b>
              ◇
            </b>

            <span></span>

          </div>

        </section>


        {/* =================================================
            COLLECTIONS
        ================================================= */}

        <section className="category-collections-browser">

          <div className="category-collections-grid">

            {categoryCollections.map(
              (collection) => (

                <Link
                  to={
                    collection.link
                  }
                  className="category-collection-card"
                  key={
                    collection.id
                  }
                >


                  {/* IMAGE */}

                  <div className="category-collection-card__image">

                    <img
                      src={
                        collection.image
                      }
                      alt={
                        collection.name
                      }
                    />


                    <div className="category-collection-card__shade"></div>

                  </div>


                  {/* CONTENT */}

                  <div className="category-collection-card__content">

                    <p className="category-collection-card__eyebrow">
                      JIVARA COLLECTION
                    </p>


                    <h2>
                      {collection.name}
                    </h2>


                    <p className="category-collection-card__description">
                      {collection.description}
                    </p>


                    <div className="category-collection-card__link">

                      <span>
                        EXPLORE COLLECTION
                      </span>


                      <ArrowRight
                        size={16}
                        strokeWidth={1.4}
                      />

                    </div>

                  </div>

                </Link>

              )
            )}

          </div>


          {/* =================================================
              VIEW ALL
          ================================================= */}

          <div className="category-collections-all">

            <Link to="/collections">

              VIEW ALL JIVARA COLLECTIONS

              <ArrowRight
                size={15}
                strokeWidth={1.4}
              />

            </Link>

          </div>

        </section>

      </main>


      <Footer />
    </>
  );

}


export default CategoryCollections;