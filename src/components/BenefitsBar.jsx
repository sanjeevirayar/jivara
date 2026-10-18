import {
  Gem,
  Flower2,
  Ruler,
  Leaf,
  Sparkles,
} from "lucide-react";

function BenefitsBar() {
  const benefits = [
    {
      icon: <Flower2 size={25} strokeWidth={1.4} />,
      text: "Original Jivara Designs",
    },
    {
      icon: <Gem size={25} strokeWidth={1.4} />,
      text: "Uncompromising Quality",
    },
    {
      icon: <Sparkles size={25} strokeWidth={1.4} />,
      text: "Exclusive & Unique Designs",
    },
    {
      icon: <Ruler size={25} strokeWidth={1.4} />,
      text: "Made To Your Measurements",
    },
    {
      icon: <Leaf size={25} strokeWidth={1.4} />,
      text: "Thoughtful Craftsmanship",
    },
  ];

  return (
    <section className="jv-benefits">

      <div className="jv-benefits__track">

        {benefits.map((benefit, index) => (
          <div
            className="jv-benefits__item"
            key={`benefit-a-${index}`}
          >
            <div className="jv-benefits__icon">
              {benefit.icon}
            </div>

            <span>{benefit.text}</span>

            <span className="jv-benefits__diamond">
              ✦
            </span>
          </div>
        ))}


        {/* Duplicate set for seamless scrolling */}

        {benefits.map((benefit, index) => (
          <div
            className="jv-benefits__item"
            key={`benefit-b-${index}`}
            aria-hidden="true"
          >
            <div className="jv-benefits__icon">
              {benefit.icon}
            </div>

            <span>{benefit.text}</span>

            <span className="jv-benefits__diamond">
              ✦
            </span>
          </div>
        ))}

      </div>

    </section>
  );
}

export default BenefitsBar;