import { ArrowRight } from "lucide-react";

const looks = [
    {
        image: "/images/worn-by-jivara/look-1.png",
        alt: "Jivara custom occasion wear",
        position: "center center",
    },
    {
        image: "/images/worn-by-jivara/look-2.png",
        alt: "Jivara handcrafted outfit",
        position: "center 15%",
    },
    {
        image: "/images/worn-by-jivara/look-3.png",
        alt: "Jivara celebration wear",
        position: "center 15%",
    },
    {
        image: "/images/worn-by-jivara/look-4.png",
        alt: "Jivara custom designer look",
        position: "center 20%",
    },
    {
        image: "/images/worn-by-jivara/look-5.png",
        alt: "Jivara original design worn by client",
        position: "center 15%",
    },
    {
        image: "/images/worn-by-jivara/look-6.png",
        alt: "Jivara client wearing an original design",
        position: "center 20%",
    },
];
function WornByJivara() {
    return (
        <section className="worn-jivara">

            {/* HEADING */}
            <div className="worn-jivara__heading">

                <p className="worn-jivara__eyebrow">
                    REAL PEOPLE. ORIGINAL JIVARA.
                </p>

                <h2>Worn by Jivara</h2>

                <p className="worn-jivara__intro">
                    Designs created for real celebrations, real personalities
                    and moments worth remembering.
                </p>

            </div>


            {/* EDITORIAL GALLERY */}
            <div className="worn-jivara__grid">

                {looks.map((look, index) => (
                    <a
                        href="/collections"
                        className="worn-jivara__item"
                        key={index}
                    >
                        <img
                            src={look.image}
                            alt={look.alt}
                            style={{
                                objectPosition: look.position,
                            }}
                        />
                    </a>
                ))}

            </div>

            {/* CTA */}
            <div className="worn-jivara__footer">

                <a
                    href="/collections"
                    className="worn-jivara__button"
                >
                    <span>DISCOVER MORE JIVARA LOOKS</span>

                    <ArrowRight
                        size={16}
                        strokeWidth={1.4}
                    />
                </a>

            </div>

        </section>
    );
}

export default WornByJivara;