import "./OurStory.css";

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";


const vows = [
  "No outside food",
  "No social media",
  "No lying",
  "Celibacy",
];


const founderRoles = [
  "Fashion Designer",
  "Jewellery Designer",
  "Isha Meditator",
  "Spiritual Seeker",
  "Life Coach",
  "Counsellor",
  "Spiritual Transformer",
  "Cosmic Healer",
  "Writer",
  "Singer",
  "Traveller",
  "Twin-Flame Guide",
];


function OurStory() {
  return (
    <>
      <Header />

      <main className="our-story-page">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <section className="our-story-hero">

          <div className="our-story-hero__inner">

            <p className="our-story-hero__eyebrow">
              OUR STORY
            </p>

            <h1>
              The Soul of Jivara
            </h1>

            <p className="our-story-hero__tagline">
              Crafted with Love, Inspired by Devotion.
            </p>

            <p className="our-story-hero__intro">
              Every creation has a story. Every stitch carries a soul.
            </p>

            <div className="our-story-hero__divider">
              <span></span>
              <b>◇</b>
              <span></span>
            </div>

          </div>

        </section>


        {/* =====================================================
            THE MEANING OF JIVARA
        ===================================================== */}

        <section className="our-story-section our-story-section--light">

          <div className="our-story-section__inner">

            <div className="our-story-section__meta">
              <span>01</span>
              <p>THE NAME</p>
            </div>


            <div className="our-story-section__content">

              <p className="our-story-section__eyebrow">
                THE MEANING OF JIVARA
              </p>

              <h2>
                A name rooted
                <span>in the soul.</span>
              </h2>


              <div className="our-story-prose">

                <p>
                  At the heart of Jivara lies <em>Jiva</em> —
                  the individual soul.
                </p>

                <p>
                  For founder Jigna Thakkar (Radhey), <em>Ra</em>
                  carries the sacred resonance of Radha and Ram,
                  symbolising divine love, devotion, truth and dharma.
                </p>

                <p>
                  Together, Jivara represents the soul's journey
                  towards love, spiritual awakening and divine
                  consciousness.
                </p>

                <p>
                  Jivara is more than a fashion label. It is the
                  expression of a personal journey through fashion,
                  longing, devotion, transformation, loss and the
                  courage to create again.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
    FOUNDER
===================================================== */}

        <section className="our-story-founder">

          <div className="our-story-founder__inner">

            <div className="our-story-founder__image">

              <img
                src="/images/about/jivara-story.png"
                alt="Jigna Thakkar Radhey, founder of Jivara"
              />

            </div>


            <div className="our-story-founder__content">

              <div className="our-story-founder__heading">

                <p className="our-story-section__eyebrow">
                  THE FOUNDER BEHIND JIVARA
                </p>

                <h2>
                  Jigna Thakkar
                  <span>(Radhey)</span>
                </h2>

              </div>


              <div className="our-story-founder__copy">

                <p>
                  Jigna Thakkar (Radhey) is the founder and creative
                  soul behind Jivara.
                </p>

                <p>
                  Her journey extends far beyond fashion. Alongside
                  her work as a fashion and jewellery designer, she
                  continues to explore spirituality, meditation,
                  healing, self-discovery, creativity and the divine.
                </p>

              </div>


              <div className="our-story-founder__roles">

                {founderRoles.map((role) => (
                  <span key={role}>
                    {role}
                  </span>
                ))}

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            FASHION JOURNEY
        ===================================================== */}

        <section className="our-story-section our-story-section--cream">

          <div className="our-story-section__inner">

            <div className="our-story-section__meta">
              <span>02</span>
              <p>THE BEGINNING</p>
            </div>


            <div className="our-story-section__content">

              <p className="our-story-section__eyebrow">
                MY JOURNEY
              </p>

              <h2>
                From Fashion to
                <span>Spiritual Awakening.</span>
              </h2>


              <div className="our-story-prose">

                <p>
                  My journey began with a deep passion for fashion.
                </p>

                <p>
                  After completing my Diploma in Fashion Designing
                  from INIFD, I began with a small designing studio
                  and just one worker.
                </p>

                <p>
                  Through dedication, creativity and perseverance,
                  that humble beginning gradually grew into a team
                  of ten.
                </p>

                <p>
                  But in 2019, my journey began to move inward.
                </p>

                <p>
                  I experienced an intense spiritual awakening,
                  driven by a deep longing to experience my true
                  self and unite with my Divine Partner.
                </p>

                <p>
                  That inner journey deepened my devotion to
                  Shiv-Shakti and Radha-Krishna, transforming my
                  understanding of love, consciousness and devotion.
                </p>

              </div>


              <blockquote className="our-story-quote">
                Fashion was no longer only a profession.
                It became a language through which I could express
                my spiritual experiences, emotions and the inner
                movements of my soul.
              </blockquote>

            </div>

          </div>

        </section>


        {/* =====================================================
            FOUR VOWS
        ===================================================== */}

        <section className="our-story-vows">

          <div className="our-story-vows__inner">

            <div className="our-story-vows__heading">

              <p className="our-story-section__eyebrow">
                2019 · A JOURNEY INWARD
              </p>

              <h2>
                Four vows.
                <span>One inward intention.</span>
              </h2>

              <p>
                During this period, I embraced four personal
                commitments as part of my spiritual discipline.
              </p>

            </div>


            <div className="our-story-vows__grid">

              {vows.map((vow, index) => (

                <article
                  className="our-story-vow"
                  key={vow}
                >

                  <span>
                    0{index + 1}
                  </span>

                  <h3>
                    {vow}
                  </h3>

                </article>

              ))}

            </div>


            <p className="our-story-vows__closing">
              These commitments helped me turn inward, cultivate
              discipline and consciously direct my energy towards
              spiritual practice and inner transformation.
              What began as a longing for deeper self-discovery
              gradually became part of the inspiration behind
              Jivara and its devotion-centred creations.
            </p>

          </div>

        </section>


        {/* =====================================================
            DEVOTION BECAME CREATION
        ===================================================== */}

        <section className="our-story-devotion">

          <div className="our-story-devotion__inner">

            <div className="our-story-devotion__number">
              03
            </div>


            <div className="our-story-devotion__content">

              <p className="our-story-section__eyebrow">
                WHEN DEVOTION BECAME CREATION
              </p>

              <h2>
                Eternal Love of
                <span>Radha-Krishna.</span>
              </h2>

              <p className="our-story-devotion__lead">
                My spiritual journey eventually found expression
                through design.
              </p>

              <p>
                From my devotion to the timeless love of Radha
                and Krishna emerged the Eternal Love of
                Radha-Krishna Collection.
              </p>

              <p>
                The collection includes bridal and groom wear,
                sarees, lehengas, blouses and potli bags —
                each creation inspired by sacred love, Indian
                tradition and the emotions that connect the
                human heart with the divine.
              </p>

              <p>
                Inspired by the enchanting world of Radha and
                Krishna, these designs bring together intricate
                craftsmanship, meaningful details and stories
                of eternal love.
              </p>


              <blockquote>
                They are not simply garments.
                They are devotion expressed through creation.
              </blockquote>


              <Link
                to="/collections/eternal-love-radha-krishna"
                className="our-story-link"
              >
                <span>
                  EXPLORE ETERNAL LOVE
                </span>

                <ArrowRight
                  size={16}
                  strokeWidth={1.4}
                />
              </Link>

            </div>

          </div>

        </section>


        {/* =====================================================
            LOSS & REBIRTH
        ===================================================== */}

        <section className="our-story-rebirth">

          <div className="our-story-rebirth__inner">

            <p className="our-story-rebirth__year">
              2022
            </p>

            <p className="our-story-rebirth__eyebrow">
              LOSS, FAITH & REBIRTH
            </p>

            <h2>
              Some creations were lost.
              <span>The love behind them remained.</span>
            </h2>


            <div className="our-story-rebirth__copy">

              <p>
                In 2022, after receiving initiation from
                Sadhguruji, I entered one of the most
                challenging periods of my life.
              </p>

              <p>
                A devastating fire destroyed my designing studio,
                and some of my precious Radha-Krishna creations
                were lost in the flames.
              </p>

              <p>
                I watched a part of my dream burn before my eyes.
                Designs created with love, devotion and countless
                hours of dedication were suddenly gone.
              </p>

              <p>
                The fire became a painful chapter in my journey,
                but it could not erase the vision that had given
                birth to Jivara.
              </p>

              <p>
                Through faith, resilience and the courage to begin
                again, I discovered a deeper meaning of creation —
                not only as something made by our hands, but as
                something carried within the soul.
              </p>

            </div>


            <blockquote className="our-story-rebirth__quote">
              The designs could burn, but the love that created
              them could not.
            </blockquote>

          </div>

        </section>


        {/* =====================================================
            SOUL OF JIVARA
        ===================================================== */}

        <section className="our-story-soul">

          <div className="our-story-soul__inner">

            <p className="our-story-section__eyebrow">
              THE SOUL OF JIVARA
            </p>

            <h2>
              Many journeys.
              <span>One soul.</span>
            </h2>


            <div className="our-story-soul__intro">

              <p>
                Jivara brings together the many dimensions of
                my life.
              </p>

            </div>


            <div className="our-story-soul__grid">

              <article>
                <span>01</span>
                <h3>The Designer</h3>
                <p>
                  The fashion designer who loves to create.
                </p>
              </article>


              <article>
                <span>02</span>
                <h3>The Seeker</h3>
                <p>
                  The spiritual seeker who longs to understand.
                </p>
              </article>


              <article>
                <span>03</span>
                <h3>The Meditator</h3>
                <p>
                  The meditator who turns inward.
                </p>
              </article>


              <article>
                <span>04</span>
                <h3>The Listener</h3>
                <p>
                  The counsellor who listens with care.
                </p>
              </article>


              <article>
                <span>05</span>
                <h3>The Guide</h3>
                <p>
                  The life coach and spiritual transformer
                  who supports personal growth.
                </p>
              </article>


              <article>
                <span>06</span>
                <h3>The Writer</h3>
                <p>
                  The writer who expresses through words.
                </p>
              </article>


              <article>
                <span>07</span>
                <h3>The Singer</h3>
                <p>
                  The singer who expresses through music.
                </p>
              </article>


              <article>
                <span>08</span>
                <h3>The Traveller</h3>
                <p>
                  The traveller who finds inspiration in the world.
                </p>
              </article>

            </div>

          </div>

        </section>


        {/* =====================================================
            FOUNDER CLOSING
        ===================================================== */}

        <section className="our-story-signature">

          <div className="our-story-signature__inner">

            <div className="our-story-signature__ornament">
              ◇
            </div>

            <p>
              All of these journeys meet within Jivara.
            </p>

            <h2>
              Jivara is my journey of love,
              <span>expressed through every stitch.</span>
            </h2>

            <div className="our-story-signature__name">
              <strong>
                Jigna Thakkar (Radhey)
              </strong>

              <span>
                FOUNDER · JIVARA
              </span>
            </div>


            <Link
              to="/collections"
              className="our-story-signature__button"
            >
              <span>
                EXPLORE JIVARA
              </span>

              <ArrowRight
                size={16}
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


export default OurStory;