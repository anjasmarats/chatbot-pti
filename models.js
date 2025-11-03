const { Sequelize, DataTypes } = require('sequelize');

// /home/debian-ats/folder-IT/chatbot-pti/models.js

const sequelize = new Sequelize(
    process.env.DB_NAME || 'chatbot_pti',
    process.env.DB_USER || 'chatbot_pti_user',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        // dialect:'postgres',
        logging: false,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        }
    }
);

// Model: dosen
const Dosen = sequelize.define('Dosen', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    nama: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    nip: {
        type: DataTypes.STRING(64),
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT, // teks panjang untuk deskripsi / bio
        allowNull: true
    }
}, {
    tableName: 'dosen',
    timestamps: true
});

// Model: feedback
const Feedback = sequelize.define('Feedback', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT, // kolom tipe TEXT untuk menyimpan feedback/user message
        allowNull: false
    },
    analysis: {
        type: DataTypes.TEXT, // kolom tipe TEXT untuk menyimpan hasil analisis teks (opsional)
        allowNull: false
    },
    category:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'feedback',
    timestamps: true
});

// Model: dosen
const Mahasiswa = sequelize.define('Mahasiswa', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    nama: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    nim: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT, // teks panjang untuk deskripsi / bio
        allowNull: true
    }
}, {
    tableName: 'mahasiswa',
    timestamps: true
});

module.exports = {
    sequelize,Dosen,Feedback,Mahasiswa
}