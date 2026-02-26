import mongoose from "mongoose";
import ChatLead from "../models/ChatLead.js";

/* ======================================
   GET CUSTOMERS (FROM ChatLead)
====================================== */
export const getAdminCustomers = async (req, res) => {
  try {
    const { userId } = req.params;

    const chatsCollection = mongoose.connection.collection("chats");
    const chatLeadsCollection = mongoose.connection.collection("chatleads");

    // 1️⃣ Get unique leads from chats
    const chats = await chatsCollection.find({ userId }).toArray();

    const uniqueLeadIds = [...new Set(chats.map(c => c.leadId))];

    // 2️⃣ Get chatleads document
    const chatLeadsDoc = await chatLeadsCollection.findOne({
      userId: new mongoose.Types.ObjectId(userId)
    });

    const leadsArray = chatLeadsDoc?.leads || [];

    // 3️⃣ Merge data
    const customers = uniqueLeadIds.map(leadId => {
      const leadInfo = leadsArray.find(
        l => l._id.toString() === leadId.toString()
      );

      const chat = chats.find(c => c.leadId === leadId);

      return {
        leadId,
        name: leadInfo?.name || "Anonymous",
        email: leadInfo?.email || "",
        lastMessageAt: chat?.updated_at || chat?.created_at
      };
    });

    res.json(customers);

  } catch (err) {
    console.error("❌ Admin customers error", err);
    res.status(500).json({ error: "Failed to load customers" });
  }
};


/* ======================================
   GET CHAT (DIRECT FROM MONGO COLLECTION)
====================================== */
export const getAdminChat = async (req, res) => {
  try {
    let { userId, leadId } = req.query;

    const chatsCollection = mongoose.connection.collection("chats");

    userId = userId?.toString().trim();
    leadId = decodeURIComponent(leadId?.toString().trim());

    console.log("🔎 Searching Chat For:");
    console.log("userId:", userId);
    console.log("leadId:", leadId);

    // 🔥 FIRST get all chats of user
    const allUserChats = await chatsCollection.find({ userId }).toArray();

    console.log("User Chats Found:", allUserChats.length);

    // 👇👇 ADD THIS LINE HERE
    console.log("All chats:", allUserChats);

    // 🔥 THEN manually match leadId
    const chatDoc = allUserChats.find(
      c => c.leadId?.toString().trim() === leadId
    );

    if (!chatDoc) {
      console.log("❌ Chat not found for this lead");
      return res.json({ messages: [] });
    }

    console.log("✅ Chat Found!");

    res.json({
      messages: chatDoc.messages || []
    });

  } catch (err) {
    console.error("❌ Admin chat error", err);
    res.status(500).json({ error: "Failed to load chat" });
  }
};


/* ======================================
   DASHBOARD COUNTS (ONLY COUNT)
====================================== */
export const getDashboardCounts = async (req, res) => {
  try {
    const { userId } = req.query;

    const chatsCollection = mongoose.connection.collection("chats");

    // ALL chats
    const totalChats = await chatsCollection.countDocuments({ userId });

    // TODAY chats
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayChats = await chatsCollection.countDocuments({
      userId,
      created_at: { $gte: startOfToday }
    });

    res.json({
      visitors: totalChats,
      chats: totalChats,
      todayChats,
      totalChats
    });

  } catch (err) {
    console.error("❌ Dashboard count error", err);
    res.status(500).json({ error: "Failed to load dashboard counts" });
  }
};


/* ======================================
   FILTERED CUSTOMERS BY DATE
====================================== */
export const getFilteredCustomers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { range } = req.query;

    const chatsCollection = mongoose.connection.collection("chats");
    const chatLeadsCollection = mongoose.connection.collection("chatleads");

    let filter = { userId };
    const now = new Date();

    if (range === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      filter.created_at = { $gte: start };
    }

    if (range === "7days") {
      filter.created_at = {
        $gte: new Date(now - 7 * 24 * 60 * 60 * 1000),
      };
    }

    if (range === "30days") {
      filter.created_at = {
        $gte: new Date(now - 30 * 24 * 60 * 60 * 1000),
      };
    }

    // 1️⃣ get filtered chats
    const chats = await chatsCollection.find(filter).toArray();

    if (!chats.length) return res.json([]);

    // 2️⃣ unique lead ids
    const uniqueLeadIds = [...new Set(chats.map(c => c.leadId))];

    // 3️⃣ get chatleads doc
    const chatLeadsDoc = await chatLeadsCollection.findOne({
      userId: new mongoose.Types.ObjectId(userId)
    });

    const leadsArray = chatLeadsDoc?.leads || [];

    // 4️⃣ merge data
    const customers = uniqueLeadIds.map(leadId => {

      const leadInfo = leadsArray.find(
        l => l._id.toString() === leadId.toString()
      );

      const chat = chats.find(c => c.leadId === leadId);

      return {
        leadId,
        name: leadInfo?.name || "Anonymous",
        email: leadInfo?.email || "",
        lastMessageAt: chat?.updated_at || chat?.created_at
      };
    });

    res.json(customers);

  } catch (err) {
    console.error("❌ Filter customers error", err);
    res.status(500).json({ error: "Failed to filter customers" });
  }
};


