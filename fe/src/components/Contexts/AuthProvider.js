"use client";

import PropTypes from "prop-types";
import { createClient } from "@/utils/supabase/client";
import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useContract } from "@/utils/hooks/useContract";
import { getAddressFromUserId } from "@/utils/getAddress";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const supabase = createClient();

  // create a new user
  const signUp = async (username, email, password) => {
    const { contract, account } = await useContract();
    if (!contract) {
      console.log("Contract not initialized");
      return { status: "error", error: "Contract not initialized" };
    }
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log("error", error);
      return error;
    }

    console.log("data", data);
    const userData = {
      uid: data.user.id,
      username: username,
      password: password,
      balance: 0,
    };
    // insert data to user table
    if (data.user) {
      const { error } = await supabase.from("Users").insert([userData]);
      if (error) {
        console.log("Insert error:", error.message);
      }

      const { data: usersData } = await supabase.from("Users").select("*");
      console.log("response", usersData);
      const transaction = await contract.createUser(getAddressFromUserId(data.user.id), 0);
      console.log("Transaction sent:", transaction);
      await transaction.wait();
      console.log("Transaction hash:", transaction.hash);

      let transaction2 = await contract.getAllUser();
      await transaction2.wait();
      console.log("Transaction2 sent:", transaction2.hash);
    }

    return { status: "success", username: username };
  };

  const signIn = async (username, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    console.log("data", data);
    console.log("error", error);

    if (error) return { status: "error", error: error.message };
    const dataUser = {
      status: "success",
      userid: data.user.id,
      username: username,
    };

    Cookies.set("access_token", JSON.stringify(dataUser), {
      expires: 1,
      path: "/",
      secure: true,
      sameSite: "Strict",
    });

    return {
      status: "success",
      userid: data.user.id,
      username: username,
    };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return { status: "error", error: error.message };
    Cookies.remove("access_token");
    return { status: "success" };
  };

  const getCurrentUser = async () => {
    if (!Cookies.get("access_token")) {
      return { status: "error", error: "User not found" };
    }
    const { data, error } = await supabase.auth.getUser();
    const { data: dataUser, error: errorUser } = await supabase
      .from("users")
      .select("*")
      .eq("userid", data.user.id)
      .single();
    if (error) return { status: "error", error: error.message };
    if (!data.user) return { status: "error", error: "User not found" };
    return {
      status: "success",
      userid: data.user.id,
      username: data.user.email.replace("@gmail.com", ""),
      email: data.user.email,
      balance: dataUser ? dataUser.balance : 0,
    };
  };
  return (
    <AuthContext.Provider value={{ signUp, signIn, signOut, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
