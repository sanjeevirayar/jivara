import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    AlertCircle,
} from "lucide-react";

import "./AdminLogin.css";


const API_URL =
    "http://localhost:5000";


function AdminLogin() {

    const navigate =
        useNavigate();


    const [form, setForm] =
        useState({
            email: "",
            password: "",
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
                "jivara-admin-token"
            );


        if (token) {
            navigate(
                "/admin",
                {
                    replace: true,
                }
            );
        }

    }, [navigate]);


    /* =====================================================
       INPUT
    ===================================================== */

    const handleChange = (
        event
    ) => {

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

    };


    /* =====================================================
       LOGIN
    ===================================================== */

    const handleSubmit =
        async (event) => {

            event.preventDefault();


            if (loading) {
                return;
            }


            setError("");
            setLoading(true);


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/admin/auth/login`,
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
                        "Unable to log in."
                    );

                }


                sessionStorage.setItem(
                    "jivara-admin-token",
                    data.token
                );


                sessionStorage.setItem(
                    "jivara-admin-email",
                    data.admin?.email || ""
                );


                navigate(
                    "/admin",
                    {
                        replace: true,
                    }
                );

            } catch (
            loginError
            ) {

                setError(
                    loginError.message ||
                    "Unable to log in."
                );

            } finally {

                setLoading(false);

            }

        };


    return (
        <main className="admin-login">
            <section className="admin-login__brand">

                <div className="admin-login__brand-logo">
                    <img
                        src="/images/jivara-logo.png"
                        alt="Jivara"
                    />
                </div>


                <div className="admin-login__brand-copy">

                    <h1>
                        Crafted with Love,
                        <br />
                        Inspired by Devotion
                    </h1>

                    <span>
                        Administration
                    </span>

                </div>

            </section>
            
            <section className="admin-login__panel">

                <div className="admin-login__icon">
                    <LockKeyhole
                        size={25}
                        strokeWidth={1.3}
                    />
                </div>


                <p className="admin-login__eyebrow">
                    PRIVATE ACCESS
                </p>


                <h2>
                    Admin
                    <span>Login.</span>
                </h2>


                <p className="admin-login__intro">
                    Sign in to manage Jivara
                    orders, measurements,
                    payments and production.
                </p>


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="admin-login__form"
                >

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


                    <label>

                        <span>
                            PASSWORD
                        </span>

                        <div className="admin-login__password">

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
                                autoComplete="current-password"
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


                    {error && (

                        <div className="admin-login__error">

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
                        className="admin-login__submit"
                        type="submit"
                        disabled={
                            loading
                        }
                    >

                        <span>
                            {loading
                                ? "SIGNING IN..."
                                : "ENTER ADMIN"}
                        </span>

                        {!loading && (
                            <ArrowRight
                                size={18}
                                strokeWidth={1.5}
                            />
                        )}

                    </button>

                </form>


                <p className="admin-login__secure">
                    AUTHORISED JIVARA
                    ACCESS ONLY
                </p>

            </section>

        </main>
    );

}


export default AdminLogin;