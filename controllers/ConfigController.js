
import Config from '../models/Config.js';

const getConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({});
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (config) {
      Object.assign(config, req.body);
      const updatedConfig = await config.save();
      res.json(updatedConfig);
    } else {
      config = await Config.create(req.body);
      res.json(config);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getConfig, updateConfig };
