const getCategoryForItem = require("../services/genAiService");

exports.getCategory = async (req, res) => {
  const { description } = req.body;

  try {
    const category = await getCategoryForItem(description);

    res.status(200).json({ category });
  } catch (error) {
    console.log(error.message);
  }
};
