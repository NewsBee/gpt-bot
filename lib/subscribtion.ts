import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      midtransOrderId: true,
      midtransTransactionId: true,
      subscriptionStatus: true,
      price: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
    },
  });

  if (!userSubscription) {
    return false;
  }

  // Menyesuaikan dengan skema database Midtrans
  const isValid =
    userSubscription.subscriptionStatus === "active" && // Menyesuaikan dengan status langganan Midtrans
    userSubscription.currentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return !!isValid;
};
