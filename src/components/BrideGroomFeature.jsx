import {
  ArrowRight,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";


function BrideGroomFeature() {

  return (

    <section className="couple-feature">


      {/* =====================================================
          HEADING
      ===================================================== */}

      <div className="couple-feature__heading">

        <h2>
          MADE FOR TWO
        </h2>


        <p>
          Two individuals. One celebration. Designed beautifully together.
        </p>

      </div>


      {/* =====================================================
          IMAGES
      ===================================================== */}

      <div className="couple-feature__gallery">


        {/* =================================================
            FIRST LOOK — BRIDE & GROOM
        ================================================= */}

        <Link
          to="/collections/bride-groom"
          className="couple-feature__image"
          aria-label="Explore Bride and Groom Collection"
        >

          <img
            src="/images/bride-groom/bride-groom-1.png"
            alt=""
            aria-hidden="true"
            className="couple-feature__image-bg"
          />


          <img
            src="/images/bride-groom/bride-groom-1.png"
            alt="Jivara bride and groom collection"
            className="couple-feature__image-main"
          />

        </Link>


        {/* =================================================
            SECOND LOOK — THE COUPLE EDIT
        ================================================= */}

        <Link
          to="/couple-edit"
          className="couple-feature__image"
          aria-label="Explore The Couple Edit"
        >

          <img
            src="/images/bride-groom/bride-groom-2.png"
            alt=""
            aria-hidden="true"
            className="couple-feature__image-bg"
          />


          <img
            src="/images/bride-groom/bride-groom-2.png"
            alt="Jivara The Couple Edit coordinated outfits"
            className="couple-feature__image-main"
          />

        </Link>

      </div>


      {/* =====================================================
          BUTTON
      ===================================================== */}

      <div className="couple-feature__footer">

        <Link
          to="/collections/bride-groom"
          className="couple-feature__button"
        >

          <span>
            EXPLORE COUPLE LOOKS
          </span>


          <ArrowRight
            size={15}
            strokeWidth={1.4}
          />

        </Link>

      </div>

    </section>

  );

}


export default BrideGroomFeature;