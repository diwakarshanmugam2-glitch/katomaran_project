const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nexus_ai').then(async () => {
  const db = mongoose.connection.db;
  const col = db.collection('urls');
  
  // Remove null customAlias fields so sparse index works
  const r = await col.updateMany(
    { customAlias: null },
    { $unset: { customAlias: '' } }
  );
  console.log('Cleaned null aliases:', r.modifiedCount);
  
  // Verify indexes
  const indexes = await col.indexes();
  console.log('Current indexes:', JSON.stringify(indexes, null, 2));
  
  await mongoose.disconnect();
  console.log('Done!');
});
