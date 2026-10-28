import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Palette,
  Heart,
  Sparkles,
  Crown,
  Scissors,
} from "lucide-react";


function Hero() {

  const slides = [

    {
      image:
        "/images/hero/slide-1.png",

      alt:
        "Family wearing coordinated festive outfits by Jivara",

      position:
        "center center",

      eyebrow:
        "CELEBRATION STYLED BEAUTIFULLY",

      line1:
        "DESIGNED FOR",

      line2:
        "THE MOMENT",

      description:
        "Elegant festive looks created for joyful family celebrations and unforgettable occasions.",

      button:
        "SHOP OCCASION WEAR",

      to:
        "/collections",
    },


    {
      image:
        "/images/hero/slide-3.png",

      alt:
        "Women wearing colourful Jivara traditional outfits",

      position:
        "center center",

      eyebrow:
        "WORN BY JIVARA",

      line1:
        "COLOUR, GRACE",

      line2:
        "& TOGETHERNESS",

      description:
        "Original designs that bring beauty, comfort and celebration together in every look.",

      button:
        "EXPLORE STYLES",

      to:
        "/women",
    },


    {
      image:
        "/images/hero/slide-5.png",

      alt:
        "Jivara custom designer wear",

      position:
        "center center",

      eyebrow:
        "CRAFTED FOR YOUR MOMENT",

      line1:
        "MADE AROUND",

      line2:
        "YOU",

      description:
        "Personalised silhouettes, detailing and craftsmanship for every occasion.",

      button:
        "EXPLORE DESIGNS",

      to:
        "/collections",
    },


    {
      image:
        "/images/hero/slide-6.png",

      alt:
        "Jivara original creation",

      position:
        "center center",

      eyebrow:
        "ORIGINAL BY JIVARA",

      line1:
        "DESIGNED TO",

      line2:
        "BE YOURS",

      description:
        "Original creations adapted to your measurements, preferences and story.",

      button:
        "VIEW COLLECTIONS",

      to:
        "/collections",
    },


    {
      image:
        "/images/hero/slide-7.png",

      alt:
        "Jivara mirrorwork lehenga with yellow dupatta",

      position:
        "center center",

      eyebrow:
        "CRAFTED TO STAND APART",

      line1:
        "COLOUR IN",

      line2:
        "MOTION",

      description:
        "A vibrant statement of mirrorwork, colour and flowing silhouette, thoughtfully created with Jivara detail.",

      button:
        "EXPLORE LEHENGAS",

      to:
        "/collections/lehengas",
    },

  ];


  /* =====================================================
     SECOND BENEFITS BAR — AFTER HERO
  ===================================================== */

  const heroBenefits = [

    {
      icon:
        <Palette
          size={24}
          strokeWidth={1.4}
        />,

      text:
        "Personalised Colours & Details",
    },


    {
      icon:
        <Sparkles
          size={24}
          strokeWidth={1.4}
        />,

      text:
        "Occasion-Led Design",
    },


    {
      icon:
        <Heart
          size={24}
          strokeWidth={1.4}
        />,

      text:
        "Bride & Groom Styling",
    },


    {
      icon:
        <Scissors
          size={24}
          strokeWidth={1.4}
        />,

      text:
        "From Sketch to Stitch",
    },


    {
      icon:
        <Crown
          size={24}
          strokeWidth={1.4}
        />,

      text:
        "Heritage Meets Contemporary",
    },

  ];


  const [
    currentSlide,
    setCurrentSlide,
  ] = useState(0);


  /* =====================================================
     AUTO CHANGE EVERY 5 SECONDS
  ===================================================== */

  useEffect(() => {

    const timer =
      setTimeout(
        () => {

          setCurrentSlide(
            (current) =>
              (current + 1) %
              slides.length
          );

        },
        5000
      );


    return () =>
      clearTimeout(timer);

  }, [
    currentSlide,
    slides.length,
  ]);


  /* =====================================================
     MANUAL CONTROLS
  ===================================================== */

  const nextSlide = () => {

    setCurrentSlide(
      (current) =>
        (current + 1) %
        slides.length
    );

  };


  const previousSlide = () => {

    setCurrentSlide(
      (current) =>
        current === 0
          ? slides.length - 1
          : current - 1
    );

  };


  const slide =
    slides[currentSlide];


  return (
    <>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="jv-hero">


        {/* =================================================
            LEFT IMAGE
        ================================================= */}

        <div className="jv-hero__image">


          {/* BLURRED BACKGROUND */}

          <img
            key={`bg-${currentSlide}`}
            src={slide.image}
            alt=""
            aria-hidden="true"
            className="jv-hero__image-bg jv-slide-fade"
            style={{
              objectPosition:
                slide.position,
            }}
          />


          {/* MAIN IMAGE */}

          <img
            key={`main-${currentSlide}`}
            src={slide.image}
            alt={slide.alt}
            className="jv-hero__image-main jv-slide-fade"
            style={{
              objectPosition:
                slide.position,
            }}
          />


          <div className="jv-hero__image-fade"></div>

        </div>


        {/* =================================================
            RIGHT CONTENT
        ================================================= */}

        <div className="jv-hero__content">


          <div className="jv-hero__decor jv-hero__decor--top">
            ✦
          </div>


          <div className="jv-hero__decor jv-hero__decor--bottom">
            ❈
          </div>


          <div
            key={`copy-${currentSlide}`}
            className="jv-hero__copy jv-copy-fade"
          >


            <p className="jv-hero__eyebrow">
              {slide.eyebrow}
            </p>


            <h1 className="jv-hero__title">

              <span>
                {slide.line1}
              </span>

              <span>
                {slide.line2}
              </span>

            </h1>


            <div className="jv-hero__divider">

              <span></span>

              <b>
                ◇
              </b>

              <span></span>

            </div>


            <p className="jv-hero__description">
              {slide.description}
            </p>


            {/* =================================================
                SLIDE CTA
            ================================================= */}

            <Link
              to={slide.to}
              className="jv-hero__button"
            >

              <span>
                {slide.button}
              </span>


              <ArrowRight
                size={19}
                strokeWidth={1.5}
              />

            </Link>


            {/* =================================================
                DOTS
            ================================================= */}

            <div className="jv-hero__dots">

              {slides.map(
                (_, index) => (

                  <button
                    key={index}
                    type="button"
                    aria-label={
                      `Show hero slide ${index + 1}`
                    }
                    className={
                      index ===
                      currentSlide
                        ? "jv-hero__dot jv-hero__dot--active"
                        : "jv-hero__dot"
                    }
                    onClick={() =>
                      setCurrentSlide(
                        index
                      )
                    }
                  />

                )
              )}

            </div>

          </div>

        </div>


        {/* =================================================
            ARROWS
        ================================================= */}

        <button
          type="button"
          className="jv-hero__arrow jv-hero__arrow--left"
          onClick={
            previousSlide
          }
          aria-label="Previous slide"
        >

          <ChevronLeft
            size={24}
            strokeWidth={1.5}
          />

        </button>


        <button
          type="button"
          className="jv-hero__arrow jv-hero__arrow--right"
          onClick={
            nextSlide
          }
          aria-label="Next slide"
        >

          <ChevronRight
            size={24}
            strokeWidth={1.5}
          />

        </button>

      </section>


      {/* =====================================================
          SECOND BENEFITS BAR
          LEFT → RIGHT
      ===================================================== */}

      <section className="hero-benefits">

        <div className="hero-benefits__track">


          {/* FIRST COPY */}

          {heroBenefits.map(
            (benefit, index) => (

              <div
                className="hero-benefits__item"
                key={`hero-benefit-a-${index}`}
              >

                <div className="hero-benefits__icon">
                  {benefit.icon}
                </div>


                <span>
                  {benefit.text}
                </span>


                <span className="hero-benefits__diamond">
                  ✦
                </span>

              </div>

            )
          )}


          {/* DUPLICATE FOR SEAMLESS LOOP */}

          {heroBenefits.map(
            (benefit, index) => (

              <div
                className="hero-benefits__item"
                key={`hero-benefit-b-${index}`}
                aria-hidden="true"
              >

                <div className="hero-benefits__icon">
                  {benefit.icon}
                </div>


                <span>
                  {benefit.text}
                </span>


                <span className="hero-benefits__diamond">
                  ✦
                </span>

              </div>

            )
          )}

        </div>

      </section>

    </>
  );

}


export default Hero;