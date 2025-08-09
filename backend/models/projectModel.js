const moongose = require("mongoose");

const projectSchema = new moongose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    started_at: {
      type: Date,
      default: Date.now,
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    status: {
      type: String,
      enum: [
        "notStarted",
        "inProgress",
        "onHold",
        "stuck",
        "completed",
        "cancelled",
      ],
      default: "notStarted",
    },
    percentageCompleted: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    userId: {
      type: moongose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    tasks: [
      {
        type: moongose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const projectModel = moongose.model("Project", projectSchema);
module.exports = projectModel;
