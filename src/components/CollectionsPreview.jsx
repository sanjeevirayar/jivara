const collections = [
    {

        name: "Lehengas",
        image: "/images/collections/lehengas.png",
        link: "/collections/lehengas",
    },
    {
        name: "Handworked Blouses",
        image: "/images/collections/handworked-blouses.png",
        link: "/collections/handworked-blouses",
    },
    {
        name: "Western Gowns",
        image: "/images/collections/western-gowns.png",
        link: "/collections/western-gowns",
    },
    {
        name: "Gharchola Sarees",
        image: "/images/collections/gharchola-sarees.png",
        link: "/collections/gharchola-sarees",
    },
    {
        name: "Indo-Western",
        image: "/images/collections/indo-western.png",
        link: "/collections/indo-western",
    },
    {
        name: "Men's Wear",
        image: "/images/collections/mens-wear.png",
        link: "/collections/mens-wear",
    },
];

function CollectionsPreview() {
    return (
        <section className="collections-preview">

            <div className="collections-preview__heading">

                <p className="collections-preview__eyebrow">
                    THE JIVARA EDIT
                </p>

                <h2>
                    Explore Our Collections
                </h2>

                <p className="collections-preview__intro">
                    Original designs thoughtfully created for celebrations,
                    traditions and moments that are uniquely yours.
                </p>

            </div>


            <div className="collections-preview__grid">

                {collections.map((collection) => (

                    <a
                        href={collection.link}
                        className="collection-card"
                        key={collection.name}
                    >

                        <div className="collection-card__image">

                            <img
                                src={collection.image}
                                alt={collection.name}
                            />

                            <div className="collection-card__overlay"></div>

                        </div>


                        <div className="collection-card__content">

                            <span>
                                {collection.name}
                            </span>

                            <span className="collection-card__arrow">
                                →
                            </span>

                        </div>

                    </a>

                ))}

            </div>


            <div className="collections-preview__footer">

                <a
                    href="/collections"
                    className="collections-preview__button"
                >
                    VIEW ALL COLLECTIONS
                </a>

            </div>

        </section>
    );
}

export default CollectionsPreview;