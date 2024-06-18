import { sequelize } from './db/index.js';
import User from './app/models/user.models.js';
import Kategori from './app/models/kategori.models.js';
import Budaya from './app/models/budaya.models.js';
import Makanan from './app/models/makanan.model.js';
import Resep from './app/models/resep.model.js';
import RefreshToken from './app/models/refresh.token.models.js';

console.log('is User Model registered:', User === sequelize.model('users'));
console.log('is RefreshToken Model registered:', RefreshToken === sequelize.model('refresh_tokens'));
console.log('is Kategori Model registered:', Kategori === sequelize.model('kategoris'));
console.log('is Budaya Model registered:', Budaya === sequelize.model('budayas'));
console.log('is Makanan Model registered:', Makanan === sequelize.model('makanans'));
console.log('is Resep Model registered:', Resep === sequelize.model('resep'));

sequelize.sync({ force: true }) // Set force to true if you want to drop the tables first
    .then(() => {
        console.log('Database synchronized successfully.');
        process.exit();
    })
    .catch((error) => {
        console.error('Error synchronizing the database:', error);
        process.exit(1);
});
