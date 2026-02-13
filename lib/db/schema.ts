import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  verificationCode: text("verification_code").notNull(),
  unsubscribeCode: text("unsubscribe_code").notNull(),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at"),
});

export * from "../auth/auth-schema";
