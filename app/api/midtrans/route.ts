import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { snap } from "@/lib/snap";
import prismadb from "@/lib/prismadb";


export async function POST(req: Request) {
  

  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Membuat ID pesanan yang unik
    // const orderId = uuidv4();
    const orderId = `sub-${userId}-${Date.now()}`

    const { first_name, email, total } = body;
    if(total!=10000){
      return new NextResponse("Total amount should be 10000", { status: 400 });
    }
    const customerDetails = {
      first_name: first_name || "Unknown",
      email: email || "Unknown",
    };

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total,
      },
      customer_details: customerDetails,
    };

    const transaction = await snap.createTransaction(parameter);

    const dataPayment = {
      response: JSON.stringify(transaction),
    };

    let transactionToken = transaction.token;
    // console.log("transactionToken:", transactionToken);

    let transactionRedirectUrl = transaction.redirect_url;
    // console.log("transactionRedirectUrl:", transactionRedirectUrl);
    
    await prismadb.userSubscription.create({
      data: {
        userId: userId,
        midtransOrderId: orderId,
        price: 10000,
        // Setel nilai awal untuk periode berlangganan dan status
      }
    });

    return NextResponse.json({
      status: 200,
      dataPayment: dataPayment,
      token: transactionToken,
    });
  } catch (error) {
    console.log("Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
