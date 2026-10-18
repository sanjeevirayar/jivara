import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  ChevronLeft,
  ShoppingBag,
  User,
  MapPin,
  Phone,
  Mail,
  Clock3,
  Check,
  Plus,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "./Checkout.css";


const API_URL =
  "http://localhost:5000";


/* =====================================================
   PRICE FORMATTER
===================================================== */

const formatPrice = (
  price,
  currency = "INR"
) => {

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  ).format(
    Number(price) || 0
  );

};


/* =====================================================
   ITEM SUBTOTAL
===================================================== */

const getItemSubtotal = (
  item
) => {

  if (
    typeof item.subtotal ===
    "number"
  ) {

    return item.subtotal;

  }


  const price =
    Number(item.price) || 0;


  const quantity =
    Number(item.quantity) || 1;


  return price * quantity;

};


/* =====================================================
   CUSTOMER SESSION
===================================================== */

const getLoggedInCustomer =
  () => {

    try {

      const storedCustomer =
        sessionStorage.getItem(
          "jivara-customer"
        );


      if (!storedCustomer) {
        return null;
      }


      return JSON.parse(
        storedCustomer
      );

    } catch {

      return null;

    }

  };


function Checkout() {

  const navigate =
    useNavigate();


  /* =====================================================
     LOGGED-IN CUSTOMER
  ===================================================== */

  const [
    loggedInCustomer,
    setLoggedInCustomer,
  ] = useState(
    () =>
      getLoggedInCustomer()
  );


  /* =====================================================
     SAVED ADDRESSES
  ===================================================== */

  const [
    savedAddresses,
    setSavedAddresses,
  ] = useState([]);


  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState("");


  const [
    addressesLoading,
    setAddressesLoading,
  ] = useState(false);


  const [
    saveAddress,
    setSaveAddress,
  ] = useState(false);


  const [
    addressLabel,
    setAddressLabel,
  ] = useState("Home");


  /* =====================================================
     BAG
  ===================================================== */

  const [
    bag,
    setBag,
  ] = useState([]);


  useEffect(() => {

    try {

      const savedBag =
        JSON.parse(
          localStorage.getItem(
            "jivara-bag"
          )
        ) || [];


      setBag(savedBag);

    } catch {

      setBag([]);

    }

  }, []);


  /* =====================================================
     CUSTOMER DETAILS
  ===================================================== */

  const [
    customer,
    setCustomer,
  ] = useState({

    firstName:
      loggedInCustomer?.firstName ||
      "",

    lastName:
      loggedInCustomer?.lastName ||
      "",

    email:
      loggedInCustomer?.email ||
      "",

    phone:
      loggedInCustomer?.phone ||
      "",

    address: "",

    apartment: "",

    city: "",

    state: "",

    postalCode: "",

    country: "India",

    notes: "",

  });


  /* =====================================================
     APPLY SAVED ADDRESS
  ===================================================== */

  const applySavedAddress =
    (address) => {

      if (!address) {
        return;
      }


      setSelectedAddressId(
        address._id
      );


      setSaveAddress(false);


      setCustomer(
        (current) => ({
          ...current,

          firstName:
            address.firstName ||
            current.firstName,

          lastName:
            address.lastName ||
            current.lastName,

          phone:
            address.phone ||
            current.phone,

          address:
            address.address ||
            "",

          apartment:
            address.apartment ||
            "",

          city:
            address.city ||
            "",

          state:
            address.state ||
            "",

          postalCode:
            address.postalCode ||
            "",

          country:
            address.country ||
            "India",
        })
      );

    };


  /* =====================================================
     LOAD SAVED ADDRESSES
  ===================================================== */

  useEffect(() => {

    const loadSavedAddresses =
      async () => {

        if (!loggedInCustomer) {
          return;
        }


        const token =
          sessionStorage.getItem(
            "jivara-customer-token"
          );


        if (!token) {
          return;
        }


        setAddressesLoading(true);


        try {

          const response =
            await fetch(
              `${API_URL}/api/customer/account/addresses`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          /*
            If the session has expired,
            Checkout simply falls back
            to guest checkout.
          */

          if (
            response.status === 401 ||
            response.status === 403
          ) {

            sessionStorage.removeItem(
              "jivara-customer-token"
            );


            sessionStorage.removeItem(
              "jivara-customer"
            );


            setLoggedInCustomer(
              null
            );


            return;
          }


          const data =
            await response.json();


          if (
            !response.ok ||
            !data.success
          ) {

            throw new Error(
              data.message ||
              "Unable to load saved addresses."
            );

          }


          const addresses =
            data.addresses ||
            [];


          setSavedAddresses(
            addresses
          );


          /*
            Automatically apply the
            customer's default address.
          */

          const defaultAddress =
            addresses.find(
              (address) =>
                address.isDefault
            );


          if (defaultAddress) {

            applySavedAddress(
              defaultAddress
            );

          }

        } catch (error) {

          console.error(
            "Saved addresses error:",
            error
          );

        } finally {

          setAddressesLoading(
            false
          );

        }

      };


    loadSavedAddresses();

  }, [loggedInCustomer]);


  /* =====================================================
     HANDLE FORM CHANGE
  ===================================================== */

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;


      /*
        Keep account email locked
        while logged in.
      */

      if (
        name === "email" &&
        loggedInCustomer
      ) {

        return;

      }


      /*
        If a customer edits any
        address-related information,
        it becomes a custom/new address
        rather than the saved one.
      */

      const addressFields = [
        "firstName",
        "lastName",
        "phone",
        "address",
        "apartment",
        "city",
        "state",
        "postalCode",
        "country",
      ];


      if (
        selectedAddressId &&
        addressFields.includes(
          name
        )
      ) {

        setSelectedAddressId(
          ""
        );

      }


      setCustomer(
        (current) => ({
          ...current,
          [name]:
            value,
        })
      );

    };


  /* =====================================================
     USE NEW ADDRESS
  ===================================================== */

  const useNewAddress =
    () => {

      setSelectedAddressId(
        ""
      );


      setSaveAddress(
        false
      );


      setCustomer(
        (current) => ({
          ...current,

          firstName:
            loggedInCustomer?.firstName ||
            current.firstName,

          lastName:
            loggedInCustomer?.lastName ||
            current.lastName,

          phone:
            loggedInCustomer?.phone ||
            current.phone,

          address: "",

          apartment: "",

          city: "",

          state: "",

          postalCode: "",

          country:
            "India",
        })
      );

    };


  /* =====================================================
     SAVE ADDRESS
  ===================================================== */

  const saveAddressToAccount =
    async () => {

      if (
        !loggedInCustomer ||
        !saveAddress ||
        selectedAddressId
      ) {

        return;

      }


      const token =
        sessionStorage.getItem(
          "jivara-customer-token"
        );


      if (!token) {
        return;
      }


      try {

        const response =
          await fetch(
            `${API_URL}/api/customer/account/addresses`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({

                  label:
                    addressLabel.trim() ||
                    "Home",

                  firstName:
                    customer.firstName,

                  lastName:
                    customer.lastName,

                  phone:
                    customer.phone,

                  address:
                    customer.address,

                  apartment:
                    customer.apartment,

                  city:
                    customer.city,

                  state:
                    customer.state,

                  postalCode:
                    customer.postalCode,

                  country:
                    customer.country,

                  isDefault:
                    savedAddresses.length ===
                    0,

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
            "Unable to save address."
          );

        }


        setSavedAddresses(
          (current) => [
            ...current,
            data.address,
          ]
        );


      } catch (error) {

        /*
          Saving an address is optional.

          A failure here must never
          prevent the customer from
          completing checkout.
        */

        console.error(
          "Save address error:",
          error
        );

      }

    };


  /* =====================================================
     TOTAL PIECES
  ===================================================== */

  const totalPieces =
    bag.reduce(
      (
        total,
        item
      ) =>
        total +
        (
          Number(
            item.quantity
          ) || 1
        ),
      0
    );


  /* =====================================================
     CURRENCY
  ===================================================== */

  const currency =
    bag[0]?.currency ||
    "INR";


  /* =====================================================
     SUBTOTAL
  ===================================================== */

  const subtotal =
    bag.reduce(
      (
        total,
        item
      ) =>
        total +
        getItemSubtotal(
          item
        ),
      0
    );


  /* =====================================================
     SHIPPING
  ===================================================== */

  const shippingAmount =
    null;


  /* =====================================================
     VALIDATION
  ===================================================== */

  const requiredFieldsComplete =

    customer.firstName
      .trim() !== "" &&

    customer.lastName
      .trim() !== "" &&

    customer.email
      .trim() !== "" &&

    customer.phone
      .trim() !== "" &&

    customer.address
      .trim() !== "" &&

    customer.city
      .trim() !== "" &&

    customer.state
      .trim() !== "" &&

    customer.postalCode
      .trim() !== "" &&

    customer.country
      .trim() !== "";


  /* =====================================================
     CONTINUE
  ===================================================== */

  const handleContinue =
    async (e) => {

      e.preventDefault();


      if (
        !requiredFieldsComplete
      ) {

        return;

      }


      /*
        Save optional My Jivara
        address first.
      */

      await saveAddressToAccount();


      const checkoutData = {

        customer,

        bag,

        totalPieces,

        pricing: {

          currency,

          subtotal,

          shippingAmount,

          finalTotal:
            shippingAmount ===
            null
              ? null
              : subtotal +
                shippingAmount,

        },

        createdAt:
          new Date()
            .toISOString(),

      };


      localStorage.setItem(
        "jivara-checkout",
        JSON.stringify(
          checkoutData
        )
      );


      navigate(
        "/order-confirmation"
      );

    };


  /* =====================================================
     EMPTY BAG
  ===================================================== */

  if (
    bag.length === 0
  ) {

    return (
      <>
        <Header />


        <main className="checkout-empty">

          <ShoppingBag
            size={34}
            strokeWidth={1.2}
          />


          <p>
            YOUR BAG IS EMPTY
          </p>


          <h1>

            Nothing to

            <span>
              Checkout.
            </span>

          </h1>


          <Link
            to="/collections"
          >
            EXPLORE COLLECTIONS
          </Link>

        </main>


        <Footer />
      </>
    );

  }


  return (
    <>
      <Header />


      <main className="checkout-page">


        {/* =================================================
            BACK
        ================================================= */}

        <div className="checkout-back">

          <Link to="/bag">

            <ChevronLeft
              size={15}
              strokeWidth={1.5}
            />

            BACK TO BAG

          </Link>

        </div>


        {/* =================================================
            HEADING
        ================================================= */}

        <section className="checkout-heading">

          <p>
            YOUR JIVARA ORDER
          </p>


          <h1>

            Checkout

            <span>
              Details.
            </span>

          </h1>


          <div className="checkout-heading__divider">

            <span></span>

            <b>
              ◇
            </b>

            <span></span>

          </div>

        </section>


        {/* =================================================
            MAIN
        ================================================= */}

        <section className="checkout-layout">


          <form
            className="checkout-form"
            onSubmit={
              handleContinue
            }
          >


            {/* ===============================================
                01 — CUSTOMER
            =============================================== */}

            <section className="checkout-section">

              <div className="checkout-section__number">
                01
              </div>


              <div className="checkout-section__body">


                <div className="checkout-section__title">

                  <User
                    size={18}
                    strokeWidth={1.3}
                  />


                  <div>

                    <p>
                      CUSTOMER DETAILS
                    </p>

                    <h2>
                      Who is this order for?
                    </h2>

                  </div>

                </div>


                {loggedInCustomer && (

                  <div className="checkout-account-note">

                    <div className="checkout-account-note__icon">

                      <Check
                        size={17}
                        strokeWidth={1.4}
                      />

                    </div>


                    <div>

                      <p>
                        SIGNED IN AS
                      </p>

                      <strong>
                        {loggedInCustomer.firstName}{" "}
                        {loggedInCustomer.lastName}
                      </strong>

                      <span>
                        {loggedInCustomer.email}
                      </span>

                    </div>

                  </div>

                )}


                <div className="checkout-fields checkout-fields--two">

                  <div className="checkout-field">

                    <label htmlFor="firstName">
                      FIRST NAME *
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={
                        customer.firstName
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="given-name"
                    />

                  </div>


                  <div className="checkout-field">

                    <label htmlFor="lastName">
                      LAST NAME *
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={
                        customer.lastName
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="family-name"
                    />

                  </div>

                </div>


                <div className="checkout-fields checkout-fields--two">

                  <div className="checkout-field">

                    <label htmlFor="email">
                      EMAIL *
                    </label>


                    <div className="checkout-field__icon">

                      <Mail
                        size={16}
                        strokeWidth={1.3}
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={
                          customer.email
                        }
                        onChange={
                          handleChange
                        }
                        readOnly={
                          Boolean(
                            loggedInCustomer
                          )
                        }
                        className={
                          loggedInCustomer
                            ? "checkout-field__readonly"
                            : ""
                        }
                        autoComplete="email"
                      />

                    </div>


                    {loggedInCustomer && (

                      <p className="checkout-field__hint">
                        This email connects the
                        order to your My Jivara
                        account.
                      </p>

                    )}

                  </div>


                  <div className="checkout-field">

                    <label htmlFor="phone">
                      PHONE / WHATSAPP *
                    </label>


                    <div className="checkout-field__icon">

                      <Phone
                        size={16}
                        strokeWidth={1.3}
                      />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={
                          customer.phone
                        }
                        onChange={
                          handleChange
                        }
                        autoComplete="tel"
                      />

                    </div>

                  </div>

                </div>

              </div>

            </section>


            {/* ===============================================
                02 — SHIPPING
            =============================================== */}

            <section className="checkout-section">

              <div className="checkout-section__number">
                02
              </div>


              <div className="checkout-section__body">


                <div className="checkout-section__title">

                  <MapPin
                    size={18}
                    strokeWidth={1.3}
                  />


                  <div>

                    <p>
                      SHIPPING DETAILS
                    </p>

                    <h2>
                      Where should we send it?
                    </h2>

                  </div>

                </div>


                {/* ===========================================
                    SAVED ADDRESSES
                =========================================== */}

                {loggedInCustomer && (

                  <div className="checkout-saved-addresses">

                    <div className="checkout-saved-addresses__heading">

                      <div>

                        <p>
                          MY JIVARA
                        </p>

                        <h3>
                          Saved Addresses
                        </h3>

                      </div>


                      {savedAddresses.length >
                        0 && (

                        <button
                          type="button"
                          onClick={
                            useNewAddress
                          }
                        >

                          <Plus
                            size={14}
                            strokeWidth={1.4}
                          />

                          USE A DIFFERENT ADDRESS

                        </button>

                      )}

                    </div>


                    {addressesLoading ? (

                      <p className="checkout-address-loading">
                        Loading saved addresses...
                      </p>

                    ) : savedAddresses.length >
                      0 ? (

                      <div className="checkout-address-list">

                        {savedAddresses.map(
                          (address) => {

                            const selected =
                              selectedAddressId ===
                              address._id;


                            return (

                              <button
                                type="button"
                                key={
                                  address._id
                                }
                                className={
                                  selected
                                    ? "checkout-address-card selected"
                                    : "checkout-address-card"
                                }
                                onClick={() =>
                                  applySavedAddress(
                                    address
                                  )
                                }
                              >

                                <div className="checkout-address-card__top">

                                  <strong>
                                    {address.label ||
                                      "Address"}
                                  </strong>


                                  {address.isDefault && (

                                    <span>
                                      DEFAULT
                                    </span>

                                  )}

                                </div>


                                <p>
                                  {address.firstName}{" "}
                                  {address.lastName}
                                </p>


                                <small>

                                  {address.address}

                                  {address.apartment
                                    ? `, ${address.apartment}`
                                    : ""}

                                  <br />

                                  {address.city},{" "}
                                  {address.state}{" "}
                                  {address.postalCode}

                                  <br />

                                  {address.country}

                                </small>


                                <div className="checkout-address-card__select">

                                  <span>

                                    {selected
                                      ? "SELECTED"
                                      : "USE THIS ADDRESS"}

                                  </span>


                                  {selected && (

                                    <Check
                                      size={14}
                                      strokeWidth={1.5}
                                    />

                                  )}

                                </div>

                              </button>

                            );

                          }
                        )}

                      </div>

                    ) : (

                      <div className="checkout-no-address">

                        <MapPin
                          size={18}
                          strokeWidth={1.3}
                        />

                        <p>
                          You don't have a saved
                          address yet. Complete the
                          details below and you can
                          save it to My Jivara.
                        </p>

                      </div>

                    )}

                  </div>

                )}


                {/* ===========================================
                    ADDRESS FORM
                =========================================== */}

                <div className="checkout-field">

                  <label htmlFor="address">
                    ADDRESS *
                  </label>

                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={
                      customer.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Street address"
                    autoComplete="street-address"
                  />

                </div>


                <div className="checkout-field">

                  <label htmlFor="apartment">
                    APARTMENT / LANDMARK
                  </label>

                  <input
                    id="apartment"
                    name="apartment"
                    type="text"
                    value={
                      customer.apartment
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Optional"
                  />

                </div>


                <div className="checkout-fields checkout-fields--two">

                  <div className="checkout-field">

                    <label htmlFor="city">
                      CITY *
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={
                        customer.city
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="address-level2"
                    />

                  </div>


                  <div className="checkout-field">

                    <label htmlFor="state">
                      STATE / REGION *
                    </label>

                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={
                        customer.state
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="address-level1"
                    />

                  </div>

                </div>


                <div className="checkout-fields checkout-fields--two">

                  <div className="checkout-field">

                    <label htmlFor="postalCode">
                      POSTAL CODE *
                    </label>

                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={
                        customer.postalCode
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="postal-code"
                    />

                  </div>


                  <div className="checkout-field">

                    <label htmlFor="country">
                      COUNTRY *
                    </label>

                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={
                        customer.country
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="country-name"
                    />

                  </div>

                </div>


                {/* ===========================================
                    SAVE ADDRESS
                =========================================== */}

                {loggedInCustomer &&
                  !selectedAddressId && (

                  <div className="checkout-save-address">

                    <label className="checkout-save-address__check">

                      <input
                        type="checkbox"
                        checked={
                          saveAddress
                        }
                        onChange={
                          (event) =>
                            setSaveAddress(
                              event.target
                                .checked
                            )
                        }
                      />

                      <span>
                        Save this address to
                        My Jivara
                      </span>

                    </label>


                    {saveAddress && (

                      <div className="checkout-save-address__label">

                        <label htmlFor="addressLabel">
                          ADDRESS LABEL
                        </label>


                        <input
                          id="addressLabel"
                          type="text"
                          value={
                            addressLabel
                          }
                          onChange={
                            (event) =>
                              setAddressLabel(
                                event.target
                                  .value
                              )
                          }
                          placeholder="Home, Work, Parents..."
                          maxLength={40}
                        />

                      </div>

                    )}

                  </div>

                )}

              </div>

            </section>


            {/* ===============================================
                03 — NOTES
            =============================================== */}

            <section className="checkout-section">

              <div className="checkout-section__number">
                03
              </div>


              <div className="checkout-section__body">

                <div className="checkout-section__title">

                  <Clock3
                    size={18}
                    strokeWidth={1.3}
                  />

                  <div>

                    <p>
                      ORDER NOTES
                    </p>

                    <h2>
                      Anything else we should know?
                    </h2>

                  </div>

                </div>


                <div className="checkout-field">

                  <label htmlFor="notes">
                    OPTIONAL NOTE
                  </label>

                  <textarea
                    id="notes"
                    name="notes"
                    rows="5"
                    value={
                      customer.notes
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Occasion details, delivery instructions or anything you would like Jivara to know..."
                  />

                </div>

              </div>

            </section>


            {/* ===============================================
                CONTINUE
            =============================================== */}

            <div className="checkout-submit">

              {!requiredFieldsComplete && (

                <p>
                  Please complete all required
                  customer and shipping details.
                </p>

              )}


              <button
                type="submit"
                disabled={
                  !requiredFieldsComplete
                }
              >

                <span>
                  REVIEW & PAYMENT
                </span>

                <ArrowRight
                  size={18}
                  strokeWidth={1.5}
                />

              </button>

            </div>

          </form>


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="checkout-summary">

            <p className="checkout-summary__eyebrow">
              YOUR ORDER
            </p>


            <h2>
              Order Summary
            </h2>


            <div className="checkout-summary__products">

              {bag.map(
                (item) => {

                  const itemSubtotal =
                    getItemSubtotal(
                      item
                    );


                  return (

                    <div
                      className="checkout-summary__product"
                      key={
                        item.cartItemId
                      }
                    >

                      <div className="checkout-summary__image">

                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                        />

                      </div>


                      <div className="checkout-summary__product-content">

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          Qty:{" "}
                          {item.quantity}
                        </p>

                        <p>
                          {item.color}
                        </p>

                        <strong>

                          {formatPrice(
                            itemSubtotal,
                            item.currency ||
                              currency
                          )}

                        </strong>

                      </div>

                    </div>

                  );

                }
              )}

            </div>


            <div className="checkout-summary__rows">

              <div>

                <span>
                  Designs
                </span>

                <p>
                  {bag.length}
                </p>

              </div>


              <div>

                <span>
                  Total Pieces
                </span>

                <p>
                  {totalPieces}
                </p>

              </div>


              <div>

                <span>
                  Production
                </span>

                <p>
                  Made to Order
                </p>

              </div>

            </div>


            <div className="checkout-price">

              <div className="checkout-price__row">

                <span>
                  SUBTOTAL
                </span>

                <p>

                  {formatPrice(
                    subtotal,
                    currency
                  )}

                </p>

              </div>


              <div className="checkout-price__row">

                <span>
                  SHIPPING
                </span>

                <p className="checkout-price__pending">
                  Calculated before payment
                </p>

              </div>


              <div className="checkout-price__total">

                <div>

                  <span>
                    CURRENT ORDER VALUE
                  </span>

                  <small>
                    Before shipping
                  </small>

                </div>


                <strong>

                  {formatPrice(
                    subtotal,
                    currency
                  )}

                </strong>

              </div>

            </div>


            <div className="checkout-summary__notice">

              <Clock3
                size={18}
                strokeWidth={1.3}
              />

              <p>
                Crafting begins after your
                payment, measurements and
                customisation details are
                confirmed by Jivara.
              </p>

            </div>

          </aside>

        </section>

      </main>


      <Footer />
    </>
  );

}


export default Checkout;