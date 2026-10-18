import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function ClosingCTA() {
  return (
    <section className="closing-cta">

      {/* =====================================================
          ORNAMENT
      ===================================================== */}

      <div className="closing-cta__ornament">
        ◇
      </div>


      {/* =====================================================
          EYEBROW
      ===================================================== */}

      <p className="closing-cta__eyebrow">
        CREATED FOR YOUR STORY
      </p>


      {/* =====================================================
          HEADING
      ===================================================== */}

      <h2>
        Begin Your
        <span>
          Jivara Story.
        </span>
      </h2>


      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <p className="closing-cta__text">
        Discover an original Jivara design —
        thoughtfully crafted for celebration,
        expression and moments that become
        part of your story.
      </p>


      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <div className="closing-cta__actions">


        {/* EXPLORE ALL COLLECTIONS */}

        <Link
          to="/collections"
          className="closing-cta__primary"
        >

          <span>
            EXPLORE COLLECTIONS
          </span>


          <ArrowRight
            size={16}
            strokeWidth={1.4}
          />

        </Link>


        {/* SIGNATURE COLLECTION */}

        <Link
          to="/collections/eternal-love-radha-krishna"
          className="closing-cta__secondary"
        >

          <span>
            EXPLORE SIGNATURE COLLECTION
          </span>


          <ArrowRight
            size={16}
            strokeWidth={1.4}
          />

        </Link>

      </div>

    </section>
  );
}

export default ClosingCTA;