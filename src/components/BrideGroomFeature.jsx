import { ArrowRight } from "lucide-react";

function BrideGroomFeature() {
    return (
        <section className="couple-feature">

            {/* HEADING */}
            <div className="couple-feature__heading">

                <h2>
                    MADE FOR TWO
                </h2>

                <p>
                    Two individuals. One celebration. Designed beautifully together.
                </p>

            </div>


            {/* IMAGES */}
            <div className="couple-feature__gallery">

                <a
                    href="/collections/bride-groom"
                    className="couple-feature__image"
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
                </a>


                <a
                    href="/collections/matching-couple"
                    className="couple-feature__image"
                >
                    <img
                        src="/images/bride-groom/bride-groom-2.png"
                        alt=""
                        aria-hidden="true"
                        className="couple-feature__image-bg"
                    />

                    <img
                        src="/images/bride-groom/bride-groom-2.png"
                        alt="Jivara matching couple outfits"
                        className="couple-feature__image-main"
                    />
                </a>

            </div>


            {/* BUTTON */}
            <div className="couple-feature__footer">

                <a
                    href="/collections/bride-groom"
                    className="couple-feature__button"
                >
                    <span>EXPLORE COUPLE LOOKS</span>

                    <ArrowRight
                        size={15}
                        strokeWidth={1.4}
                    />
                </a>

            </div>

        </section>
    );
}

export default BrideGroomFeature;