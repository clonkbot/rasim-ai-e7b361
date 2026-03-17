import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User profiles with subscription info
  profiles: defineTable({
    userId: v.id("users"),
    name: v.optional(v.string()),
    plan: v.string(), // 'free' | 'plus' | 'pro'
    cadExportsUsed: v.number(),
    cadExportsLimit: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Floor plan drafts
  drafts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    style: v.string(), // architectural style
    stories: v.number(),
    ceilingHeight: v.number(), // in meters
    totalSqm: v.number(),
    width: v.number(),
    depth: v.number(),
    exteriorImageUrl: v.optional(v.string()),
    floorplanJson: v.optional(v.string()), // JSON string of room data
    isPublic: v.boolean(),
    pinCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_public", ["isPublic", "createdAt"])
    .index("by_style", ["style"]),

  // Rooms within drafts
  rooms: defineTable({
    draftId: v.id("drafts"),
    roomType: v.string(),
    label: v.string(),
    floor: v.number(),
    widthM: v.number(),
    depthM: v.number(),
    areaSqm: v.number(),
    xPosition: v.number(),
    yPosition: v.number(),
    color: v.string(),
  }).index("by_draft", ["draftId"]),

  // User pins/favorites
  pins: defineTable({
    userId: v.id("users"),
    draftId: v.id("drafts"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_draft", ["draftId"])
    .index("by_user_draft", ["userId", "draftId"]),
});
