const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const fs = require('fs');

const defaultData = {
  users: [],
  instances: {
    "default": {
      name: "Nail Scheduler Default",
      admins: [{ username: 'admin', password: '$2b$10$gp0WKgcGHzz2i9a9gkxdMuSXQWD.i73e/KP4hXmqyrJPaEpFvRIci' }],
      coupons: [
        { code: 'SAVE10', discount: 10, usesLeft: 10, expiresAt: '2025-12-31' }
      ],
      appointments: [],
      availability: {
        "2025-10-20": { "isAvailable": true, "availableSlots": { "10:00": true, "11:00": true, "14:00": true } },
        "2025-10-21": { "isAvailable": true, "availableSlots": { "10:00": true, "11:00": true, "14:00": true, "15:00": true } },
        "2025-10-22": { "isAvailable": true, "availableSlots": { "09:00": true, "10:00": true } }
      },
      categories: [
        { id: 'basic', name: 'Basic Services' },
        { id: 'premium', name: 'Premium Services' },
        { id: 'special', name: 'Special Treatments' }
      ],
      services: [
        {
          id: 1,
          name: "Classic Manicure",
          icon: "FaHandSparkles",
          description: "Traditional nail care service including shaping, cuticle care, and polish",
          price: "$30",
          duration: "45 min",
          category: "basic",
          isPopular: true,
          features: [
            "Nail shaping",
            "Cuticle care",
            "Hand massage",
            "Polish application",
            "Hot towel treatment",
            "Moisturizing treatment"
          ]
        },
        {
          id: 2,
          name: "Luxury Pedicure",
          icon: "FaSpa",
          description: "Comprehensive foot care with extended massage and premium products",
          price: "$50",
          duration: "60 min",
          category: "premium",
          isPopular: true,
          features: [
            "Foot soak",
            "Callus removal",
            "Extended massage",
            "Premium polish"
          ]
        },
        {
          id: 3,
          name: "Gel Extensions",
          icon: "FaPaintBrush",
          description: "Full set of gel nail extensions with your choice of design",
          price: "$75",
          duration: "90 min",
          category: "special",
          isPopular: true,
          features: [
            "Custom length",
            "Nail art options",
            "Long-lasting wear",
            "Damage-free application"
          ]
        }
      ]
    }
  }
};

const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);

const initDb = async () => {
    const dbExists = fs.existsSync('db.json');

    try {
        await db.read();
    } catch (e) {
        console.log("Could not read db.json, likely because it is empty or corrupt. Initializing with default data.");
        db.data = null;
    }

    if (!db.data || !dbExists) {
        db.data = defaultData;
        await db.write();
    }
};                                       

const getInstanceData = async (instanceId, username = 'admin') => {
    await db.read();
    if (!db.data.instances[instanceId]) {
        db.data.instances[instanceId] = {
            name: `${username}'s Scheduler`,
            phoneNumber: '',
            admins: [{ username: username, password: 'password' }],
            coupons: [],
            appointments: [],
            availability: {},
            categories: defaultData.instances.default.categories,
            services: defaultData.instances.default.services
        };
        await db.write();
    }
    // Ensure existing instances get the new fields if they are missing
    if (!db.data.instances[instanceId].categories) {
        db.data.instances[instanceId].categories = defaultData.instances.default.categories;
    }
    if (!db.data.instances[instanceId].services) {
        db.data.instances[instanceId].services = defaultData.instances.default.services;
    }
    return db.data.instances[instanceId];
};

module.exports = { db, getInstanceData, initDb };
