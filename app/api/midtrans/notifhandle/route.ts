import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { core, midtransClient, snap } from "@/lib/snap";
import { buffer } from "micro";
import { NextApiRequest } from "next";
import prismadb from "@/lib/prismadb";

export async function POST(req: NextApiRequest) {
  const rawBody = await buffer(req);
  const notificationJson = JSON.parse(rawBody.toString());

  try {
    // Cek notifikasi kenetikan
    core.transaction
      .notification(notificationJson)
      .then(async (statusResponse: any) => {
        const orderId: string = statusResponse.order_id;
        const transactionStatus: string = statusResponse.transaction_status;
        // const orderId = statusResponse.order_id;
        // const transactionStatus = statusResponse.transaction_status;

        // Cari subscription berdasarkan order ID
        const subscription = await prismadb.userSubscription.findUnique({
          where: { midtransOrderId: orderId },
        });

        if (!subscription) {
          return NextResponse.json({
            status: 404,
            message: "Subscription not found",
          });
        }

        // Update status berlangganan jika transaksi berhasil
        if (
          transactionStatus === "settlement" ||
          transactionStatus === "capture"
        ) {
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
        NextResponse.json({ staus: 200, message: "Berhasil berlangganan" });
      });
  } catch (error) {
    NextResponse.json({
      status: 500,
      message: "message: 'Internal server error', error: error.message",
    });
  }
}
