import entryModel from "../models/Entry.js";

export const getEntries = async (req, res) => {
  try {
    const entries = await entryModel.find({ userId: req.user.userId }).sort({
      date: -1,
      createdAt: -1,
    });
    if (!entries || entries.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No entries found" });
    }
    return res.status(200).json({
      success: true,
      message: "Entries retrieved successfully",
      data: entries,
    });
  } catch (error) {
    console.error("Get entries error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createEntry = async (req, res) => {
  try {
    const { title, content, mood, category, date } = req.body;
    if (!title || !content || !date) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and date are required",
      });
    }
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const entry = await entryModel.create({
      title,
      content,
      mood,
      category,
      date,
      userId: req.user.userId,
      wordCount,
    });
    res.status(201).json({
      success: true,
      message: "Entry created successfully",
      data: entry,
    });
  } catch (error) {
    console.error("Create entry error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, mood, category, date } = req.body;
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const entry = await entryModel.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      {
        title,
        content,
        mood,
        category,
        date,
        wordCount,
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Entry updated successfully",
      data: entry,
    });
  } catch (error) {
    console.error("Update entry error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await entryModel.deleteOne({
      _id: id,
      userId: req.user.userId,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }

    return res.status(204).json({
      success: true,
      message: "Entry deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Delete entry error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const searchEntries = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const entries = await entryModel
      .find({
        userId: req.user.userId,
        $or: [
          { title: { $regex: q, $options: "i" } },
          { content: { $regex: q, $options: "i" } },
        ],
      })
      .sort({ date: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Entries found",
      data: entries,
    });
  } catch (error) {
    console.error("Search entries error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
