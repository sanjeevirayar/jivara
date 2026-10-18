import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    ArrowRight,
    ChevronLeft,
    CreditCard,
    ShieldCheck,
    ShoppingBag,
    CheckCircle2,
    AlertCircle,
    Clock3,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "./Payment.css";


/* =====================================================
   BACKEND
===================================================== */

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
   LOAD RAZORPAY SCRIPT
===================================================== */

const loadRazorpayScript = () => {
    return new Promise(
        (resolve) => {

            if (
                window.Razorpay
            ) {
                resolve(true);

                return;
            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";


            script.onload = () => {
                resolve(true);
            };


            script.onerror = () => {
                resolve(false);
            };


            document.body.appendChild(
                script
            );

        }
    );
};


function Payment() {

    /* =====================================================
       PAYMENT DRAFT
    ===================================================== */

    const [
        paymentDraft,
        setPaymentDraft,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState("");


    const [
        completedOrder,
        setCompletedOrder,
    ] = useState(null);


    /* =====================================================
       LOAD PAYMENT DRAFT
    ===================================================== */

    useEffect(() => {

        try {

            const savedDraft =
                JSON.parse(
                    localStorage.getItem(
                        "jivara-payment-draft"
                    )
                );


            setPaymentDraft(
                savedDraft
            );

        } catch {

            setPaymentDraft(
                null
            );

        }

    }, []);


    /* =====================================================
       NO PAYMENT DRAFT
    ===================================================== */

    if (
        !paymentDraft &&
        !completedOrder
    ) {

        return (
            <>
                <Header />


                <main className="payment-empty">

                    <ShoppingBag
                        size={34}
                        strokeWidth={1.2}
                    />


                    <p>
                        NO PAYMENT READY
                    </p>


                    <h1>
                        Your order isn't
                        <span>
                            ready for payment.
                        </span>
                    </h1>


                    <Link to="/bag">
                        RETURN TO BAG
                    </Link>

                </main>


                <Footer />
            </>
        );

    }


    /* =====================================================
       VALUES
    ===================================================== */

    const customer =
        paymentDraft?.customer;


    const bag =
        paymentDraft?.bag || [];


    const pricing =
        paymentDraft?.pricing || {};


    const currency =
        pricing.currency ||
        "INR";


    const subtotal =
        Number(
            pricing.subtotal
        ) || 0;


    /* =====================================================
       START PAYMENT
    ===================================================== */

    const handlePayment = async () => {

        if (
            !paymentDraft ||
            loading
        ) {
            return;
        }


        setError("");

        setLoading(true);


        try {

            /* ===============================================
               LOAD RAZORPAY CHECKOUT
            =============================================== */

            const scriptLoaded =
                await loadRazorpayScript();


            if (
                !scriptLoaded
            ) {

                throw new Error(
                    "Unable to load the secure payment window. Please check your internet connection and try again."
                );

            }


            /* ===============================================
               CREATE TRUSTED SERVER ORDER
            =============================================== */

            const createResponse =
                await fetch(
                    `${API_URL}/api/payments/create-order`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            customer: paymentDraft.customer,

                            items: bag.map((item) => ({
                                productId: item.productId,

                                quantity:
                                    Number(item.quantity) || 1,

                                slug:
                                    item.slug || "",

                                collectionId:
                                    item.collectionId || "",

                                image:
                                    item.image || "",

                                category:
                                    item.category || "",

                                color:
                                    item.color || "",

                                measurementUnit:
                                    item.measurementUnit || "in",

                                measurements:
                                    item.measurements || [],

                                customisation:
                                    item.customisation || {
                                        choice: "Keep Original",
                                        notes: "",
                                    },

                                requiredBy:
                                    item.requiredBy || null,

                                leadTime:
                                    item.leadTime || null,

                                estimatedDispatch:
                                    item.estimatedDispatch || null,
                            })),
                        }),
                    }
                );


            const createData =
                await createResponse.json();


            if (
                !createResponse.ok ||
                !createData.success
            ) {

                throw new Error(
                    createData.message ||
                    "Unable to create the payment order."
                );

            }


            /* ===============================================
               RAZORPAY OPTIONS
            =============================================== */

            const options = {

                key:
                    createData.keyId,

                amount:
                    createData.amount,

                currency:
                    createData.currency,

                name:
                    "JIVARA",

                description:
                    "Made-to-order Jivara design",

                order_id:
                    createData.orderId,


                /* =============================================
                   CUSTOMER DETAILS
                ============================================= */

                prefill: {

                    name:
                        `${customer.firstName} ${customer.lastName}`,

                    email:
                        customer.email,

                    contact:
                        customer.phone,

                },


                /* =============================================
                   BRAND
                ============================================= */

                theme: {
                    color:
                        "#9b7a42",
                },


                /* =============================================
                   PAYMENT SUCCESS CALLBACK
                ============================================= */

                handler:
                    async (
                        razorpayResponse
                    ) => {

                        try {

                            const verifyResponse =
                                await fetch(
                                    `${API_URL}/api/payments/verify`,
                                    {
                                        method:
                                            "POST",

                                        headers: {
                                            "Content-Type":
                                                "application/json",
                                        },

                                        body:
                                            JSON.stringify({

                                                orderId:
                                                    createData.orderId,

                                                razorpay_order_id:
                                                    razorpayResponse
                                                        .razorpay_order_id,

                                                razorpay_payment_id:
                                                    razorpayResponse
                                                        .razorpay_payment_id,

                                                razorpay_signature:
                                                    razorpayResponse
                                                        .razorpay_signature,

                                            }),

                                    }
                                );


                            const verifyData =
                                await verifyResponse.json();


                            if (
                                !verifyResponse.ok ||
                                !verifyData.success ||
                                !verifyData.verified
                            ) {

                                throw new Error(
                                    verifyData.message ||
                                    "Payment verification failed."
                                );

                            }


                            /* =========================================
                               FINAL COMPLETED ORDER
                            ========================================= */

                            const completed = {

                                orderNumber:
                                    verifyData.orderNumber,

                                customer:
                                    paymentDraft.customer,

                                bag:
                                    paymentDraft.bag,

                                totalPieces:
                                    paymentDraft.totalPieces,


                                pricing:
                                    verifyData.pricing,


                                payment: {

                                    provider:
                                        "Razorpay",

                                    paymentId:
                                        verifyData.paymentId,

                                    razorpayOrderId:
                                        verifyData.razorpayOrderId,

                                    status:
                                        verifyData.paymentStatus,

                                },


                                status:
                                    "Paid",


                                paidAt:
                                    new Date()
                                        .toISOString(),

                            };


                            /* =========================================
                               SAVE COMPLETED ORDER
                            ========================================= */

                            localStorage.setItem(
                                "jivara-last-order",
                                JSON.stringify(
                                    completed
                                )
                            );


                            /* =========================================
                               CLEAR TEMPORARY CHECKOUT DATA
                            ========================================= */

                            localStorage.removeItem(
                                "jivara-bag"
                            );


                            localStorage.removeItem(
                                "jivara-checkout"
                            );


                            localStorage.removeItem(
                                "jivara-payment-draft"
                            );


                            window.dispatchEvent(
                                new Event(
                                    "jivara-bag-updated"
                                )
                            );


                            setCompletedOrder(
                                completed
                            );


                            setPaymentDraft(
                                null
                            );


                            setLoading(
                                false
                            );

                        } catch (
                        verificationError
                        ) {

                            console.error(
                                verificationError
                            );


                            setError(
                                verificationError.message ||
                                "Payment could not be verified."
                            );


                            setLoading(
                                false
                            );

                        }

                    },


                /* =============================================
                   CUSTOMER CLOSED PAYMENT WINDOW
                ============================================= */

                modal: {

                    ondismiss: () => {

                        setLoading(
                            false
                        );

                    },

                },

            };


            /* ===============================================
               OPEN CHECKOUT
            =============================================== */

            const razorpay =
                new window.Razorpay(
                    options
                );


            /* ===============================================
               PAYMENT FAILURE
            =============================================== */

            razorpay.on(
                "payment.failed",
                (response) => {

                    console.error(
                        "Payment failed:",
                        response.error
                    );


                    setError(
                        response.error
                            ?.description ||
                        "The payment was not completed. Please try again."
                    );


                    setLoading(
                        false
                    );

                }
            );


            razorpay.open();

        } catch (
        paymentError
        ) {

            console.error(
                paymentError
            );


            setError(
                paymentError.message ||
                "Unable to start payment."
            );


            setLoading(
                false
            );

        }

    };


    /* =====================================================
       PAYMENT SUCCESS
    ===================================================== */

    if (
        completedOrder
    ) {

        return (
            <>
                <Header />


                <main className="payment-success">

                    <div className="payment-success__icon">

                        <CheckCircle2
                            size={42}
                            strokeWidth={1.2}
                        />

                    </div>


                    <p className="payment-success__eyebrow">
                        PAYMENT SUCCESSFUL
                    </p>


                    <h1>

                        Thank You.

                        <span>
                            Your Jivara order is confirmed.
                        </span>

                    </h1>


                    <p className="payment-success__message">
                        Your payment has been verified
                        and your made-to-order request
                        has been recorded successfully.
                    </p>


                    <div className="payment-success__details">

                        <div>

                            <span>
                                ORDER REFERENCE
                            </span>


                            <strong>
                                {
                                    completedOrder
                                        .orderNumber
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                PAYMENT
                            </span>


                            <strong>

                                {formatPrice(
                                    completedOrder
                                        .pricing
                                        .total,
                                    completedOrder
                                        .pricing
                                        .currency
                                )}

                            </strong>

                        </div>


                        <div>

                            <span>
                                STATUS
                            </span>


                            <strong>
                                PAID
                            </strong>

                        </div>

                    </div>


                    <div className="payment-success__next">

                        <Clock3
                            size={19}
                            strokeWidth={1.3}
                        />


                        <p>
                            Jivara can now review your
                            measurements and customisation
                            preferences before production
                            begins.
                        </p>

                    </div>


                    <Link
                        to="/collections"
                        className="payment-success__button"
                    >

                        <span>
                            EXPLORE MORE DESIGNS
                        </span>


                        <ArrowRight
                            size={18}
                            strokeWidth={1.5}
                        />

                    </Link>

                </main>


                <Footer />
            </>
        );

    }


    return (
        <>
            <Header />


            <main className="payment-page">


                {/* =====================================================
            BACK
        ===================================================== */}

                <div className="payment-back">

                    <Link
                        to="/order-confirmation"
                    >

                        <ChevronLeft
                            size={15}
                            strokeWidth={1.5}
                        />

                        BACK TO ORDER REVIEW

                    </Link>

                </div>


                {/* =====================================================
            HEADING
        ===================================================== */}

                <section className="payment-heading">

                    <p>
                        SECURE CHECKOUT
                    </p>


                    <h1>

                        Complete Your

                        <span>
                            Payment.
                        </span>

                    </h1>


                    <p className="payment-heading__text">
                        Your payment will be processed
                        securely through Razorpay.
                    </p>

                </section>


                {/* =====================================================
            PAYMENT LAYOUT
        ===================================================== */}

                <section className="payment-layout">


                    {/* =================================================
              LEFT
          ================================================= */}

                    <div className="payment-details">


                        <section className="payment-card">

                            <div className="payment-card__heading">

                                <ShoppingBag
                                    size={19}
                                    strokeWidth={1.3}
                                />


                                <div>

                                    <p>
                                        YOUR ORDER
                                    </p>


                                    <h2>
                                        Made Personally for You
                                    </h2>

                                </div>

                            </div>


                            <div className="payment-products">

                                {bag.map(
                                    (item) => (

                                        <div
                                            className="payment-product"
                                            key={
                                                item.cartItemId
                                            }
                                        >

                                            <div className="payment-product__image">

                                                <img
                                                    src={
                                                        item.image
                                                    }
                                                    alt={
                                                        item.name
                                                    }
                                                />

                                            </div>


                                            <div className="payment-product__content">

                                                <h3>
                                                    {item.name}
                                                </h3>


                                                <p>
                                                    Quantity:{" "}
                                                    {item.quantity}
                                                </p>


                                                <p>
                                                    Colour:{" "}
                                                    {item.color}
                                                </p>


                                                <strong>

                                                    {formatPrice(
                                                        item.subtotal ||
                                                        (
                                                            item.price *
                                                            item.quantity
                                                        ),
                                                        item.currency ||
                                                        currency
                                                    )}

                                                </strong>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>


                        {/* ===============================================
                SECURITY
            =============================================== */}

                        <section className="payment-security">

                            <ShieldCheck
                                size={24}
                                strokeWidth={1.25}
                            />


                            <div>

                                <p>
                                    SECURE PAYMENT
                                </p>


                                <h3>
                                    Payment details stay with
                                    the payment provider.
                                </h3>


                                <span>
                                    Jivara does not store your
                                    card, UPI PIN or banking
                                    credentials.
                                </span>

                            </div>

                        </section>

                    </div>


                    {/* =================================================
              RIGHT
          ================================================= */}

                    <aside className="payment-summary">

                        <p className="payment-summary__eyebrow">
                            PAYMENT SUMMARY
                        </p>


                        <h2>
                            Amount to Pay
                        </h2>


                        <div className="payment-summary__rows">

                            <div>

                                <span>
                                    Subtotal
                                </span>


                                <p>

                                    {formatPrice(
                                        subtotal,
                                        currency
                                    )}

                                </p>

                            </div>


                            <div>

                                <span>
                                    Shipping
                                </span>


                                <p>
                                    ₹0
                                </p>

                            </div>

                        </div>


                        <p className="payment-summary__shipping-note">
                            ₹0 shipping is being used
                            temporarily while we test the
                            payment integration.
                        </p>


                        <div className="payment-summary__total">

                            <span>
                                TOTAL
                            </span>


                            <strong>

                                {formatPrice(
                                    subtotal,
                                    currency
                                )}

                            </strong>

                        </div>


                        {error && (

                            <div className="payment-error">

                                <AlertCircle
                                    size={18}
                                    strokeWidth={1.4}
                                />


                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        <button
                            type="button"
                            className="payment-button"
                            onClick={
                                handlePayment
                            }
                            disabled={
                                loading
                            }
                        >

                            <CreditCard
                                size={18}
                                strokeWidth={1.4}
                            />


                            <span>

                                {loading
                                    ? "OPENING PAYMENT..."
                                    : `PAY ${formatPrice(
                                        subtotal,
                                        currency
                                    )}`}

                            </span>


                            {!loading && (

                                <ArrowRight
                                    size={18}
                                    strokeWidth={1.5}
                                />

                            )}

                        </button>


                        <div className="payment-summary__secure">

                            <ShieldCheck
                                size={15}
                                strokeWidth={1.3}
                            />


                            <span>
                                SECURE PAYMENT VIA RAZORPAY
                            </span>

                        </div>


                        <p className="payment-summary__test">
                            TEST MODE — no real money
                            should be charged while using
                            your Razorpay test keys.
                        </p>

                    </aside>

                </section>

            </main>


            <Footer />
        </>
    );

}


export default Payment;