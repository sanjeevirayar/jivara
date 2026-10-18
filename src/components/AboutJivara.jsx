import { ArrowRight } from "lucide-react";

function AboutJivara() {
  return (
    <section className="about-jivara">

      {/* =====================================================
          LEFT — FOUNDER / BRAND IMAGE
      ===================================================== */}

      <div className="about-jivara__visual">

        <img
          src="/images/about/jivara-story.png"
          alt="The story behind Jivara"
        />

        <div className="about-jivara__overlay"></div>

        <div className="about-jivara__visual-copy">
          <span>JIVARA</span>

          <p>
            Crafted with Love,
            <br />
            Inspired by Devotion.
          </p>
        </div>

      </div>


      {/* =====================================================
          RIGHT — STORY
      ===================================================== */}

      <div className="about-jivara__content">

        <p className="about-jivara__eyebrow">
          OUR STORY
        </p>


        <h2>
          Where Fashion
          <span>Meets the Devotion.</span>
        </h2>


        <p className="about-jivara__lead">
          Every creation has a story. Jivara began with a love for
          fashion, grew through years of craftsmanship, and evolved
          through a deeply personal journey of devotion, transformation
          and the courage to begin again.
        </p>


        <div className="about-jivara__quote">
          <span>“</span>

          <p>
            The designs could burn, but the love that created them could not.
          </p>
        </div>


        {/* =================================================
            JOURNEY
        ================================================= */}

        <div className="about-jivara__journey">

          <div className="about-jivara__chapter">

            <span className="about-jivara__number">
              01
            </span>

            <div>
              <h3>A Dream in Fashion</h3>

              <p>
                After studying Fashion Designing at INIFD, the journey
                began with a small studio and just one worker. Through
                years of creativity and dedication, it grew into a team
                of ten.
              </p>
            </div>

          </div>


          <div className="about-jivara__chapter">

            <span className="about-jivara__number">
              02
            </span>

            <div>
              <h3>Creation Through Devotion</h3>

              <p>
                A spiritual awakening transformed the way fashion was
                understood — not simply as something beautiful to wear,
                but as a way to express emotion, intention, heritage,
                love and devotion.
              </p>
            </div>

          </div>


          <div className="about-jivara__chapter">

            <span className="about-jivara__number">
              03
            </span>

            <div>
              <h3>From Loss to Rebirth</h3>

              <p>
                When the designing studio and precious creations were
                lost in a devastating fire, the physical work disappeared
                — but the inspiration behind it remained. Jivara was born
                again with a deeper purpose.
              </p>
            </div>

          </div>

        </div>


        {/* =================================================
            CLOSING
        ================================================= */}

        <div className="about-jivara__closing">

          <p>
            Today, every Jivara creation carries more than design.
            It carries feeling, meaning and the belief that what is
            created from the soul may change its form, but its essence remains.
          </p>

          <strong>
            From fashion to devotion.
            <br />
            From loss to rebirth.
            <br />
            From a dream to a soul-led purpose.
          </strong>

        </div>


        <a
          href="/our-story"
          className="about-jivara__button"
        >
          <span>READ OUR STORY</span>

          <ArrowRight
            size={16}
            strokeWidth={1.4}
          />
        </a>

      </div>

    </section>
  );
}

export default AboutJivara;