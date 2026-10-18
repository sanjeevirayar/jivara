import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();


const resend =
  new Resend(
    process.env.RESEND_API_KEY
  );


const run = async () => {

  try {

    const {
      data,
      error,
    } =
      await resend.emails.send({

        from:
          process.env.EMAIL_FROM,

        to:
          process.env.ORDER_NOTIFICATION_EMAIL,

        subject:
          "Jivara Email Test",

        html: `
          <div
            style="
              font-family: Georgia, serif;
              padding: 30px;
              color: #292824;
            "
          >
            <p
              style="
                font-size: 12px;
                letter-spacing: 3px;
                color: #9b7a42;
              "
            >
              JIVARA
            </p>

            <h1>
              Email notifications are working.
            </h1>

            <p>
              This is a test email from the
              Jivara order management system.
            </p>
          </div>
        `,

      });


    if (error) {

      console.error(
        "Email failed:",
        error
      );

      return;
    }


    console.log(
      "Email sent successfully:",
      data
    );

  } catch (error) {

    console.error(
      "Email test error:",
      error
    );

  }

};


run();