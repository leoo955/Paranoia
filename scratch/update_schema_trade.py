import re

with open("prisma/schema.prisma", "r", encoding="utf-8") as f:
    content = f.read()

# Add to User model
user_model_match = re.search(r"model User \{.*?(?=\nmodel )", content, re.DOTALL)
if user_model_match:
    user_model = user_model_match.group(0)
    if "sentTrades" not in user_model:
        updated_user_model = user_model.replace(
            "boxes         UserBox[]",
            "boxes         UserBox[]\n  sentTrades    Trade[] @relation(\"TradesSent\")\n  receivedTrades Trade[] @relation(\"TradesReceived\")"
        )
        content = content.replace(user_model, updated_user_model)

# Add Trade model
if "model Trade {" not in content:
    trade_model = """
model Trade {
  id              String   @id @default(cuid())
  senderId        String
  sender          User     @relation("TradesSent", fields: [senderId], references: [id])
  receiverId      String
  receiver        User     @relation("TradesReceived", fields: [receiverId], references: [id])
  
  status          String   @default("PENDING") // PENDING, ACCEPTED, REJECTED, CANCELLED
  
  senderCardIds   String[] // IDs des UserCard proposés par l'expéditeur
  receiverCardIds String[] // IDs des UserCard demandés au destinataire
  
  senderCoins     Int      @default(0) // Pièces offertes par l'expéditeur
  receiverCoins   Int      @default(0) // Pièces demandées au destinataire
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
"""
    content += trade_model

with open("prisma/schema.prisma", "w", encoding="utf-8") as f:
    f.write(content)

print("Schema updated successfully")
