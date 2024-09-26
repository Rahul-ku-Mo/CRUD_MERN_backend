const prisma = require("../db");

exports.createTask = async (req, res) => {
  const { title, description, columnId, userId } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        column: {
          connect: { id: columnId },
        },
        createdBy: {
          connect: { id: userId },
        },
      },
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: "Failed to create task" });
  }
};

exports.editTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, columnId } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        column: {
          connect: { id: columnId },
        },
      },
    });
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: "Failed to edit task" });
  }
};
// Delete Task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Failed to delete task" });
  }
};

// Get Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(400).json({ error: "Failed to get tasks" });
  }
};
