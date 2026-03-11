
import Lead from '../models/Lead.js';

const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (lead) {
      if (typeof req.body.status !== 'undefined') {
        lead.status = req.body.status;
      }
      if (Object.prototype.hasOwnProperty.call(req.body, 'remarks')) {
        lead.remarks = req.body.remarks;
      }
      if (typeof req.body.priority !== 'undefined') {
        lead.priority = req.body.priority;
      }
      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { createLead, getLeads, updateLead };
