const express = require("express");
const templateRouter = express.Router();
const Template = require("../../models/templateModel");

// GET all templates
templateRouter.get("/", async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET by id
templateRouter.get("/getById/:templateId", async (req, res) => {
  try {
    const { templateId } = req.params;
    const template = await Template.findById(templateId);
    res.status(200).send(template);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// POST a new template
templateRouter.post("/", async (req, res) => {
  const template = new Template({
    name: req.body.name,
    htmlContent: req.body.htmlContent,
  });

  try {
    const newTemplate = await template.save();
    res.status(201).json(newTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = templateRouter;
