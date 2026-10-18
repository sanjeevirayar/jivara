import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Check,
  LogOut,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Scissors,
  ShoppingBag,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "./CustomerAccount.css";


const API_URL =
  "http://localhost:5000";


/* =====================================================
   HELPERS
===================================================== */

const formatPrice = (
  price,
  currency = "INR"
) =>
  new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  ).format(
    Number(price) || 0
  );


const formatDate = (
  value
) => {

  if (!value) {
    return "—";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);

};


const createEmptyAddress =
  (customer = null) => ({
    label: "Home",

    firstName:
      customer?.firstName ||
      "",

    lastName:
      customer?.lastName ||
      "",

    phone:
      customer?.phone ||
      "",

    address: "",

    apartment: "",

    city: "",

    state: "",

    postalCode: "",

    country: "India",

    isDefault: false,
  });


function CustomerAccount() {

  const navigate =
    useNavigate();


  /* =====================================================
     STATE
  ===================================================== */

  const [
    customer,
    setCustomer,
  ] = useState(null);


  const [
    orders,
    setOrders,
  ] = useState([]);


  const [
    addresses,
    setAddresses,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    showAddressForm,
    setShowAddressForm,
  ] = useState(false);


  const [
    addressForm,
    setAddressForm,
  ] = useState(
    createEmptyAddress()
  );


  const [
    addressSaving,
    setAddressSaving,
  ] = useState(false);


  const [
    addressBusyId,
    setAddressBusyId,
  ] = useState("");


  const [
    addressError,
    setAddressError,
  ] = useState("");


  const [
    addressMessage,
    setAddressMessage,
  ] = useState("");


  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {

    sessionStorage.removeItem(
      "jivara-customer-token"
    );


    sessionStorage.removeItem(
      "jivara-customer"
    );


    navigate(
      "/account/login",
      {
        replace: true,
      }
    );

  };


  /* =====================================================
     TOKEN
  ===================================================== */

  const getToken = () =>
    sessionStorage.getItem(
      "jivara-customer-token"
    );


  /* =====================================================
     LOAD ACCOUNT
  ===================================================== */

  const loadAccount =
    async () => {

      const token =
        getToken();


      if (!token) {

        navigate(
          "/account/login",
          {
            replace: true,
          }
        );

        return;
      }


      setLoading(true);
      setError("");


      try {

        const headers = {
          Authorization:
            `Bearer ${token}`,
        };


        const [
          profileResponse,
          ordersResponse,
          addressesResponse,
        ] =
          await Promise.all([

            fetch(
              `${API_URL}/api/customer/account/profile`,
              {
                headers,
              }
            ),

            fetch(
              `${API_URL}/api/customer/account/orders`,
              {
                headers,
              }
            ),

            fetch(
              `${API_URL}/api/customer/account/addresses`,
              {
                headers,
              }
            ),

          ]);


        if (
          [
            profileResponse.status,
            ordersResponse.status,
            addressesResponse.status,
          ].some(
            (status) =>
              status === 401 ||
              status === 403
          )
        ) {

          logout();

          return;
        }


        const [
          profileData,
          ordersData,
          addressesData,
        ] =
          await Promise.all([

            profileResponse.json(),

            ordersResponse.json(),

            addressesResponse.json(),

          ]);


        if (
          !profileResponse.ok ||
          !profileData.success
        ) {

          throw new Error(
            profileData.message ||
            "Unable to load account."
          );

        }


        if (
          !ordersResponse.ok ||
          !ordersData.success
        ) {

          throw new Error(
            ordersData.message ||
            "Unable to load orders."
          );

        }


        if (
          !addressesResponse.ok ||
          !addressesData.success
        ) {

          throw new Error(
            addressesData.message ||
            "Unable to load saved addresses."
          );

        }


        setCustomer(
          profileData.customer
        );


        setOrders(
          ordersData.orders ||
          []
        );


        setAddresses(
          addressesData.addresses ||
          []
        );

      } catch (
        loadError
      ) {

        console.error(
          loadError
        );


        setError(
          loadError.message ||
          "Unable to load your Jivara account."
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadAccount();

  }, []);


  /* =====================================================
     OPEN ADDRESS FORM
  ===================================================== */

  const openAddressForm = () => {

    setAddressForm(
      createEmptyAddress(
        customer
      )
    );


    setAddressError("");
    setAddressMessage("");

    setShowAddressForm(
      true
    );

  };


  const closeAddressForm = () => {

    setShowAddressForm(
      false
    );

    setAddressError("");

  };


  /* =====================================================
     ADDRESS INPUT
  ===================================================== */

  const handleAddressChange =
    (event) => {

      const {
        name,
        value,
        type,
        checked,
      } = event.target;


      setAddressForm(
        (current) => ({
          ...current,

          [name]:
            type === "checkbox"
              ? checked
              : value,
        })
      );

    };


  /* =====================================================
     SAVE ADDRESS
  ===================================================== */

  const handleSaveAddress =
    async (event) => {

      event.preventDefault();


      const token =
        getToken();


      if (!token) {

        logout();

        return;
      }


      setAddressSaving(true);

      setAddressError("");
      setAddressMessage("");


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
                JSON.stringify(
                  addressForm
                ),
            }
          );


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          logout();

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
            "Unable to save address."
          );

        }


        setAddressMessage(
          "Address saved successfully."
        );


        setShowAddressForm(
          false
        );


        await loadAddressesOnly();

      } catch (
        saveError
      ) {

        console.error(
          saveError
        );


        setAddressError(
          saveError.message ||
          "Unable to save this address."
        );

      } finally {

        setAddressSaving(false);

      }

    };


  /* =====================================================
     LOAD ADDRESSES ONLY
  ===================================================== */

  const loadAddressesOnly =
    async () => {

      const token =
        getToken();


      if (!token) {
        return;
      }


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


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          logout();

          return;
        }


        const data =
          await response.json();


        if (
          response.ok &&
          data.success
        ) {

          setAddresses(
            data.addresses ||
            []
          );

        }

      } catch (loadError) {

        console.error(
          "Reload addresses error:",
          loadError
        );

      }

    };


  /* =====================================================
     SET DEFAULT
  ===================================================== */

  const setDefaultAddress =
    async (
      addressId
    ) => {

      const token =
        getToken();


      if (!token) {

        logout();

        return;
      }


      setAddressBusyId(
        addressId
      );

      setAddressError("");
      setAddressMessage("");


      try {

        const response =
          await fetch(
            `${API_URL}/api/customer/account/addresses/${addressId}/default`,
            {
              method: "PATCH",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          logout();

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
            "Unable to update default address."
          );

        }


        setAddressMessage(
          "Default address updated."
        );


        await loadAddressesOnly();

      } catch (
        updateError
      ) {

        console.error(
          updateError
        );


        setAddressError(
          updateError.message ||
          "Unable to update the default address."
        );

      } finally {

        setAddressBusyId("");

      }

    };


  /* =====================================================
     DELETE ADDRESS
  ===================================================== */

  const deleteAddress =
    async (
      addressId
    ) => {

      const confirmed =
        window.confirm(
          "Remove this saved address from My Jivara?"
        );


      if (!confirmed) {
        return;
      }


      const token =
        getToken();


      if (!token) {

        logout();

        return;
      }


      setAddressBusyId(
        addressId
      );

      setAddressError("");
      setAddressMessage("");


      try {

        const response =
          await fetch(
            `${API_URL}/api/customer/account/addresses/${addressId}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          logout();

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
            "Unable to remove address."
          );

        }


        setAddressMessage(
          "Address removed."
        );


        await loadAddressesOnly();

      } catch (
        deleteError
      ) {

        console.error(
          deleteError
        );


        setAddressError(
          deleteError.message ||
          "Unable to remove this address."
        );

      } finally {

        setAddressBusyId("");

      }

    };


  /* =====================================================
     SUMMARY
  ===================================================== */

  const summary =
    useMemo(() => {

      return {

        total:
          orders.length,

        active:
          orders.filter(
            (order) =>
              ![
                "Delivered",
                "Cancelled",
              ].includes(
                order.orderStatus
              )
          ).length,

        delivered:
          orders.filter(
            (order) =>
              order.orderStatus ===
              "Delivered"
          ).length,

      };

    }, [orders]);


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <>
        <Header />

        <main className="customer-account-state">

          <RefreshCw
            size={23}
            strokeWidth={1.2}
          />

          <p>
            Loading your Jivara account...
          </p>

        </main>

        <Footer />
      </>
    );

  }


  return (
    <>
      <Header />


      <main className="customer-account">

        <div className="customer-account__container">


          {/* =================================================
              INTRO
          ================================================= */}

          <section className="customer-account__intro">

            <div>

              <p className="customer-account__eyebrow">
                MY JIVARA
              </p>


              <h1>
                Welcome,
                <span>
                  {customer?.firstName}.
                </span>
              </h1>


              <p className="customer-account__intro-copy">
                Your orders, measurements,
                saved addresses and made-to-order
                journey in one place.
              </p>

            </div>


            <button
              type="button"
              className="customer-account__logout"
              onClick={logout}
            >

              <LogOut
                size={16}
                strokeWidth={1.4}
              />

              LOG OUT

            </button>

          </section>


          {error && (

            <div className="customer-account__error">

              <AlertCircle
                size={18}
                strokeWidth={1.4}
              />

              <p>
                {error}
              </p>

            </div>

          )}


          {/* =================================================
              PROFILE + SUMMARY
          ================================================= */}

          <section className="customer-account__top">

            <article className="customer-profile-card">

              <div className="customer-card-heading">

                <UserRound
                  size={19}
                  strokeWidth={1.3}
                />

                <div>

                  <p>
                    PROFILE
                  </p>

                  <h2>
                    Your Details
                  </h2>

                </div>

              </div>


              <div className="customer-profile-card__details">

                <div>

                  <span>
                    NAME
                  </span>

                  <strong>
                    {customer?.firstName}{" "}
                    {customer?.lastName}
                  </strong>

                </div>


                <div>

                  <span>
                    EMAIL
                  </span>

                  <strong>
                    {customer?.email}
                  </strong>

                </div>


                <div>

                  <span>
                    PHONE
                  </span>

                  <strong>
                    {customer?.phone ||
                      "Not added"}
                  </strong>

                </div>

              </div>

            </article>


            <div className="customer-account__stats">

              <article>

                <ShoppingBag
                  size={19}
                  strokeWidth={1.25}
                />

                <div>

                  <span>
                    TOTAL ORDERS
                  </span>

                  <strong>
                    {summary.total}
                  </strong>

                </div>

              </article>


              <article>

                <Scissors
                  size={19}
                  strokeWidth={1.25}
                />

                <div>

                  <span>
                    ACTIVE
                  </span>

                  <strong>
                    {summary.active}
                  </strong>

                </div>

              </article>


              <article>

                <Package
                  size={19}
                  strokeWidth={1.25}
                />

                <div>

                  <span>
                    DELIVERED
                  </span>

                  <strong>
                    {summary.delivered}
                  </strong>

                </div>

              </article>

            </div>

          </section>


          {/* =================================================
              SAVED ADDRESSES
          ================================================= */}

          <section className="customer-addresses">

            <div className="customer-account__section-heading">

              <div>

                <p>
                  MY ADDRESSES
                </p>

                <h2>
                  Saved Addresses
                </h2>

              </div>


              <button
                type="button"
                onClick={
                  openAddressForm
                }
              >

                <Plus
                  size={14}
                  strokeWidth={1.4}
                />

                ADD ADDRESS

              </button>

            </div>


            {addressMessage && (

              <div className="customer-address-message">

                <Check
                  size={16}
                  strokeWidth={1.4}
                />

                <p>
                  {addressMessage}
                </p>

              </div>

            )}


            {addressError && (

              <div className="customer-address-error">

                <AlertCircle
                  size={16}
                  strokeWidth={1.4}
                />

                <p>
                  {addressError}
                </p>

              </div>

            )}


            {addresses.length === 0 ? (

              <div className="customer-addresses__empty">

                <MapPin
                  size={28}
                  strokeWidth={1.2}
                />

                <h3>
                  No saved addresses yet.
                </h3>

                <p>
                  Save an address to make your
                  future Jivara checkouts faster.
                </p>


                <button
                  type="button"
                  onClick={
                    openAddressForm
                  }
                >

                  <Plus
                    size={15}
                    strokeWidth={1.4}
                  />

                  ADD YOUR FIRST ADDRESS

                </button>

              </div>

            ) : (

              <div className="customer-address-grid">

                {addresses.map(
                  (address) => (

                    <article
                      className={
                        address.isDefault
                          ? "customer-address-card customer-address-card--default"
                          : "customer-address-card"
                      }
                      key={
                        address._id
                      }
                    >

                      <div className="customer-address-card__top">

                        <div>

                          <p>
                            {address.label ||
                              "Address"}
                          </p>


                          {address.isDefault && (

                            <span>

                              <Star
                                size={11}
                                strokeWidth={1.4}
                              />

                              DEFAULT

                            </span>

                          )}

                        </div>


                        <MapPin
                          size={18}
                          strokeWidth={1.3}
                        />

                      </div>


                      <h3>

                        {address.firstName}{" "}
                        {address.lastName}

                      </h3>


                      <address>

                        {address.address}

                        {address.apartment && (
                          <>
                            <br />

                            {address.apartment}
                          </>
                        )}

                        <br />

                        {address.city},{" "}
                        {address.state}

                        <br />

                        {address.postalCode}

                        <br />

                        {address.country}

                      </address>


                      <p className="customer-address-card__phone">
                        {address.phone}
                      </p>


                      <div className="customer-address-card__actions">

                        {!address.isDefault && (

                          <button
                            type="button"
                            disabled={
                              addressBusyId ===
                              address._id
                            }
                            onClick={() =>
                              setDefaultAddress(
                                address._id
                              )
                            }
                          >

                            <Star
                              size={13}
                              strokeWidth={1.4}
                            />

                            SET DEFAULT

                          </button>

                        )}


                        <button
                          type="button"
                          className="customer-address-card__delete"
                          disabled={
                            addressBusyId ===
                            address._id
                          }
                          onClick={() =>
                            deleteAddress(
                              address._id
                            )
                          }
                        >

                          <Trash2
                            size={13}
                            strokeWidth={1.4}
                          />

                          DELETE

                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}


            {/* =================================================
                ADD ADDRESS FORM
            ================================================= */}

            {showAddressForm && (

              <div className="customer-address-form-wrap">

                <div className="customer-address-form__heading">

                  <div>

                    <p>
                      NEW ADDRESS
                    </p>

                    <h3>
                      Add a Saved Address
                    </h3>

                  </div>


                  <button
                    type="button"
                    onClick={
                      closeAddressForm
                    }
                    aria-label="Close address form"
                  >

                    <X
                      size={19}
                      strokeWidth={1.3}
                    />

                  </button>

                </div>


                <form
                  className="customer-address-form"
                  onSubmit={
                    handleSaveAddress
                  }
                >

                  <div className="customer-address-form__grid customer-address-form__grid--two">

                    <label>

                      <span>
                        ADDRESS LABEL
                      </span>

                      <input
                        type="text"
                        name="label"
                        value={
                          addressForm.label
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="Home, Work, Parents..."
                        maxLength={40}
                        required
                      />

                    </label>


                    <label className="customer-address-form__default">

                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={
                          addressForm.isDefault
                        }
                        onChange={
                          handleAddressChange
                        }
                      />

                      <span>
                        Make this my default
                        address
                      </span>

                    </label>

                  </div>


                  <div className="customer-address-form__grid customer-address-form__grid--two">

                    <label>

                      <span>
                        FIRST NAME *
                      </span>

                      <input
                        type="text"
                        name="firstName"
                        value={
                          addressForm.firstName
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                      />

                    </label>


                    <label>

                      <span>
                        LAST NAME *
                      </span>

                      <input
                        type="text"
                        name="lastName"
                        value={
                          addressForm.lastName
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                      />

                    </label>

                  </div>


                  <label>

                    <span>
                      PHONE / WHATSAPP *
                    </span>

                    <input
                      type="tel"
                      name="phone"
                      value={
                        addressForm.phone
                      }
                      onChange={
                        handleAddressChange
                      }
                      required
                    />

                  </label>


                  <label>

                    <span>
                      STREET ADDRESS *
                    </span>

                    <input
                      type="text"
                      name="address"
                      value={
                        addressForm.address
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Street address"
                      required
                    />

                  </label>


                  <label>

                    <span>
                      APARTMENT / LANDMARK
                    </span>

                    <input
                      type="text"
                      name="apartment"
                      value={
                        addressForm.apartment
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Optional"
                    />

                  </label>


                  <div className="customer-address-form__grid customer-address-form__grid--two">

                    <label>

                      <span>
                        CITY *
                      </span>

                      <input
                        type="text"
                        name="city"
                        value={
                          addressForm.city
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                      />

                    </label>


                    <label>

                      <span>
                        STATE / REGION *
                      </span>

                      <input
                        type="text"
                        name="state"
                        value={
                          addressForm.state
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                      />

                    </label>

                  </div>


                  <div className="customer-address-form__grid customer-address-form__grid--two">

                    <label>

                      <span>
                        POSTAL CODE *
                      </span>

                      <input
                        type="text"
                        name="postalCode"
                        value={
                          addressForm.postalCode
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                      />

                    </label>


                    <label>

                      <span>
                        COUNTRY *
                      </span>

                      <input
                        type="text"
                        name="country"
                        value={
                          addressForm.country
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                      />

                    </label>

                  </div>


                  <div className="customer-address-form__actions">

                    <button
                      type="button"
                      onClick={
                        closeAddressForm
                      }
                    >
                      CANCEL
                    </button>


                    <button
                      type="submit"
                      disabled={
                        addressSaving
                      }
                    >

                      {addressSaving
                        ? "SAVING..."
                        : "SAVE ADDRESS"}

                      {!addressSaving && (

                        <ArrowRight
                          size={15}
                          strokeWidth={1.4}
                        />

                      )}

                    </button>

                  </div>

                </form>

              </div>

            )}

          </section>


          {/* =================================================
              ORDERS
          ================================================= */}

          <section className="customer-account__orders">

            <div className="customer-account__section-heading">

              <div>

                <p>
                  ORDER HISTORY
                </p>

                <h2>
                  Your Jivara Orders
                </h2>

              </div>


              <button
                type="button"
                onClick={
                  loadAccount
                }
              >

                <RefreshCw
                  size={14}
                  strokeWidth={1.4}
                />

                REFRESH

              </button>

            </div>


            {orders.length === 0 ? (

              <div className="customer-account__empty">

                <ShoppingBag
                  size={31}
                  strokeWidth={1.2}
                />


                <h3>
                  Your Jivara story
                  begins here.
                </h3>


                <p>
                  Orders placed using
                  {customer?.email
                    ? ` ${customer.email}`
                    : " this email"}{" "}
                  will appear in your
                  account.
                </p>


                <Link
                  to="/collections"
                >

                  EXPLORE COLLECTIONS

                  <ArrowRight
                    size={16}
                    strokeWidth={1.4}
                  />

                </Link>

              </div>

            ) : (

              <div className="customer-order-list">

                {orders.map(
                  (order) => {

                    const firstItem =
                      order.items?.[0];


                    return (

                      <article
                        className="customer-order-card"
                        key={
                          order._id
                        }
                      >

                        <div className="customer-order-card__image">

                          {firstItem?.image ? (

                            <img
                              src={
                                firstItem.image
                              }
                              alt={
                                firstItem.name
                              }
                            />

                          ) : (

                            <Package
                              size={28}
                              strokeWidth={1.2}
                            />

                          )}

                        </div>


                        <div className="customer-order-card__content">

                          <div className="customer-order-card__top">

                            <div>

                              <p>
                                {order.orderNumber}
                              </p>

                              <h3>
                                {firstItem?.name ||
                                  "Jivara Order"}
                              </h3>

                            </div>


                            <span className="customer-order-card__status">
                              {order.orderStatus}
                            </span>

                          </div>


                          <div className="customer-order-card__meta">

                            <div>

                              <CalendarDays
                                size={14}
                                strokeWidth={1.3}
                              />

                              <span>
                                {formatDate(
                                  order.createdAt
                                )}
                              </span>

                            </div>


                            <div>

                              <span>
                                {order.totalPieces}{" "}
                                {order.totalPieces ===
                                1
                                  ? "Piece"
                                  : "Pieces"}
                              </span>

                            </div>


                            <strong>

                              {formatPrice(
                                order.pricing
                                  ?.total,
                                order.pricing
                                  ?.currency
                              )}

                            </strong>

                          </div>


                          {order.items?.length >
                            1 && (

                            <p className="customer-order-card__more">

                              +{" "}
                              {order.items.length -
                                1}{" "}
                              additional design
                              {order.items.length -
                                1 >
                              1
                                ? "s"
                                : ""}

                            </p>

                          )}

                        </div>


                        <button
                          type="button"
                          className="customer-order-card__view"
                          onClick={() =>
                            navigate(
                              `/account/orders/${order._id}`
                            )
                          }
                        >

                          VIEW ORDER

                          <ArrowRight
                            size={16}
                            strokeWidth={1.4}
                          />

                        </button>

                      </article>

                    );

                  }
                )}

              </div>

            )}

          </section>

        </div>

      </main>


      <Footer />
    </>
  );

}


export default CustomerAccount;