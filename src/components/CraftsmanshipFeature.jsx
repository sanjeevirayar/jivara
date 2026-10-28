import {
  ArrowRight,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";


function CraftsmanshipFeature() {

  return (

    <section className="craft-feature">


      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="craft-feature__image">

        <img
          src="/images/craftsmanship/handwork-detail.png"
          alt="Detailed Jivara handwork"
        />

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="craft-feature__content">


        <p className="craft-feature__eyebrow">
          IN THE DETAILS
        </p>


        <h2>

          Crafted Slowly.

          <span>
            Remembered Beautifully.
          </span>

        </h2>


        <p className="craft-feature__intro">

          Every Jivara creation begins with an idea and comes alive
          through thoughtful detailing, handwork and careful finishing.

        </p>


        {/* =================================================
            POINTS
        ================================================= */}

        <div className="craft-feature__points">


          <div className="craft-feature__point">

            <span>
              01
            </span>


            <div>

              <h3>
                Original Design
              </h3>


              <p>
                Each look begins as an original Jivara creation.
              </p>

            </div>

          </div>


          <div className="craft-feature__point">

            <span>
              02
            </span>


            <div>

              <h3>
                Intricate Handwork
              </h3>


              <p>
                Details are chosen to complement the fabric,
                silhouette and occasion.
              </p>

            </div>

          </div>


          <div className="craft-feature__point">

            <span>
              03
            </span>


            <div>

              <h3>
                Made Personally
              </h3>


              <p>
                Every piece is adapted to the person who will wear it.
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            OUR STORY CTA
        ================================================= */}

        <Link
          to="/our-story"
          className="craft-feature__button"
        >

          <span>
            OUR APPROACH
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


export default CraftsmanshipFeature;