import { createClient } from "../supabase/client";
import { getAddressFromUserId, getRandomId } from "../getAddress";
import { useContract } from "../hooks/useContract";
const supabase = createClient();

export async function createCampaign(title, target, organizer, duration) {
  const campaignData = {
    campaignid: getAddressFromUserId(getRandomId()),
    title,
    target,
    organizer,
    duration,
    current: 0,
    startDate: Date.now(),
  };

  const { contract } = await useContract();
  const transaction = await contract.createCampaign(
    campaignData.campaignid,
    organizer,
    title,
    duration,
    target,
    campaignData.current,
  );
  await transaction.wait();
  const { data, error } = await supabase.from("Campaigns").insert([campaignData]).select("*");

  if (error) {
    return {
      status: "error",
      message: "Failed to create campaign",
    };
  }

  // console.log("Campaign created successfully:", data);

  return {
    status: "success",
    message: "Campaign created successfully",
    campaign: data,
  };
}
export async function getCampaign(filter = "") {
  const { contract } = await useContract();
  const campaigns = await contract.getAllCampaignsGlobal();

  // Convert ke array biasa
  const campaignsArray = [...campaigns];

  // Process setiap campaign
  const processedCampaigns = campaignsArray.map((campaign, index) => {
    return {
      id: campaign[0],
      organizer: campaign[1], // address
      title: campaign[2], // string
      deadline: campaign[3], // BigNumber
      startTime: campaign[4], // BigNumber (timestamp)
      target: campaign[5], // BigNumber
      currentAmount: campaign[6], // BigNumber
      isCompleted: campaign[7], // boolean
    };
  });

  return processedCampaigns;
}

