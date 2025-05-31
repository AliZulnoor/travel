import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { loginWithGoogle, storeUserData } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

const SignIn = () => {
    const [creatingDoc, setCreatingDoc] = useState(true);

    useEffect(() => {
        account.get()
            .then(async (authUser) => {
                await storeUserData({
                    id: authUser.$id,
                    name: authUser.name,
                    email: authUser.email,
                    picture: authUser.prefs?.picture,
                });

                window.location.href = "/";
            })
            .catch(() => {
                setCreatingDoc(false);
            });
    }, []);

    return (
        <main className="auth">
            <section className="size-full glassmorphism flex-center px-6">
                <div className="sign-in-card">
                    <header className="header">
                        <Link to="/">
                            <img src="/assets/images/Rehla.png" alt="logo" className="size-[30px]" />
                        </Link>
                        <h1 className="p-28-bold text-dark-100">Rehla</h1>
                    </header>

                    <article>
                        <h2 className="p-28-semibold text-dark-100 text-center">Start Your Travel Journey</h2>
                        <p className="p-18-regular text-center text-gray-100 !leading-7">
                            Sign in with Google to manage destinations, itineraries, and user activity with ease.
                        </p>
                    </article>

                    {creatingDoc ? (
                        <p className="text-center text-gray-400 mt-6">Checking your session...</p>
                    ) : (
                        <ButtonComponent
                            type="button"
                            cssClass="button-class !h-11 !w-full flex items-center justify-center gap-2"
                            onClick={loginWithGoogle}
                        >
                            <img src="/assets/icons/google.svg" className="size-5" alt="google" />
                            <span className="p-18-semibold text-white">Sign in with Google</span>
                        </ButtonComponent>
                    )}
                </div>
            </section>
        </main>
    );
};

export default SignIn;