/* ======================================
   DASHBOARD STATS
====================================== */
export const getDashboardStats = async (req, res) => {
  try {
    const { range } = req.query;
    const chatsCollection = mongoose.connection.collection("chats");

    let filter = {};
    const now = new Date();

    if (range === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      filter.created_at = { $gte: start };
    }

    if (range === "7days") {
      filter.created_at = {
        $gte: new Date(now - 7 * 24 * 60 * 60 * 1000),
      };
    }

    if (range === "30days") {
      filter.created_at = {
        $gte: new Date(now - 30 * 24 * 60 * 60 * 1000),
      };
    }

    const chats = await chatsCollection.find(filter).toArray();

    const totalChats = chats.length;
    const totalUsers = new Set(chats.map(c => c.userId)).size;

    let totalTokens = 0;
    chats.forEach(c => {
      totalTokens += c.total_tokens || 0;
    });

    res.json({
      totalUsers,
      totalChats,
      totalTokens
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
};


/* ======================================
   USERS LIST
====================================== */
export const getAllUsers = async (req, res) => {
  try {
    const { filter } = req.query;
    const chatsCollection = mongoose.connection.collection("chats");

    let dateFilter = {};
    const now = new Date();

    if (filter === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      dateFilter.created_at = { $gte: start };
    }

    if (filter === "7days") {
      dateFilter.created_at = {
        $gte: new Date(now - 7 * 24 * 60 * 60 * 1000),
      };
    }

    if (filter === "30days") {
      dateFilter.created_at = {
        $gte: new Date(now - 30 * 24 * 60 * 60 * 1000),
      };
    }

    const users = await chatsCollection.aggregate([
      { $match: dateFilter },

      {
        $group: {
          _id: "$userId",
          chatCount: { $sum: 1 },
          totalTokens: { $sum: "$total_tokens" }
        }
      },

      // 👇 convert string to ObjectId
      {
        $addFields: {
          userObjectId: { $toObjectId: "$_id" }
        }
      },

      {
        $lookup: {
          from: "userdatas",
          localField: "userObjectId",
          foreignField: "_id",
          as: "userInfo"
        }
      },

      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $project: {
          _id: 1,
          chatCount: 1,
          totalTokens: 1,
          name: "$userInfo.name",
          email: "$userInfo.email"
        }
      }

    ]).toArray();

    res.json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


/* ======================================
   DELETE USER
====================================== */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const objectId = new mongoose.Types.ObjectId(id);

    const chatsCollection = mongoose.connection.collection("chats");
    const chatLeadsCollection = mongoose.connection.collection("chatleads");
    const userDatasCollection = mongoose.connection.collection("userdatas");
    const chatbotSettingsCollection = mongoose.connection.collection("chatbotsettings");

    // 🔥 Delete from all collections
    await Promise.all([
      chatsCollection.deleteMany({ userId: id }),                // chats (string userId)
      chatLeadsCollection.deleteMany({ userId: objectId }),      // chatleads (ObjectId userId)
      chatbotSettingsCollection.deleteMany({ userId: id }),      // chatbotsettings (string userId)
      userDatasCollection.deleteOne({ _id: objectId })           // userdatas (_id ObjectId)
    ]);

    res.json({ success: true });

  } catch (err) {
    console.error("❌ Delete user full cleanup error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
};


/* ======================================
   USER LEAD ANALYTICS
====================================== */
export const getUserLeadsAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const { range } = req.query;

    const chatsCollection = mongoose.connection.collection("chats");
    const chatLeadsCollection = mongoose.connection.collection("chatleads");

    let filter = { userId };
    const now = new Date();

    if (range === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      filter.created_at = { $gte: start };
    }

    if (range === "7days") {
      filter.created_at = {
        $gte: new Date(now - 7 * 24 * 60 * 60 * 1000),
      };
    }

    if (range === "30days") {
      filter.created_at = {
        $gte: new Date(now - 30 * 24 * 60 * 60 * 1000),
      };
    }

    // 1️⃣ First group from chats
    const leadsStats = await chatsCollection.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$leadId",
          totalChats: { $sum: 1 },
          totalTokens: { $sum: "$total_tokens" }
        }
      }
    ]).toArray();

    // 2️⃣ Get chatleads doc for this user
    const chatLeadsDoc = await chatLeadsCollection.findOne({
      userId: new mongoose.Types.ObjectId(userId)
    });

    const leadsArray = chatLeadsDoc?.leads || [];

    // 3️⃣ Merge name/email manually
    const finalData = leadsStats.map(stat => {
      const leadInfo = leadsArray.find(
        l => l._id.toString() === stat._id.toString()
      );

      return {
        _id: stat._id,
        name: leadInfo?.name || "N/A",
        email: leadInfo?.email || "N/A",
        totalChats: stat.totalChats,
        totalTokens: stat.totalTokens
      };
    });

    res.json(finalData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
};

/* ======================================
   CHAT ANALYTICS PAGE
====================================== */
export const getChatAnalytics = async (req, res) => {
  try {
    const { filter } = req.query;
    const chatsCollection = mongoose.connection.collection("chats");

    let dateFilter = {};
    const now = new Date();

    if (filter === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      dateFilter.created_at = { $gte: start };
    }

    if (filter === "7days") {
      dateFilter.created_at = {
        $gte: new Date(now - 7 * 24 * 60 * 60 * 1000),
      };
    }

    if (filter === "30days") {
      dateFilter.created_at = {
        $gte: new Date(now - 30 * 24 * 60 * 60 * 1000),
      };
    }

    const chats = await chatsCollection.find(dateFilter).toArray();

    let totalTokens = 0;
    chats.forEach(c => {
      totalTokens += c.total_tokens || 0;
    });

    res.json({
      totalChats: chats.length,
      totalTokens
    });

  } catch (err) {
    res.status(500).json({ error: "Failed analytics" });
  }
};