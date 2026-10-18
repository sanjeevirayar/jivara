import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";


function EternalLoveFeature() {

  const videoRef =
    useRef(null);

  const timerRef =
    useRef(null);


  const [
    showIntroImage,
    setShowIntroImage,
  ] = useState(true);


  /* =====================================================
     PLAY VIDEO + HIDE IMAGE
  ===================================================== */

  const playVideo = () => {

    if (
      videoRef.current
    ) {

      videoRef.current
        .play()
        .catch(() => {
          // Browser may block autoplay in some situations.
        });

    }


    setShowIntroImage(false);

  };


  /* =====================================================
     START / RESTART IMAGE TIMER
  ===================================================== */

  const startImageTimer = () => {

    /* Cancel any existing timer */

    if (
      timerRef.current
    ) {

      clearTimeout(
        timerRef.current
      );

    }


    /* After 2 seconds, return to video */

    timerRef.current =
      setTimeout(
        () => {

          playVideo();

        },
        2000
      );

  };


  /* =====================================================
     INITIAL PAGE LOAD
     SHOW IMAGE FOR 2 SECONDS
  ===================================================== */

  useEffect(() => {

    startImageTimer();


    return () => {

      if (
        timerRef.current
      ) {

        clearTimeout(
          timerRef.current
        );

      }

    };

  }, []);


  /* =====================================================
     CLICK IMAGE / VIDEO
  ===================================================== */

  const toggleMedia = () => {

    /* Cancel current timer */

    if (
      timerRef.current
    ) {

      clearTimeout(
        timerRef.current
      );

    }


    /* =================================================
       IMAGE IS SHOWING
       → PLAY VIDEO
    ================================================= */

    if (
      showIntroImage
    ) {

      playVideo();

    }


    /* =================================================
       VIDEO IS SHOWING
       → PAUSE
       → SHOW IMAGE
       → WAIT
       → VIDEO AUTOMATICALLY RESUMES
    ================================================= */

    else {

      if (
        videoRef.current
      ) {

        videoRef.current.pause();

      }


      setShowIntroImage(true);

      startImageTimer();

    }

  };


  return (

    <section className="eternal-love">


      {/* =====================================================
          LEFT — IMAGE / VIDEO
      ===================================================== */}

      <div className="eternal-love__visual">


        {/* MAKING VIDEO */}

        <video
          ref={videoRef}
          className="eternal-love__video"
          muted
          loop
          playsInline
          preload="metadata"
          onClick={toggleMedia}
        >

          <source
            src="/videos/eternal-love-radha-krishna.mp4"
            type="video/mp4"
          />


          Your browser does not support video playback.

        </video>


        {/* =================================================
            FINISHED LEHENGA IMAGE
        ================================================= */}

        <img
          src="/images/eternal-love/eternal-love-lehenga.png"
          alt="Jivara Eternal Love of Radha-Krishna lehenga"
          onClick={toggleMedia}
          className={
            showIntroImage
              ? "eternal-love__intro-image"
              : "eternal-love__intro-image eternal-love__intro-image--hidden"
          }
        />


        {/* =================================================
            MEDIA LABEL
        ================================================= */}

        <div className="eternal-love__video-label">

          {showIntroImage
            ? "ETERNAL LOVE OF RADHA-KRISHNA COLLECTION"
            : "THE MAKING OF TEAL EMERALD BRIDAL LEHENGA SET"}

        </div>

      </div>


      {/* =====================================================
          RIGHT — CONTENT
      ===================================================== */}

      <div className="eternal-love__content">


        {/* EYEBROW */}

        <p className="eternal-love__eyebrow">
          THE SIGNATURE COLLECTION
        </p>


        {/* HEADING */}

        <h2>

          Eternal Love of

          <span>
            Radha-Krishna
          </span>

        </h2>


        {/* DIVIDER */}

        <div className="eternal-love__divider">

          <span></span>

          <b>
            ◇
          </b>

          <span></span>

        </div>


        {/* DESCRIPTION */}

        <p className="eternal-love__description">

          Inspired by the eternal love,
          devotion and union of Radha and
          Krishna, this collection was
          envisioned for brides and grooms.

        </p>


        <p className="eternal-love__description eternal-love__description--secondary">

          Through sarees, blouses, lehengas
          and potli bags, each creation
          carries an expression of love,
          devotion and the sacred beginning
          of two souls coming together.

        </p>


        {/* QUOTE */}

        <blockquote className="eternal-love__quote">

          “These were not simply designs.
          They were pieces of my heart.”

        </blockquote>


        {/* =================================================
            DISCOVER COLLECTION BUTTON
        ================================================= */}

        <Link
          to="/collections/eternal-love-radha-krishna"
          className="eternal-love__button"
        >

          <span>
            DISCOVER THE COLLECTION
          </span>


          <ArrowRight
            size={17}
            strokeWidth={1.4}
          />

        </Link>

      </div>

    </section>

  );

}


export default EternalLoveFeature;