import {
  ArrowRight,
  Heart,
  Sparkles,
  Scissors,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "./OurStory.css";


function OurStory() {

  return (
    <>
      <Header />


      <main className="our-story-page">


        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="our-story-hero">

          <div className="our-story-hero__content">

            <p className="our-story-eyebrow">
              THE STORY OF JIVARA
            </p>


            <h1>
              Created with
              <span>
                heart.
              </span>
            </h1>


            <p className="our-story-hero__description">
              Jivara is a story of creativity,
              devotion and beginning again —
              where every design is shaped with
              intention and made to become part
              of someone else's story.
            </p>


            <div className="our-story-divider">

              <span></span>

              <b>
                ◇
              </b>

              <span></span>

            </div>

          </div>


          <div className="our-story-hero__image">

            <img
              src="/images/collections/eternal-love-radha-krishna.jpg"
              alt="Jivara craftsmanship inspired by Radha and Krishna"
            />

          </div>

        </section>


        {/* =====================================================
            BEGINNING
        ===================================================== */}

        <section className="our-story-beginning">

          <div className="our-story-beginning__number">
            01
          </div>


          <div className="our-story-beginning__content">

            <p className="our-story-eyebrow">
              THE BEGINNING
            </p>


            <h2>
              A love for creating
              <span>
                something personal.
              </span>
            </h2>


            <p>
              Jivara began with a love for
              creating pieces that carried more
              than beauty alone.
            </p>


            <p>
              Every silhouette, detail and
              handcrafted element was imagined
              as something deeply personal —
              created for celebrations,
              relationships and moments worth
              remembering.
            </p>

          </div>

        </section>


        {/* =====================================================
            FIRE / REBIRTH
        ===================================================== */}

        <section className="our-story-rebirth">

          <div className="our-story-rebirth__content">

            <p className="our-story-eyebrow">
              2022 — A TURNING POINT
            </p>


            <h2>
              What was lost
              <span>
                became a beginning.
              </span>
            </h2>


            <p>
              In 2022, a fire destroyed the
              studio and with it, years of
              designs, materials and work.
            </p>


            <p>
              But the heart behind the work
              remained.
            </p>


            <blockquote>
              “The designs could burn,
              but the love that created
              them could not.”
            </blockquote>


            <p>
              Jivara grew again from that
              moment — with a deeper respect
              for craft, resilience and the
              meaning a handmade creation can
              carry.
            </p>

          </div>


          <div className="our-story-rebirth__ornament">

            <span>
              ◇
            </span>

          </div>

        </section>


        {/* =====================================================
            PHILOSOPHY
        ===================================================== */}

        <section className="our-story-philosophy">

          <div className="our-story-section-heading">

            <p className="our-story-eyebrow">
              WHAT JIVARA BELIEVES
            </p>


            <h2>
              Made with meaning.
              <span>
                Worn with feeling.
              </span>
            </h2>

          </div>


          <div className="our-story-values">


            {/* VALUE 1 */}

            <article className="our-story-value">

              <Heart
                size={24}
                strokeWidth={1.2}
              />


              <h3>
                Created with Heart
              </h3>


              <p>
                Each design begins with emotion,
                imagination and a genuine love
                for the craft.
              </p>

            </article>


            {/* VALUE 2 */}

            <article className="our-story-value">

              <Scissors
                size={24}
                strokeWidth={1.2}
              />


              <h3>
                Thoughtfully Crafted
              </h3>


              <p>
                From silhouette to finishing,
                every detail is considered as
                part of the complete design.
              </p>

            </article>


            {/* VALUE 3 */}

            <article className="our-story-value">

              <Sparkles
                size={24}
                strokeWidth={1.2}
              />


              <h3>
                Made to Be Remembered
              </h3>


              <p>
                Jivara creates for moments that
                matter — weddings, celebrations
                and memories carried forward.
              </p>

            </article>

          </div>

        </section>


        {/* =====================================================
            SIGNATURE COLLECTION
        ===================================================== */}

        <section className="our-story-signature">

          <div className="our-story-signature__image">

            <img
              src="/images/eternal-love/eternal-love-lehenga.png"
              alt="Eternal Love of Radha-Krishna by Jivara"
            />

          </div>


          <div className="our-story-signature__content">

            <p className="our-story-eyebrow">
              THE SIGNATURE COLLECTION
            </p>


            <h2>
              Eternal Love of
              <span>
                Radha-Krishna
              </span>
            </h2>


            <p>
              Inspired by devotion, love and
              the sacred union of Radha and
              Krishna, the collection represents
              the emotional heart of Jivara.
            </p>


            <Link
              to="/collections/eternal-love-radha-krishna"
              className="our-story-signature__link"
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


        {/* =====================================================
            CLOSING
        ===================================================== */}

        <section className="our-story-closing">

          <span className="our-story-closing__ornament">
            ◇
          </span>


          <p className="our-story-eyebrow">
            THE STORY CONTINUES
          </p>


          <h2>
            Created by Jivara.
            <span>
              Made part of yours.
            </span>
          </h2>


          <p>
            Discover pieces created with
            thought, craft and a story behind
            every detail.
          </p>


          <Link
            to="/collections"
            className="our-story-closing__button"
          >

            EXPLORE COLLECTIONS


            <ArrowRight
              size={16}
              strokeWidth={1.4}
            />

          </Link>

        </section>

      </main>


      <Footer />
    </>
  );

}


export default OurStory;