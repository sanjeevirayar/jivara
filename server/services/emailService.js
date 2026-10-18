import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();


const getResend = () => {

    const apiKey =
        process.env.RESEND_API_KEY;


    if (!apiKey) {
        throw new Error(
            "RESEND_API_KEY is missing from server/.env"
        );
    }


    return new Resend(
        apiKey
    );

};

/* =====================================================
   HELPERS
===================================================== */

const escapeHtml = (value = "") =>
    String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");


const formatPrice = (
    value,
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
        Number(value) || 0
    );


const formatDate = (value) => {

    if (!value) {
        return "Not specified";
    }


    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ).format(
        new Date(value)
    );

};


/* =====================================================
   PRODUCT HTML
===================================================== */

const buildItemsHtml = (
    order
) => {

    return order.items
        .map(
            (
                item,
                index
            ) => {

                const measurements =
                    Array.isArray(
                        item.measurements
                    )
                        ? item.measurements
                        : [];


                const measurementHtml =
                    measurements.length
                        ? measurements
                            .map(
                                (
                                    set,
                                    pieceIndex
                                ) => {

                                    const rows =
                                        Object.entries(
                                            set
                                        )
                                            .map(
                                                ([
                                                    key,
                                                    value,
                                                ]) => `
                            <tr>
                              <td
                                style="
                                  padding:5px 12px 5px 0;
                                  color:#706c63;
                                "
                              >
                                ${escapeHtml(
                                                    key
                                                )}
                              </td>

                              <td
                                style="
                                  padding:5px 0;
                                  color:#292824;
                                "
                              >
                                ${escapeHtml(
                                                    value
                                                )}
                                ${escapeHtml(
                                                    item.measurementUnit ||
                                                    "in"
                                                )}
                              </td>
                            </tr>
                          `
                                            )
                                            .join("");


                                    return `
                      <div style="margin-top:14px;">
                        <strong>
                          Piece ${pieceIndex + 1}
                        </strong>

                        <table
                          cellspacing="0"
                          cellpadding="0"
                          style="
                            margin-top:6px;
                            font-size:13px;
                          "
                        >
                          ${rows}
                        </table>
                      </div>
                    `;

                                }
                            )
                            .join("")
                        : `
              <p>
                No measurements recorded.
              </p>
            `;


                return `
          <div
            style="
              margin-top:${index === 0 ? "0" : "28px"};
              padding-top:${index === 0 ? "0" : "28px"};
              border-top:${index === 0 ? "0" : "1px solid #ddd6c7"};
            "
          >
            <h3
              style="
                margin:0 0 8px;
                font-family:Georgia,serif;
                font-size:22px;
                font-weight:normal;
                color:#292824;
              "
            >
              ${escapeHtml(
                    item.name
                )}
            </h3>

            <p
              style="
                margin:4px 0;
                color:#59564f;
              "
            >
              Quantity:
              ${item.quantity}
            </p>

            <p
              style="
                margin:4px 0;
                color:#59564f;
              "
            >
              Colour:
              ${escapeHtml(
                    item.color ||
                    "Original"
                )}
            </p>

            <p
              style="
                margin:4px 0;
                color:#59564f;
              "
            >
              Subtotal:
              ${formatPrice(
                    item.subtotal,
                    item.currency
                )}
            </p>

            <p
              style="
                margin:4px 0;
                color:#59564f;
              "
            >
              Required by:
              ${formatDate(
                    item.requiredBy
                )}
            </p>

            <p
              style="
                margin:14px 0 4px;
                color:#9b7a42;
                letter-spacing:1px;
                font-size:11px;
              "
            >
              CUSTOMISATION
            </p>

            <p
              style="
                margin:4px 0;
                color:#59564f;
              "
            >
              ${escapeHtml(
                    item.customisation
                        ?.choice ||
                    "Keep Original"
                )}
            </p>

            ${item.customisation
                        ?.notes
                        ? `
                  <p
                    style="
                      margin:4px 0;
                      color:#59564f;
                    "
                  >
                    ${escapeHtml(
                            item.customisation.notes
                        )}
                  </p>
                `
                        : ""
                    }

            <p
              style="
                margin:16px 0 4px;
                color:#9b7a42;
                letter-spacing:1px;
                font-size:11px;
              "
            >
              MEASUREMENTS
            </p>

            ${measurementHtml}

          </div>
        `;

            }
        )
        .join("");

};


/* =====================================================
   CUSTOMER CONFIRMATION
===================================================== */

