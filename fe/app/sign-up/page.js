"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/components/Contexts/AuthProvider";
import { prettyJson } from "@/utils/helpers/prettyJson";
import { UserRoundPen, User, Lock, BadgeCheck } from "lucide-react";
import { InputWrapper, ButtonSubmit, Loading, Container } from "@/components/Elements";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [error, setError] = useState(null);

  const { signUp } = useContext(AuthContext);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const handleSubmit = useCallback(async () => {
    const username = usernameRef.current?.value?.trim();
    const email = username + "@gmail.com"; // Assuming email is derived from username
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    // Name validation
    if (username.length > 50) {
      setError("Name cannot be more than 50 characters");
      return;
    }

    // Email validation
    if (!email) {
      setError("Email is required");
      return;
    }
    if (email.includes(" ")) {
      setError("Email cannot contain spaces");
      return;
    }
    if (!email.includes("@")) {
      setError("Invalid email format");
      return;
    }
    if (email.length > 50) {
      setError("Email cannot be more than 50 characters");
      return;
    }

    // Password validation
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length > 30) {
      setError("Password cannot be more than 30 characters");
      return;
    }

    // Confirm password validation
    if (!confirmPassword) {
      setError("Confirm Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // If all validations pass, call signUp
    const signUpData = await signUp(username, email, password);
    if (signUpData.status === "error") {
      setError(prettyJson(signUpData.error));
      return;
    }
    setError(null);
    router.refresh();
    router.push("/sign-in");
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []);
  if (loading)
    return <Loading className={"fixed h-screen w-screen bg-[url('/bg-comp.webp')] bg-cover"} />;

  return (
    <>
      <main className="relative h-screen w-full bg-[url('/bg-comp.webp')] bg-cover">
        <div className="relative flex h-full w-full items-center justify-center">
          <Container className="relative flex w-[90%] flex-col items-center justify-center gap-3 rounded-xl border-2 border-[#EFF4FE] bg-white/30 px-[3%] py-20 text-[#213356] md:w-md lg:w-xl xl:w-2xl">
            <h2 className="font-eudoxus-bold text-4xl text-[#213356] sm:text-5xl lg:text-6xl">
              Register
            </h2>
            <div className="mt-6 flex w-full flex-col gap-4">
              <InputWrapper ref={usernameRef} icon={UserRoundPen} placeholder="Username" />
              <InputWrapper ref={passwordRef} type="password" icon={Lock} placeholder="Password" />
              <InputWrapper
                ref={confirmPasswordRef}
                type="password"
                icon={BadgeCheck}
                placeholder="Confirm Password"
              />
              {error && (
                <p className="font-eudoxus-medium text-center text-sm text-[#FF0000] lg:text-xl">
                  {error}
                </p>
              )}
              <ButtonSubmit onClick={handleSubmit}>Create Account</ButtonSubmit>
            </div>
            <p className="font-eudoxus-bold text-sm text-white lg:mt-3 lg:text-xl">
              Already have an account?{" "}
              <span className="text-[#213356] duration-500 hover:text-[#F5C45E]">
                <Link href="/sign-in">Sign In</Link>
              </span>
            </p>
          </Container>
        </div>
      </main>
    </>
  );
}
