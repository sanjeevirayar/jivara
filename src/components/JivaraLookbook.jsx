import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";


const looks = [
  {
    image: "/images/lookbook/look-1.png",
    alt: "Jivara custom occasion wear",
    position: "center center",
  },

  {
    image: "/images/lookbook/look-2.png",
    alt: "Jivara handcrafted outfit",
    position: "center 15%",
  },

  {
    image: "/images/lookbook/look-3.png",
    alt: "Jivara celebration wear",
    position: "center 15%",
  },

  {
    image: "/images/lookbook/look-4.png",
    alt: "Jivara custom designer look",
    position: "center 20%",
  },

  {
    image: "/images/lookbook/look-5.png",
    alt: "Jivara original design worn by client",
    position: "center 15%",
  },

  {
    image: "/images/lookbook/look-6.png",
    alt: "Jivara client wearing an original design",
    position: "center 20%",
  },
];


function JivaraLookbook() {
  return (
    <section className="worn-jivara">

      {/* =====================================================
          HEADING
      ===================================================== */}

      <div className="worn-jivara__heading">

        <p className="worn-jivara__eyebrow">
          MADE BY JIVARA. WORN WITH A STORY.
        </p>

        <h2>
          The Jivara Lookbook
        </h2>

        <p className="worn-jivara__intro">
          A glimpse into Jivara creations brought to life —
          real celebrations and unforgettable moments.
        </p>

      </div>


      {/* =====================================================
          LOOKBOOK PREVIEW
      ===================================================== */}

      <div className="worn-jivara__grid">

        {looks.map((look, index) => (

          <Link
            to="/lookbook"
            className="worn-jivara__item"
            key={index}
            aria-label="Explore the Jivara Lookbook"
          >

            <img
              src={look.image}
              alt={look.alt}
              style={{
                objectPosition: look.position,
              }}
            />

          </Link>

        ))}

      </div>


      {/* =====================================================
          CTA
      ===================================================== */}

      <div className="worn-jivara__footer">

        <Link
          to="/lookbook"
          className="worn-jivara__button"
        >

          <span>
            EXPLORE THE LOOKBOOK
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


export default JivaraLookbook;