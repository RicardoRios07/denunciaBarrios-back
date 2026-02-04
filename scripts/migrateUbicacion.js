const mongoose = require('mongoose');
const Denuncia = require('../src/Models/denuncia');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/barrios';

async function migrate() {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to', MONGO_URI);

    const cursor = Denuncia.find({}).cursor();
    let updated = 0;
    let skipped = 0;

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        try {
            const ubic = doc.ubicacion;
            // If already GeoJSON-like, skip
            if (ubic && typeof ubic === 'object' && Array.isArray(ubic.coordinates)) {
                skipped++;
                continue;
            }

            // Try parse when string
            let parsed = ubic;
            if (typeof ubic === 'string') {
                try {
                    parsed = JSON.parse(ubic);
                } catch (e) {
                    console.warn(`Skipping _id=${doc._id} - ubicacion string not JSON`);
                    skipped++;
                    continue;
                }
            }

            let lat, lng;
            if (parsed && parsed.type && Array.isArray(parsed.coordinates)) {
                lng = parsed.coordinates[0];
                lat = parsed.coordinates[1];
            } else {
                lat = parsed.lat ?? parsed.latitude;
                lng = parsed.lng ?? parsed.lon ?? parsed.longitude;
            }

            if (lat === undefined || lng === undefined || isNaN(Number(lat)) || isNaN(Number(lng))) {
                console.warn(`Skipping _id=${doc._id} - no valid lat/lng`);
                skipped++;
                continue;
            }

            doc.ubicacion = { type: 'Point', coordinates: [Number(lng), Number(lat)] };
            await doc.save();
            updated++;
        } catch (err) {
            console.error('Error processing doc', doc._id, err.message);
        }
    }

    console.log(`Migration finished. Updated: ${updated}, Skipped: ${skipped}`);
    await mongoose.disconnect();
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
