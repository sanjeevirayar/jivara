import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  AlertCircle,
} from "lucide-react";

import "./CustomerLogin.css";


const API_URL =
  "http://localhost:5000";


function CustomerLogin() {

  const navigate =
    useNavigate();


  const [
    mode,
    setMode,
  ] = useState("login");


  const [
    form,
    setForm,
  ] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /* =====================================================
     ALREADY LOGGED IN
  ===================================================== */

  useEffect(() => {

    const token =
      sessionStorage.getItem(
        "jivara-customer-token"
      );


    if (token) {

      navigate(
        "/account",
        {
          replace: true,
        }
      );

    }

  }, [navigate]);


  /* =====================================================
     CHANGE MODE
  ===================================================== */

  const changeMode =
    (nextMode) => {

      setMode(nextMode);

      setError("");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

    };


  /* =====================================================
     INPUT
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
          [name]:
            value,
        })
      );

    };


  /* =====================================================
     SAVE CUSTOMER SESSION
  ===================================================== */

  const saveCustomerSession =
    (
      token,
      customer
    ) => {

      sessionStorage.setItem(
        "jivara-customer-token",
        token
      );


      sessionStorage.setItem(
        "jivara-customer",
        JSON.stringify(
          customer
        )
      );

  };


  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin =
    async () => {

      const response =
        await fetch(
          `${API_URL}/api/customer/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email:
                  form.email.trim(),

                password:
                  form.password,
              }),
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Unable to sign in."
        );

      }


      saveCustomerSession(
        data.token,
        data.customer
      );

  };


  /* =====================================================
     REGISTER
  ===================================================== */

  const handleRegister =
    async () => {

      if (
        form.password !==
        form.confirmPassword
      ) {

        throw new Error(
          "Passwords do not match."
        );

      }


      if (
        form.password.length < 8
      ) {

        throw new Error(
          "Password must contain at least 8 characters."
        );

      }


      const response =
        await fetch(
          `${API_URL}/api/customer/auth/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({

                firstName:
                  form.firstName.trim(),

                lastName:
                  form.lastName.trim(),

                email:
                  form.email.trim(),

                phone:
                  form.phone.trim(),

                password:
                  form.password,

              }),
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Unable to create your account."
        );

      }


      saveCustomerSession(
        data.token,
        data.customer
      );

  };


  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      if (loading) {
        return;
      }


      setLoading(true);

      setError("");


      try {

        if (
          mode ===
          "register"
        ) {

          await handleRegister();

        } else {

          await handleLogin();

        }


        navigate(
          "/account",
          {
            replace: true,
          }
        );

      } catch (
        submitError
      ) {

        console.error(
          submitError
        );


        setError(
          submitError.message ||
          "Something went wrong."
        );

      } finally {

        setLoading(false);

      }

    };


  return (
    <main className="customer-auth">

      {/* =================================================
          BRAND SIDE
      ================================================= */}

      <section className="customer-auth__brand">

        <Link
          to="/"
          className="customer-auth__back"
        >

          <ArrowLeft
            size={15}
            strokeWidth={1.4}
          />

          RETURN TO JIVARA

        </Link>


        <div className="customer-auth__logo">

          <img
            src="/images/jivara-logo.png"
            alt="Jivara"
          />

        </div>


        <div className="customer-auth__brand-copy">

          <p>
            CRAFTED WITH LOVE,
            INSPIRED BY DEVOTION
          </p>

          <h1>
            Your Jivara,
            <span>
              Your Story.
            </span>
          </h1>

        </div>

      </section>


      {/* =================================================
          AUTH PANEL
      ================================================= */}

      <section className="customer-auth__panel">

        <div className="customer-auth__content">

          <div className="customer-auth__icon">

            {mode ===
            "login" ? (

              <LockKeyhole
                size={24}
                strokeWidth={1.25}
              />

            ) : (

              <UserRound
                size={24}
                strokeWidth={1.25}
              />

            )}

          </div>


          <p className="customer-auth__eyebrow">

            {mode ===
            "login"
              ? "WELCOME BACK"
              : "JOIN JIVARA"}

          </p>


          <h2>

            {mode ===
            "login"
              ? (
                <>
                  Sign
                  <span>
                    In.
                  </span>
                </>
              )
              : (
                <>
                  Create Your
                  <span>
                    Account.
                  </span>
                </>
              )}

          </h2>


          <p className="customer-auth__intro">

            {mode ===
            "login"
              ? "Access your orders, measurements and made-to-order journey."
              : "Create an account to keep your Jivara orders and tailoring details together."}

          </p>


          {/* =================================================
              MODE SWITCH
          ================================================= */}

          <div className="customer-auth__tabs">

            <button
              type="button"
              className={
                mode ===
                "login"
                  ? "active"
                  : ""
              }
              onClick={() =>
                changeMode(
                  "login"
                )
              }
            >
              SIGN IN
            </button>


            <button
              type="button"
              className={
                mode ===
                "register"
                  ? "active"
                  : ""
              }
              onClick={() =>
                changeMode(
                  "register"
                )
              }
            >
              CREATE ACCOUNT
            </button>

          </div>


          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="customer-auth__form"
            onSubmit={
              handleSubmit
            }
          >

            {mode ===
              "register" && (

              <div className="customer-auth__name-grid">

                <label>

                  <span>
                    FIRST NAME
                  </span>

                  <input
                    type="text"
                    name="firstName"
                    value={
                      form.firstName
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="given-name"
                    required
                  />

                </label>


                <label>

                  <span>
                    LAST NAME
                  </span>

                  <input
                    type="text"
                    name="lastName"
                    value={
                      form.lastName
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="family-name"
                    required
                  />

                </label>

              </div>

            )}


            <label>

              <span>
                EMAIL
              </span>

              <input
                type="email"
                name="email"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
                autoComplete="email"
                required
              />

            </label>


            {mode ===
              "register" && (

              <label>

                <span>
                  PHONE
                </span>

                <input
                  type="tel"
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="tel"
                />

              </label>

            )}


            <label>

              <span>
                PASSWORD
              </span>

              <div className="customer-auth__password">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={
                    form.password
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete={
                    mode ===
                    "register"
                      ? "new-password"
                      : "current-password"
                  }
                  required
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (

                    <EyeOff
                      size={17}
                      strokeWidth={1.4}
                    />

                  ) : (

                    <Eye
                      size={17}
                      strokeWidth={1.4}
                    />

                  )}

                </button>

              </div>

            </label>


            {mode ===
              "register" && (

              <label>

                <span>
                  CONFIRM PASSWORD
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    form.confirmPassword
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="new-password"
                  required
                />

              </label>

            )}


            {error && (

              <div className="customer-auth__error">

                <AlertCircle
                  size={17}
                  strokeWidth={1.4}
                />

                <p>
                  {error}
                </p>

              </div>

            )}


            <button
              type="submit"
              className="customer-auth__submit"
              disabled={
                loading
              }
            >

              <span>

                {loading
                  ? mode ===
                    "login"
                    ? "SIGNING IN..."
                    : "CREATING ACCOUNT..."
                  : mode ===
                    "login"
                    ? "SIGN IN"
                    : "CREATE ACCOUNT"}

              </span>


              {!loading && (

                <ArrowRight
                  size={18}
                  strokeWidth={1.4}
                />

              )}

            </button>

          </form>


          <p className="customer-auth__switch">

            {mode ===
            "login"
              ? "New to Jivara?"
              : "Already have an account?"}


            <button
              type="button"
              onClick={() =>
                changeMode(
                  mode ===
                  "login"
                    ? "register"
                    : "login"
                )
              }
            >

              {mode ===
              "login"
                ? "Create an account"
                : "Sign in"}

            </button>

          </p>

        </div>

      </section>

    </main>
  );

}


export default CustomerLogin;