export const sendCustomerOrderConfirmation =
    async (
        order
    ) => {

        const customerName =
            `${order.customer.firstName} ${order.customer.lastName}`;


        const resend =
            getResend();


        const {
            data,
            error,
        } =
            await resend.emails.send({

                from:
                    process.env.EMAIL_FROM,

                to:
                    order.customer.email,

                subject:
                    `Jivara Order Confirmed — ${order.orderNumber}`,

                html: `
          <div
            style="
              max-width:680px;
              margin:auto;
              padding:40px 28px;
              background:#fcfaf5;
              color:#292824;
              font-family:Georgia,serif;
            "
          >

            <p
              style="
                margin:0;
                color:#9b7a42;
                font-family:Arial,sans-serif;
                font-size:11px;
                letter-spacing:4px;
              "
            >
              JIVARA
            </p>


            <h1
              style="
                margin:18px 0 0;
                font-size:38px;
                font-weight:normal;
              "
            >
              Your order is confirmed.
            </h1>


            <p
              style="
                margin:20px 0 0;
                color:#59564f;
                line-height:1.6;
              "
            >
              Dear
              ${escapeHtml(
                    customerName
                )},
              thank you for choosing Jivara.
              Your payment has been received
              and your made-to-order request
              has been recorded.
            </p>


            <div
              style="
                margin-top:28px;
                padding:20px;
                border:1px solid #c8ad77;
              "
            >
              <p
                style="
                  margin:0;
                  color:#9b7a42;
                  font-family:Arial,sans-serif;
                  font-size:10px;
                  letter-spacing:2px;
                "
              >
                ORDER REFERENCE
              </p>

              <h2
                style="
                  margin:7px 0 0;
                  font-size:25px;
                  font-weight:normal;
                "
              >
                ${escapeHtml(
                    order.orderNumber
                )}
              </h2>
            </div>


            <div
              style="
                margin-top:30px;
              "
            >
              ${buildItemsHtml(
                    order
                )}
            </div>


            <div
              style="
                margin-top:32px;
                padding-top:22px;
                border-top:1px solid #9b7a42;
              "
            >

              <table
                width="100%"
                cellspacing="0"
                cellpadding="5"
              >
                <tr>
                  <td>
                    Subtotal
                  </td>

                  <td
                    align="right"
                  >
                    ${formatPrice(
                    order.pricing.subtotal,
                    order.pricing.currency
                )}
                  </td>
                </tr>

                <tr>
                  <td>
                    Shipping
                  </td>

                  <td
                    align="right"
                  >
                    ${formatPrice(
                    order.pricing.shippingAmount,
                    order.pricing.currency
                )}
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>
                      Total Paid
                    </strong>
                  </td>

                  <td
                    align="right"
                  >
                    <strong>
                      ${formatPrice(
                    order.pricing.total,
                    order.pricing.currency
                )}
                    </strong>
                  </td>
                </tr>
              </table>

            </div>


            <p
              style="
                margin-top:30px;
                color:#59564f;
                line-height:1.6;
              "
            >
              Jivara will review your
              measurements and customisation
              details before production.
            </p>


            <p
              style="
                margin-top:35px;
                color:#9b7a42;
                font-style:italic;
              "
            >
               Crafted with Love, Inspired by Devotion
            </p>

          </div>
        `,

            });


        if (error) {
            throw new Error(
                error.message ||
                "Customer email failed."
            );
        }


        return data;

    };


/* =====================================================
   ADMIN NEW ORDER NOTIFICATION
===================================================== */

