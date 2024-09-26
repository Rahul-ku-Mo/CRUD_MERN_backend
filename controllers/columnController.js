const prisma = require("../db");

exports.createColumn = async (req, res) => {
  const { name, userId } = req.body;

  try {
    const column = await prisma.column.create({
      data: {
        name: name,
        user: {
          connect: userId,
        },
      },
    });

    res.status(201).json(column);
  } catch (error) {
    res.status(500).json(error);
  }
};