export async function donate(donorUserId, campaignId, amount) {
  try {
    // console.log("Starting donation process...", { donorUserId, campaignId, amount });

    const { contract } = await useContract();

    // Get current nonce to avoid nonce issues
    // Call donate function on smart contract

    const transaction = await contract.donate(
      donorUserId, // address donorUserId
      campaignId, // uint campaignId
      amount, // uint amount
    );

    // Wait for transaction to be mined
    const receipt = await transaction.wait();

    // Update database - increment current amount
    const { data: currentCampaign } = await supabase
      .from("Campaigns")
      .select("*")
      .eq("campaignid", campaignId)
      .single();

    const newAmount = (currentCampaign?.current || 0) + amount;

    const { data, error } = await supabase
      .from("Campaigns")
      .update({ current: newAmount })
      .eq("campaignid", campaignId)
      .select("*");

    if (error) {
      console.error("Error updating campaign in database:", error);
      return {
        status: "error",
        message: "Donation successful on blockchain but failed to update database",
        transactionHash: receipt.transactionHash,
      };
    }

    const { data: dataUser, error: errorUser } = await supabase
      .from("Users")
      .select("*")
      .eq("address", donorUserId)
      .single();

    if (errorUser) {
      console.error("Error fetching donor user data:", error);
      return {
        status: "error",
        message: "Failed to fetch donor user data",
      };
    }

    const newBalance = (dataUser?.balance || 0) - amount;
    await supabase.from("Users").update({ balance: newBalance }).eq("address", donorUserId);

    return {
      status: "success",
      message: "Donation successful!",
      transactionHash: receipt.transactionHash,
      campaign: data,
      gasUsed: receipt.gasUsed.toString(),
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    // Handle specific error messages
    let errorMessage = "Donation failed";

    if (error.message.includes("Donor user does not exist")) {
      errorMessage = "User tidak ditemukan";
    } else if (error.message.includes("Campaign does not exist")) {
      errorMessage = "Campaign tidak ditemukan";
    } else if (error.message.includes("Amount must be greater than 0")) {
      errorMessage = "Jumlah donasi harus lebih dari 0";
    } else if (error.message.includes("Insufficient balance")) {
      errorMessage = "Saldo tidak mencukupi";
    } else if (error.message.includes("Campaign already finished")) {
      errorMessage = "Campaign sudah berakhir";
    } else if (error.message.includes("must be made by the user themselves")) {
      errorMessage = "Donasi hanya bisa dilakukan oleh user sendiri";
    }

    return {
      status: "error",
      message: errorMessage,
      error: error.message,
    };
  }
}

export async function withdraw(campaignId, userId, amount) {
  try {
    const { contract } = await useContract();

    // Call withDrawFromCampaign function on smart contract
    const transaction = await contract.withDrawFromCampaign(
      campaignId, // address campaignId
      userId, // address userId
      amount, // int256 amount
    );

    // Wait for transaction to be mined
    const receipt = await transaction.wait();

    // Update database - decrease campaign current amount
    const { data: currentCampaign } = await supabase
      .from("Campaigns")
      .select("*")
      .eq("campaignid", campaignId)
      .single();

    const newCampaignAmount = Math.max(0, (currentCampaign?.current || 0) - amount);

    const { data: campaignData, error: campaignError } = await supabase
      .from("Campaigns")
      .update({ current: newCampaignAmount })
      .eq("campaignid", campaignId)
      .select("*");

    if (campaignError) {
      console.error("Error updating campaign in database:", campaignError);
      return {
        status: "error",
        message: "Withdrawal successful on blockchain but failed to update campaign database",
        transactionHash: receipt.transactionHash,
      };
    }

    // Update user balance in database - ADD amount to user balance
    const { data: userData, error: userFetchError } = await supabase
      .from("Users")
      .select("*")
      .eq("address", userId)
      .single();

    if (userFetchError) {
      console.error("Error fetching user data:", userFetchError);
      return {
        status: "error",
        message: "Failed to fetch user data for balance update",
        transactionHash: receipt.transactionHash,
      };
    }

    // Add withdrawn amount to user balance
    const newUserBalance = (userData?.balance || 0) + amount;

    const { data: updatedUserData, error: balanceError } = await supabase
      .from("Users")
      .update({ balance: newUserBalance })
      .eq("address", userId)
      .select("*");

    if (balanceError) {
      console.error("Error updating user balance:", balanceError);
      return {
        status: "error",
        message: "Withdrawal successful but failed to update user balance in database",
        transactionHash: receipt.transactionHash,
      };
    }

    return {
      status: "success",
      message: "Withdrawal successful!",
      transactionHash: receipt.transactionHash,
      campaign: campaignData,
      user: updatedUserData,
      gasUsed: receipt.gasUsed.toString(),
      blockNumber: receipt.blockNumber,
      withdrawnAmount: amount,
      newUserBalance: newUserBalance,
      newCampaignAmount: newCampaignAmount,
    };
  } catch (error) {
    // Handle specific error messages
    let errorMessage = "Withdrawal failed";

    if (error.message.includes("Campaign does not exist")) {
      errorMessage = "Campaign tidak ditemukan";
    } else if (error.message.includes("Campaign not finished")) {
      errorMessage = "Campaign belum selesai";
    } else if (error.message.includes("Invalid withdrawal amount")) {
      errorMessage = "Jumlah withdrawal tidak valid";
    } else if (error.message.includes("not enough funds raised")) {
      errorMessage = "Dana yang terkumpul tidak mencukupi";
    } else if (error.message.includes("User does not exist")) {
      errorMessage = "User tidak ditemukan";
    } else if (error.message.includes("Amount must be greater than 0")) {
      errorMessage = "Jumlah withdrawal harus lebih dari 0";
    } else if (error.code === "INSUFFICIENT_FUNDS") {
      errorMessage = "Gas fee tidak mencukupi";
    } else if (error.code === "USER_REJECTED") {
      errorMessage = "Transaksi dibatalkan oleh user";
    }

    return {
      status: "error",
      message: errorMessage,
      error: error.message,
    };
  }
}