export const sendAdminNewOrderNotification =
    async (
        order
    ) => {

        /* =====================================================
           CREATE RESEND CLIENT
        ===================================================== */

        const resend =
            getResend();


        /* =====================================================
           VALIDATE ADMIN EMAIL
        ===================================================== */

        const adminEmail =
            process.env.ORDER_NOTIFICATION_EMAIL;


        if (!adminEmail) {

            throw new Error(
                "ORDER_NOTIFICATION_EMAIL is missing from server/.env"
            );

        }


        /* =====================================================
           CUSTOMER
        ===================================================== */

        const customerName =
            `${order.customer.firstName} ${order.customer.lastName}`;


        /* =====================================================
           ADMIN ORDER URL
        ===================================================== */

        const clientOrigin =
            process.env.CLIENT_ORIGIN ||
            "http://localhost:5173";


        const adminOrderUrl =
            `${clientOrigin}/admin/orders/${order._id}`;


        /* =====================================================
           SEND EMAIL
        ===================================================== */

        const {
            data,
            error,
        } =
            await resend.emails.send({

                from:
                    process.env.EMAIL_FROM,

                to:
                    adminEmail,

                subject:
                    `New Jivara Order — ${order.orderNumber}`,

                html: `
          <div
            style="
              max-width:680px;
              margin:auto;
              padding:40px 28px;
              background:#fcfaf5;
              color:#292824;
              font-family:Georgia,serif;
            "
          >

            <p
              style="
                margin:0;
                color:#9b7a42;
                font-family:Arial,sans-serif;
                font-size:11px;
                letter-spacing:4px;
              "
            >
              JIVARA ADMIN
            </p>


            <h1
              style="
                margin:18px 0 0;
                font-size:36px;
                font-weight:normal;
              "
            >
              New paid order received.
            </h1>


            <div
              style="
                margin-top:27px;
                padding:22px;
                border:1px solid #ddd6c7;
              "
            >

              <p>
                <strong>
                  Order:
                </strong>

                ${escapeHtml(
                    order.orderNumber
                )}
              </p>


              <p>
                <strong>
                  Customer:
                </strong>

                ${escapeHtml(
                    customerName
                )}
              </p>


              <p>
                <strong>
                  Email:
                </strong>

                ${escapeHtml(
                    order.customer.email
                )}
              </p>


              <p>
                <strong>
                  Phone:
                </strong>

                ${escapeHtml(
                    order.customer.phone
                )}
              </p>


              <p>
                <strong>
                  Pieces:
                </strong>

                ${order.totalPieces}
              </p>


              <p>
                <strong>
                  Amount Paid:
                </strong>

                ${formatPrice(
                    order.pricing.total,
                    order.pricing.currency
                )}
              </p>


              <p>
                <strong>
                  Status:
                </strong>

                ${escapeHtml(
                    order.orderStatus
                )}
              </p>

            </div>


            <div
              style="
                margin-top:30px;
              "
            >
              ${buildItemsHtml(
                  order
              )}
            </div>


            <a
              href="${adminOrderUrl}"
              style="
                display:inline-block;
                margin-top:30px;
                padding:15px 22px;
                background:#292824;
                color:#ffffff;
                font-family:Arial,sans-serif;
                font-size:11px;
                letter-spacing:2px;
                text-decoration:none;
              "
            >
              VIEW ORDER IN ADMIN
            </a>


            <p
              style="
                margin-top:35px;
                color:#9b7a42;
                font-style:italic;
              "
            >
              Crafted with Love, Inspired by Devotion
            </p>

          </div>
        `,

            });


        /* =====================================================
           RESEND ERROR
        ===================================================== */

        if (error) {

            throw new Error(
                error.message ||
                "Admin notification email failed."
            );

        }


        return data;

        

    };
    /* =========================================================
   CONTACT ENQUIRY
========================================================= */

const escapeContactHtml = (
  value = ""
) => {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

};


export const sendContactEnquiryNotification =
  async ({
    name,
    email,
    phone,
    enquiryType,
    message,
  }) => {

    const resend =
      getResend();


    const recipient =
      process.env
        .CONTACT_NOTIFICATION_EMAIL;


    if (!recipient) {

      throw new Error(
        "CONTACT_NOTIFICATION_EMAIL is missing from server/.env"
      );

    }


    const safeName =
      escapeContactHtml(
        name
      );


    const safeEmail =
      escapeContactHtml(
        email
      );


    const safePhone =
      escapeContactHtml(
        phone || "Not provided"
      );


    const safeType =
      escapeContactHtml(
        enquiryType ||
        "General Enquiry"
      );


    const safeMessage =
      escapeContactHtml(
        message
      ).replace(
        /\n/g,
        "<br />"
      );


    const result =
      await resend.emails.send({

        from:
          process.env.EMAIL_FROM,

        to: [
          recipient,
        ],

        replyTo:
          email,

        subject:
          `New Jivara enquiry — ${enquiryType}`,

        html: `
          <!DOCTYPE html>

          <html>
            <body
              style="
                margin:0;
                padding:0;
                background:#f8f5ed;
                color:#292824;
                font-family:Georgia,serif;
              "
            >

              <div
                style="
                  max-width:680px;
                  margin:0 auto;
                  padding:48px 30px;
                "
              >

                <div
                  style="
                    border:1px solid rgba(41,40,36,0.14);
                    background:#fcfaf5;
                    padding:38px;
                  "
                >

                  <p
                    style="
                      margin:0 0 10px;
                      color:#9b7a42;
                      font-family:Arial,sans-serif;
                      font-size:11px;
                      letter-spacing:2px;
                    "
                  >
                    JIVARA WEBSITE ENQUIRY
                  </p>


                  <h1
                    style="
                      margin:0 0 30px;
                      font-size:34px;
                      font-weight:400;
                    "
                  >
                    New customer enquiry
                  </h1>


                  <p>
                    <strong>Name</strong><br />
                    ${safeName}
                  </p>


                  <p>
                    <strong>Email</strong><br />
                    ${safeEmail}
                  </p>


                  <p>
                    <strong>Phone</strong><br />
                    ${safePhone}
                  </p>


                  <p>
                    <strong>Enquiry Type</strong><br />
                    ${safeType}
                  </p>


                  <div
                    style="
                      margin-top:28px;
                      padding-top:24px;
                      border-top:1px solid rgba(41,40,36,0.14);
                    "
                  >

                    <strong>
                      Message
                    </strong>


                    <p
                      style="
                        line-height:1.7;
                      "
                    >
                      ${safeMessage}
                    </p>

                  </div>

                </div>

              </div>

            </body>
          </html>
        `,
      });


    if (
      result.error
    ) {

      throw new Error(
        result.error.message ||
        "Resend failed to send contact enquiry."
      );

    }


    return result;

  };