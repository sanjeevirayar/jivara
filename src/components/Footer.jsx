import {
    FaInstagram,
    FaFacebookF,
    FaYoutube,
    FaWhatsapp,
} from "react-icons/fa";

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">

            {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

            <div className="site-footer__main">

                {/* BRAND */}
                <div className="site-footer__brand">

                    <a href="/" className="site-footer__logo">
                        JIVARA
                    </a>

                    <p className="site-footer__tagline">
                        Crafted with Love,
                        <br />
                        Inspired by Devotion.
                    </p>

                    <p className="site-footer__description">
                        Original designs thoughtfully created around you,
                        your story and the moments you choose to celebrate.
                    </p>


                    {/* SOCIAL LINKS */}
                    <div className="site-footer__socials">

                        <a
                            href="#"
                            className="site-footer__social"
                            aria-label="Instagram"
                        >
                            <FaInstagram />
                        </a>

                        <a
                            href="#"
                            className="site-footer__social"
                            aria-label="Facebook"
                        >
                            <FaFacebookF />
                        </a>

                        <a
                            href="#"
                            className="site-footer__social"
                            aria-label="YouTube"
                        >
                            <FaYoutube />
                        </a>

                        <a
                            href="#"
                            className="site-footer__social"
                            aria-label="WhatsApp"
                        >
                            <FaWhatsapp />
                        </a>

                    </div>

                </div>


                {/* =================================================
            COLLECTIONS
        ================================================= */}

                <div className="site-footer__column">

                    <h3>Collections</h3>

                    <nav>

                        <a href="/collections/bride-groom">
                            Bride &amp; Groom
                        </a>

                        <a href="/collections/handworked-blouses">
                            Handworked Blouses
                        </a>

                        <a href="/collections/sarees">
                            Handwork Sarees
                        </a>

                        <a href="/collections/lehengas">
                            Lehengas
                        </a>

                        <a href="/collections/indo-western">
                            Indo-Western
                        </a>

                        <a href="/collections">
                            View All ↗
                        </a>

                    </nav>

                </div>


                {/* =================================================
            JIVARA
        ================================================= */}

                <div className="site-footer__column">

                    <h3>Jivara</h3>

                    <nav>

                        <a href="/our-story">
                            Our Story
                        </a>

                        <a href="/custom-made">
                            Custom Made
                        </a>

                        <a href="/collections/matching-couple">
                            Couple Looks
                        </a>

                        <a href="/collections">
                            Worn by Jivara
                        </a>

                        <a href="/contact">
                            Contact Us
                        </a>

                    </nav>

                </div>


                {/* =================================================
            CUSTOMER CARE
        ================================================= */}

                <div className="site-footer__column">

                    <h3>Customer Care</h3>

                    <nav>

                        <a href="/faq">
                            FAQ
                        </a>

                        <a href="/measurements">
                            Measurement Guide
                        </a>

                        <a href="/shipping">
                            Shipping
                        </a>

                        <a href="/returns">
                            Returns &amp; Alterations
                        </a>

                        <a href="/privacy">
                            Privacy Policy
                        </a>

                        <a href="/terms">
                            Terms &amp; Conditions
                        </a>

                    </nav>

                </div>

            </div>


            {/* =====================================================
          SIGNATURE
      ===================================================== */}

            <div className="site-footer__signature">

                <span></span>

                <p>
                    Fashion • Craft • Devotion
                </p>

                <span></span>

            </div>


            {/* =====================================================
          BOTTOM
      ===================================================== */}

            <div className="site-footer__bottom">

                <p>
                    © {year} Jivara. All rights reserved.
                </p>

                <p className="site-footer__made">
                    Original designs. Individually crafted.
                </p>

            </div>

        </footer>
    );
}

export default Footer;