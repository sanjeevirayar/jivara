import {
  Link,
} from "react-router-dom";


const collections = [

  {
    name: "Lehengas",
    image: "/images/collections/lehengas.png?v=3",
    link: "/collections/lehengas",
  },

  {
    name: "Handworked Blouses",
    image: "/images/collections/handworked-blouses.png?v=3",
    link: "/collections/handwork-blouses",
  },

  {
    name: "Western Gowns",
    image: "/images/collections/western-gowns.png",
    link: "/collections/western-gowns",
  },

  {
    name: "Gharchola Sarees",
    image: "/images/collections/gharchola-sarees.png?v=3",
    link: "/collections/gharchola-sarees",
  },

  {
    name: "Indo-Western",
    image: "/images/collections/indo-western.png?v=3",
    link: "/collections/indo-western",
  },

  {
    name: "Men's Wear",
    image: "/images/collections/mens-wear.png",
    link: "/collections/menswear",
  },

];


function CollectionsPreview() {

  return (

    <section className="collections-preview">


      {/* =====================================================
          HEADING
      ===================================================== */}

      <div className="collections-preview__heading">

        <p className="collections-preview__eyebrow">
          THE JIVARA EDIT
        </p>


        <h2>
          Explore Our Collections
        </h2>


        <p className="collections-preview__intro">

          Original designs thoughtfully created for celebrations,
          traditions and moments that are uniquely yours.

        </p>

      </div>


      {/* =====================================================
          COLLECTION GRID
      ===================================================== */}

      <div className="collections-preview__grid">

        {collections.map(
          (collection) => (

            <Link
              to={collection.link}
              className="collection-card"
              key={collection.name}
            >

              <div className="collection-card__image">

                <img
                  src={collection.image}
                  alt={collection.name}
                />


                <div className="collection-card__overlay"></div>

              </div>


              <div className="collection-card__content">

                <span>
                  {collection.name}
                </span>


                <span className="collection-card__arrow">
                  →
                </span>

              </div>

            </Link>

          )
        )}

      </div>


      {/* =====================================================
          VIEW ALL COLLECTIONS
      ===================================================== */}

      <div className="collections-preview__footer">

        <Link
          to="/collections"
          className="collections-preview__button"
        >
          VIEW ALL COLLECTIONS
        </Link>

      </div>

    </section>

  );

}


export default CollectionsPreview;