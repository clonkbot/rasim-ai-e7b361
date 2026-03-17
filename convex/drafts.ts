import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Room catalog with Arabic labels
const ROOM_CATALOG: Record<string, { label: string; minSqm: number; defaultSqm: number; color: string }> = {
  master_bedroom: { label: "غرفة النوم الرئيسية", minSqm: 20, defaultSqm: 28, color: "#FFE4D6" },
  bedroom: { label: "غرفة نوم", minSqm: 12, defaultSqm: 16, color: "#FFE4D6" },
  master_bath: { label: "حمام رئيسي", minSqm: 8, defaultSqm: 12, color: "#E8D6FF" },
  bathroom: { label: "حمام", minSqm: 4, defaultSqm: 6, color: "#E8D6FF" },
  walk_in_closet: { label: "غرفة ملابس", minSqm: 6, defaultSqm: 10, color: "#F5E6CC" },
  majlis: { label: "مجلس", minSqm: 25, defaultSqm: 40, color: "#D6E8FF" },
  living_room: { label: "غرفة معيشة", minSqm: 20, defaultSqm: 30, color: "#D6F5E8" },
  dining_room: { label: "غرفة طعام", minSqm: 15, defaultSqm: 22, color: "#D6FFE8" },
  kitchen: { label: "مطبخ", minSqm: 12, defaultSqm: 18, color: "#FFF9D6" },
  family_room: { label: "غرفة عائلية", minSqm: 20, defaultSqm: 30, color: "#E8F5D6" },
  guest_room: { label: "غرفة ضيوف", minSqm: 12, defaultSqm: 16, color: "#FFE8D6" },
  maid_room: { label: "غرفة خادمة", minSqm: 9, defaultSqm: 12, color: "#F5F5F5" },
  driver_room: { label: "غرفة سائق", minSqm: 9, defaultSqm: 12, color: "#E8E8E8" },
  storage: { label: "مستودع", minSqm: 6, defaultSqm: 10, color: "#D6D6D6" },
  laundry: { label: "غرفة غسيل", minSqm: 6, defaultSqm: 8, color: "#D6E8F5" },
  garage: { label: "مرآب", minSqm: 18, defaultSqm: 28, color: "#E8E8E8" },
  garden: { label: "حديقة", minSqm: 30, defaultSqm: 60, color: "#C8E8C8" },
  pool: { label: "مسبح", minSqm: 20, defaultSqm: 40, color: "#C8D8F5" },
  courtyard: { label: "فناء داخلي", minSqm: 15, defaultSqm: 25, color: "#F5E8C8" },
  home_office: { label: "مكتب منزلي", minSqm: 10, defaultSqm: 15, color: "#E8D6C8" },
  prayer_room: { label: "غرفة صلاة", minSqm: 8, defaultSqm: 12, color: "#F5E8D6" },
  gym: { label: "صالة رياضية", minSqm: 15, defaultSqm: 25, color: "#D6F5F5" },
  media_room: { label: "غرفة سينما", minSqm: 20, defaultSqm: 30, color: "#2A2A3A" },
};

