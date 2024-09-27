const prisma = require("../db");

exports.createTask = async (req, res) => {
  const { title, description, columnId, userId } = req.body;

  try {
    const lastTask = await prisma.tasks.findFirst({
      where: { columnId: columnId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastTask ? lastTask.order + 1 : 1;

    const task = await prisma.tasks.create({
      data: {
        title,
        description,

        column: {
          connect: { id: columnId },
        },
        User: {
          connect: { id: userId },
        },
        order: newOrder,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Failed to create task" });
  }
};

exports.editTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, columnId, order, dueDate, reminder } = req.body;
  try {
    const task = await prisma.tasks.update({
      where: { id },
      data: {
        title,
        description,
        order,
        dueDate,
        reminder,
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
    await prisma.tasks.delete({
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
    const tasks = await prisma.tasks.findMany();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(400).json({ error: "Failed to get tasks" });
  }
};
