const { Schema, model } = require('mongoose');

const RefresherSchema = new Schema({
  refresher: String,
});

const Refresher = model('Refresher', RefresherSchema);

module.exports = Refresher;
