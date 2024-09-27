const prisma = require("../db");

exports.updateTaskInColumns = async (req, res) => {
  const { destinationColumnId, destinationTasks, sourceColumnId, sourceTasks } =
    req.body;

  try {
    await prisma.$transaction(async (prisma) => {
      const updatedDestinationColumn = await prisma.columns.update({
        where: {
          id: destinationColumnId,
        },
        data: {
          tasks: {
            set: destinationTasks.map((task) => ({ id: task.id })),
          },
        },
      });

      const updatedSourceColumn = await prisma.columns.update({
        where: {
          id: sourceColumnId,
        },
        data: {
          tasks: {
            set: sourceTasks.map((task) => ({ id: task.id })),
          },
        },
      });

      return { updatedDestinationColumn, updatedSourceColumn };
    });

    res.status(200).json({ message: "Columns updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getColumns = async (req, res) => {
  const { userId } = req.body;

  try {
    const columns = await prisma.columns.findMany({
      where: {
        userId: userId,
      },
      include: {
        tasks: true,
      },
    });

    res.status(200).json(columns);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.createColumn = async (req, res) => {
  const { name, userId } = req.body;

  try {
    const lastColumn = await prisma.columns.findFirst({
      where: { userId: userId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastColumn ? lastColumn.order + 1 : 1;

    const column = await prisma.columns.create({
      data: {
        name: name,
        userId: userId,
        order: newOrder,
      },
    });

    res.status(201).json(column);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editColumn = async (req, res) => {
  const { id } = req.params;
  const { name, order } = req.body;

  try {
    const updatedColumn = await prisma.columns.update({
      where: { id: id },
      data: { name, order },
    });

    res.status(200).json(updatedColumn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteColumn = async (req, res) => {
  const { id } = req.params;

  try {
    const columnExists = await prisma.columns.findUnique({
      where: { id: id },
    });
    if (!columnExists) {
      return res.status(404).json({ error: "Column not found" });
    }

    const deletedColumn = await prisma.columns.delete({
      where: { id: id },
    });

    res.status(204).json({ message: "Column deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
