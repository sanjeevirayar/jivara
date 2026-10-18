import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import {
  useState,
} from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "./Contact.css";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


const initialForm = {
  name: "",
  email: "",
  phone: "",
  enquiryType: "General Enquiry",
  message: "",
  website: "",
};


function Contact() {

  const [
    form,
    setForm,
  ] = useState(
    initialForm
  );


  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    success,
    setSuccess,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setForm(
        (current) => ({
          ...current,
          [name]: value,
        })
      );


      if (error) {
        setError("");
      }

  };


  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      if (submitting) {
        return;
      }


      setError("");
      setSuccess(false);


      /* =================================================
         BASIC FRONTEND VALIDATION
      ================================================= */

      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.message.trim()
      ) {

        setError(
          "Please complete your name, email and message."
        );

        return;

      }


      try {

        setSubmitting(true);


        const response =
          await fetch(
            `${API_URL}/api/contact`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  form
                ),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "We couldn't send your enquiry."
          );

        }


        setSuccess(true);

        setForm(
          initialForm
        );

      } catch (err) {

        setError(
          err.message ||
          "Something went wrong. Please try again."
        );

      } finally {

        setSubmitting(false);

      }

    };


  return (
    <>
      <Header />


      <main className="contact-page">


        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="contact-hero">

          <p className="contact-eyebrow">
            CONNECT WITH JIVARA
          </p>


          <h1>

            We'd love to
            <span>
              hear from you.
            </span>

          </h1>


          <p className="contact-hero__description">

            Whether you're exploring a Jivara
            design, planning for a celebration
            or simply have a question, we're
            here to help.

          </p>


          <div className="contact-ornament">

            <span></span>

            <b>
              ◇
            </b>

            <span></span>

          </div>

        </section>


        {/* =====================================================
            CONTACT CONTENT
        ===================================================== */}

        <section className="contact-content">


          {/* =================================================
              LEFT — CONTACT DETAILS
          ================================================= */}

          <div className="contact-details">


            <p className="contact-eyebrow">
              SPEAK WITH JIVARA
            </p>


            <h2>

              Start a
              <span>
                conversation.
              </span>

            </h2>


            <p className="contact-details__intro">

              Tell us what you're looking for
              and we'll guide you toward the
              right collection or answer any
              questions about a Jivara design.

            </p>


            {/* ===============================================
                PHONE
            =============================================== */}

            <a
              href="tel:+919137675190"
              className="contact-method"
            >

              <div className="contact-method__icon">

                <Phone
                  size={20}
                  strokeWidth={1.3}
                />

              </div>


              <div>

                <span>
                  CALL US
                </span>


                <strong>
                  +91 91376 75190
                </strong>

              </div>


              <ArrowRight
                size={16}
                strokeWidth={1.3}
              />

            </a>


            {/* ===============================================
                WHATSAPP
            =============================================== */}

            <a
              href="https://wa.me/919137675190"
              target="_blank"
              rel="noreferrer"
              className="contact-method"
            >

              <div className="contact-method__icon">

                <MessageCircle
                  size={20}
                  strokeWidth={1.3}
                />

              </div>


              <div>

                <span>
                  WHATSAPP
                </span>


                <strong>
                  Chat with Jivara
                </strong>

              </div>


              <ArrowRight
                size={16}
                strokeWidth={1.3}
              />

            </a>


            {/* ===============================================
                NOTE
            =============================================== */}

            <div className="contact-details__note">

              <span>
                ◇
              </span>


              <p>
                For enquiries about a specific
                design, mention the design name
                in your message so we can assist
                you more easily.
              </p>

            </div>

          </div>


          {/* =================================================
              RIGHT — FORM
          ================================================= */}

          <div className="contact-form-wrapper">

            <div className="contact-form__heading">

              <Send
                size={18}
                strokeWidth={1.3}
              />


              <div>

                <p>
                  SEND AN ENQUIRY
                </p>


                <h2>
                  Tell us how we
                  can help.
                </h2>

              </div>

            </div>


            {/* ===============================================
                SUCCESS
            =============================================== */}

            {success && (

              <div className="contact-success">

                <CheckCircle2
                  size={24}
                  strokeWidth={1.3}
                />


                <div>

                  <strong>
                    Your enquiry has been sent.
                  </strong>


                  <p>
                    Thank you for reaching out
                    to Jivara. We'll get back to
                    you as soon as possible.
                  </p>

                </div>

              </div>

            )}


            {/* ===============================================
                ERROR
            =============================================== */}

            {error && (

              <div
                className="contact-error"
                role="alert"
              >

                {error}

              </div>

            )}


            <form
              className="contact-form"
              onSubmit={
                handleSubmit
              }
            >


              {/* =============================================
                  HONEYPOT — LEAVE HIDDEN
              ============================================= */}

              <div
                className="contact-form__honeypot"
                aria-hidden="true"
              >

                <label htmlFor="website">
                  Website
                </label>


                <input
                  id="website"
                  name="website"
                  value={
                    form.website
                  }
                  onChange={
                    handleChange
                  }
                  tabIndex="-1"
                  autoComplete="off"
                />

              </div>


              {/* =============================================
                  NAME
              ============================================= */}

              <div className="contact-form__field">

                <label htmlFor="contact-name">
                  YOUR NAME *
                </label>


                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />

              </div>


              {/* =============================================
                  EMAIL + PHONE
              ============================================= */}

              <div className="contact-form__row">

                <div className="contact-form__field">

                  <label htmlFor="contact-email">
                    EMAIL *
                  </label>


                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />

                </div>


                <div className="contact-form__field">

                  <label htmlFor="contact-phone">
                    PHONE
                  </label>


                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="+91"
                    autoComplete="tel"
                  />

                </div>

              </div>


              {/* =============================================
                  ENQUIRY TYPE
              ============================================= */}

              <div className="contact-form__field">

                <label htmlFor="enquiry-type">
                  WHAT CAN WE HELP WITH?
                </label>


                <select
                  id="enquiry-type"
                  name="enquiryType"
                  value={
                    form.enquiryType
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option>
                    General Enquiry
                  </option>

                  <option>
                    Bridal
                  </option>

                  <option>
                    Women's Collection
                  </option>

                  <option>
                    Menswear
                  </option>

                  <option>
                    Kidswear
                  </option>

                  <option>
                    Existing Order
                  </option>

                  <option>
                    Other
                  </option>

                </select>

              </div>


              {/* =============================================
                  MESSAGE
              ============================================= */}

              <div className="contact-form__field">

                <label htmlFor="contact-message">
                  YOUR MESSAGE *
                </label>


                <textarea
                  id="contact-message"
                  name="message"
                  value={
                    form.message
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Tell us what you're looking for..."
                  rows="6"
                  maxLength="3000"
                  required
                />

              </div>


              {/* =============================================
                  SUBMIT
              ============================================= */}

              <button
                type="submit"
                className="contact-form__submit"
                disabled={
                  submitting
                }
              >

                <span>

                  {submitting
                    ? "SENDING..."
                    : "SEND ENQUIRY"}

                </span>


                <ArrowRight
                  size={16}
                  strokeWidth={1.4}
                />

              </button>

            </form>

          </div>

        </section>


        {/* =====================================================
            CLOSING
        ===================================================== */}

        <section className="contact-closing">

          <span>
            ◇
          </span>


          <p>
            CRAFTED WITH LOVE,
            INSPIRED BY DEVOTION
          </p>

        </section>

      </main>


      <Footer />
    </>
  );

}


export default Contact;