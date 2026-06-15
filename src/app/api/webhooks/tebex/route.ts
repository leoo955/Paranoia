import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

// Clé secrète Tebex (à définir dans le .env: TEBEX_WEBHOOK_SECRET)
const TEBEX_SECRET = process.env.TEBEX_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    
    // 1. Vérification de la signature Tebex (fortement recommandé)
    // Tebex envoie un header X-Signature qui est le SHA256 HMAC du body avec la clé secrète.
    const signature = req.headers.get("x-signature");
    
    if (TEBEX_SECRET && signature) {
      const hash = crypto.createHmac("sha256", TEBEX_SECRET).update(bodyText).digest("hex");
      if (hash !== signature) {
        console.error("[Tebex Webhook] Signature invalide.");
        return new NextResponse("Invalid signature", { status: 403 });
      }
    }

    const data = JSON.parse(bodyText);

    // Tebex Webhooks for payments usually send an event type.
    // We only care about successful payments.
    // Note: The structure depends on the exact Tebex webhook version.
    // This is a generic handling for standard Tebex Webhooks.
    
    // Handle the generic structure where data.subject contains the payment info
    const payment = data.subject || data.payment || data;
    const customer = data.customer || payment.customer;
    
    if (!customer || !customer.username) {
      return new NextResponse("No customer username found", { status: 400 });
    }

    const minecraftName = customer.username;
    
    // Check if payment is complete
    const status = payment.status?.id || payment.status || "Complete";
    const isComplete = typeof status === 'string' ? status.toLowerCase() === "complete" : status === 1;

    if (!isComplete) {
      return new NextResponse("Payment not complete, ignoring", { status: 200 });
    }

    // Find the user by minecraftName (case-insensitive)
    const user = await prisma.user.findFirst({
      where: {
        minecraftName: {
          equals: minecraftName
        }
      }
    });

    if (!user) {
      console.error(`[Tebex Webhook] Joueur introuvable: ${minecraftName}`);
      return new NextResponse("User not found", { status: 404 });
    }

    let totalParaCoinsToAdd = 0;
    const packages = payment.packages || data.packages || [];

    for (const pkg of packages) {
      const name = pkg.name || "";
      // Logique simple : on cherche si le nom du package contient "ParaCoins" ou "PC"
      // et on extrait le nombre.
      // Ex: "Pack 500 ParaCoins" -> 500
      const match = name.match(/(\d+)\s*(ParaCoins?|PC|Coins?)/i);
      
      if (match && match[1]) {
        totalParaCoinsToAdd += parseInt(match[1], 10);
      }
    }

    if (totalParaCoinsToAdd > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          paraCoins: {
            increment: totalParaCoinsToAdd
          }
        }
      });
      console.log(`[Tebex Webhook] Ajout de ${totalParaCoinsToAdd} ParaCoins à ${minecraftName}`);
    } else {
      console.log(`[Tebex Webhook] Aucun ParaCoin détecté dans la commande de ${minecraftName}`);
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("[Tebex Webhook Error]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