// Generate floor plan layout
function generateFloorPlanLayout(
  roomInputs: { roomType: string; count: number }[],
  totalSqm: number
): { rooms: Array<{ roomType: string; label: string; x: number; y: number; width: number; depth: number; area: number; floor: number; color: string }>; width: number; depth: number } {
  const rooms: Array<{ roomType: string; label: string; x: number; y: number; width: number; depth: number; area: number; floor: number; color: string }> = [];

  // Calculate building dimensions (roughly square)
  const buildingWidth = Math.sqrt(totalSqm * 1.2);
  const buildingDepth = totalSqm / buildingWidth;

  let currentX = 0;
  let currentY = 0;
  let rowHeight = 0;
  let roomIndex = 0;

  for (const input of roomInputs) {
    const catalog = ROOM_CATALOG[input.roomType];
    if (!catalog) continue;

    for (let i = 0; i < input.count; i++) {
      const area = catalog.defaultSqm;
      const aspectRatio = 0.7 + Math.random() * 0.6; // Random aspect ratio
      const roomWidth = Math.sqrt(area * aspectRatio);
      const roomDepth = area / roomWidth;

      // Check if room fits in current row
      if (currentX + roomWidth > buildingWidth && currentX > 0) {
        currentX = 0;
        currentY += rowHeight + 0.2;
        rowHeight = 0;
      }

      rooms.push({
        roomType: input.roomType,
        label: catalog.label,
        x: currentX,
        y: currentY,
        width: Math.round(roomWidth * 10) / 10,
        depth: Math.round(roomDepth * 10) / 10,
        area: Math.round(area * 10) / 10,
        floor: 1,
        color: catalog.color,
      });

      currentX += roomWidth + 0.2;
      rowHeight = Math.max(rowHeight, roomDepth);
      roomIndex++;
    }
  }

  return {
    rooms,
    width: Math.round(buildingWidth * 10) / 10,
    depth: Math.round((currentY + rowHeight) * 10) / 10,
  };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("drafts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("drafts")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .take(20);
  },
});

export const get = query({
  args: { id: v.id("drafts") },
  handler: async (ctx, args) => {
    const draft = await ctx.db.get(args.id);
    if (!draft) return null;

    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_draft", (q) => q.eq("draftId", args.id))
      .collect();

    return { ...draft, rooms };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    style: v.string(),
    stories: v.number(),
    ceilingHeight: v.number(),
    totalSqm: v.number(),
    rooms: v.array(v.object({
      roomType: v.string(),
      count: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Generate floor plan layout
    const layout = generateFloorPlanLayout(args.rooms, args.totalSqm);

    // Create draft
    const draftId = await ctx.db.insert("drafts", {
      userId,
      name: args.name,
      style: args.style,
      stories: args.stories,
      ceilingHeight: args.ceilingHeight,
      totalSqm: args.totalSqm,
      width: layout.width,
      depth: layout.depth,
      floorplanJson: JSON.stringify(layout.rooms),
      isPublic: true,
      pinCount: 0,
      createdAt: Date.now(),
    });

    // Create rooms
    for (const room of layout.rooms) {
      await ctx.db.insert("rooms", {
        draftId,
        roomType: room.roomType,
        label: room.label,
        floor: room.floor,
        widthM: room.width,
        depthM: room.depth,
        areaSqm: room.area,
        xPosition: room.x,
        yPosition: room.y,
        color: room.color,
      });
    }

    return draftId;
  },
});

export const remove = mutation({
  args: { id: v.id("drafts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const draft = await ctx.db.get(args.id);
    if (!draft || draft.userId !== userId) throw new Error("Not found");

    // Delete rooms
    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_draft", (q) => q.eq("draftId", args.id))
      .collect();

    for (const room of rooms) {
      await ctx.db.delete(room._id);
    }

    // Delete pins
    const pins = await ctx.db
      .query("pins")
      .withIndex("by_draft", (q) => q.eq("draftId", args.id))
      .collect();

    for (const pin of pins) {
      await ctx.db.delete(pin._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const togglePin = mutation({
  args: { draftId: v.id("drafts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("pins")
      .withIndex("by_user_draft", (q) => q.eq("userId", userId).eq("draftId", args.draftId))
      .first();

    const draft = await ctx.db.get(args.draftId);
    if (!draft) throw new Error("Draft not found");

    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.patch(args.draftId, { pinCount: Math.max(0, draft.pinCount - 1) });
      return false;
    } else {
      await ctx.db.insert("pins", {
        userId,
        draftId: args.draftId,
        createdAt: Date.now(),
      });
      await ctx.db.patch(args.draftId, { pinCount: draft.pinCount + 1 });
      return true;
    }
  },
});

export const getUserPins = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const pins = await ctx.db
      .query("pins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return pins.map(p => p.draftId);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allDrafts = await ctx.db.query("drafts").collect();
    return {
      totalDrafts: allDrafts.length,
      publicDrafts: allDrafts.filter(d => d.isPublic).length,
    };
  },
});
