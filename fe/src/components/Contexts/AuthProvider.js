"use client";

import PropTypes from "prop-types";
import { createClient } from "@/utils/supabase/client";
import { createContext } from "react";
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
      // console.log("Contract not initialized");
      return { status: "error", error: "Contract not initialized" };
    }
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      // console.log("error", error);
      return error;
    }

    // console.log("data", data);
    const userData = {
      uid: data.user.id,
      username: username,
      password: password,
      address: getAddressFromUserId(data.user.id).toString(),
      balance: 0,
    };
    // insert data to user table
    if (data.user) {
      const transaction = await contract.createUser(getAddressFromUserId(data.user.id), 0);
      // console.log("Transaction sent:", transaction);
      await transaction.wait();
      // console.log("Transaction hash:", transaction.hash);

      const { error } = await supabase.from("Users").insert([userData]);
      if (error) {
        // console.log("Insert error:", error.message);
      }

      // const { data: usersData } = await supabase.from("Users").select("*");
      // console.log("response", usersData);

      // let transaction2 = await contract.getAllUser();
      // await transaction2.wait();
      // console.log("Transaction2 sent:", transaction2.hash);
    }

    return { status: "success", username: username };
  };

  const topUpBalance = async (amount) => {
    const { contract, account } = await useContract();
    if (!contract) {
      // console.log("Contract not initialized");
      return { status: "error", error: "Contract not initialized" };
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return { status: "error", error: "User not authenticated" };
    }

    try {
      const userAddress = getAddressFromUserId(data.user.id);
      // console.log("User address:", userAddress);
      // console.log("Top up amount:", amount);

      // Call topUpUser function (sesuai dengan Solidity)
      const transaction = await contract.topUpUser(userAddress, amount);
      // console.log("Transaction sent:", transaction);
      await transaction.wait();
      // console.log("Transaction hash:", transaction.hash);

      // Get updated balance from contract
      const updatedUser = await contract.getUser(userAddress);
      const newBalance = updatedUser.balance.toString();
      // console.log("New balance from contract:", newBalance);
      // console.log("User", updatedUser);

      // Update balance in database dengan balance yang baru (current + amount)
      const { error: updateError } = await supabase
        .from("Users")
        .update({ balance: newBalance })
        .eq("uid", data.user.id);

      if (updateError) {
        // console.log("Database update error:", updateError.message);
        return { status: "error", error: "Failed to update balance in database" };
      }

      return {
        status: "success",
        message: "Balance topped up successfully",
        newBalance: newBalance,
        transactionHash: transaction.hash,
      };
    } catch (error) {
      // console.log("Top up error:", error);

      // Handle specific contract errors
      let errorMessage = error.message;
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message.includes("User does not exist")) {
        errorMessage = "User does not exist";
      } else if (error.message.includes("Amount must be greater than 0")) {
        errorMessage = "Amount must be greater than 0";
      }

      return { status: "error", error: errorMessage };
    }
  };

  const signIn = async (username, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    // console.log("data", data);
    // console.log("error", error);

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
    // console.log("AUTH", data);
    const { data: dataUser, error: errorUser } = await supabase
      .from("Users")
      .select("*")
      .eq("uid", data.user.id)
      .single();
    if (error) return { status: "error", error: error.message };
    if (!data.user) return { status: "error", error: "User not found" };
    // console.log("dataUser", dataUser);
    return {
      status: "success",
      userid: data.user.id,
      address: dataUser.address,
      username: data.user.email.replace("@gmail.com", ""),
      email: data.user.email,
      balance: dataUser ? dataUser.balance : 0,
    };
  };
  return (
    <AuthContext.Provider value={{ signUp, signIn, signOut, topUpBalance, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
