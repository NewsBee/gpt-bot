// Import necessary modules and types
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import prismadb from "@/lib/prismadb";
import { core } from "@/lib/snap";

const DAY_IN_MS = 86_400_000;

// Define the route handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const rawBody = await buffer(req);
    const notificationJson = JSON.parse(rawBody.toString());


    // Handling Midtrans notification
    core.transaction
      .notification(notificationJson)
      .then(async (statusResponse: any) => {
        const orderId: string = statusResponse.order_id;
        const transactionStatus: string = statusResponse.transaction_status;

        // Find subscription based on order ID
        const subscription = await prismadb.userSubscription.findUnique({
          where: { midtransOrderId: orderId },
        });

        if (!subscription) {
          return res.status(404).json({
            status: 404,
            message: "Subscription not found",
          });
        }

        // Update subscription status if the transaction is successful
        if (transactionStatus === "settlement" || transactionStatus === "capture") {
          const currentPeriodStart = new Date();
          const currentPeriodEnd = new Date(currentPeriodStart);
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

          await prismadb.userSubscription.update({
            where: { id: subscription.id },
            data: {
              subscriptionStatus: "active",
              currentPeriodStart,
              currentPeriodEnd,
              midtransTransactionId: statusResponse.transaction_id,
            },
          });
        }

        return res.status(200).json({
          status: 200,
          message: "Subscription successful",
        });
      });

  } catch (error:any) {
    return res.status(500).json({
      status: 500,
      message: `Internal server error: ${error.message}`,
    });
  }
}
