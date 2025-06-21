const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const Tag = require('../models/tag');
const Comment = require('../models/comment');
const PostImage = require('../models/postImage');
const config = require('../config/config.json');

// URLs de imágenes de ejemplo
const sampleImageUrls = [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
    'https://picsum.photos/800/600?random=5'
];

async function seed() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');

        // Limpiar colecciones existentes
        await User.deleteMany({});
        await Post.deleteMany({});
        await Tag.deleteMany({});
        await Comment.deleteMany({});
        await PostImage.deleteMany({});
        console.log('Colecciones limpiadas');

        // Crear usuarios
        const users = await User.insertMany([
            {
                nickName: 'usuario1',
                email: 'usuario1@example.com',
                password: 'password123',
                firstName: 'Juan',
                lastName: 'Pérez',
                birthDate: new Date('1990-01-15'),
                gender: 'M',
                country: 'Argentina',
                city: 'Buenos Aires'
            },
            {
                nickName: 'usuario2',
                email: 'usuario2@example.com',
                password: 'password123',
                firstName: 'María',
                lastName: 'González',
                birthDate: new Date('1992-05-20'),
                gender: 'F',
                country: 'Argentina',
                city: 'Córdoba'
            },
            {
                nickName: 'usuario3',
                email: 'usuario3@example.com',
                password: 'password123',
                firstName: 'Carlos',
                lastName: 'López',
                birthDate: new Date('1988-12-10'),
                gender: 'M',
                country: 'Argentina',
                city: 'Rosario'
            }
        ]);
        console.log('Usuarios creados');

        // Crear tags
        const tags = await Tag.insertMany([
            { name: 'tecnología' },
            { name: 'deportes' },
            { name: 'música' },
            { name: 'cocina' },
            { name: 'viajes' },
            { name: 'programación' },
            { name: 'arte' },
            { name: 'ciencia' }
        ]);
        console.log('Tags creados');

        // Crear posts
        const posts = await Post.insertMany([
            {
                description: 'Mi primer post en la red antisocial!',
                userId: users[0]._id,
                tags: [tags[0]._id, tags[5]._id] // tecnología, programación
            },
            {
                description: 'Hoy fue un día increíble practicando deportes',
                userId: users[1]._id,
                tags: [tags[1]._id] // deportes
            },
            {
                description: 'Nueva receta que probé hoy, quedó deliciosa!',
                userId: users[2]._id,
                tags: [tags[3]._id, tags[6]._id] // cocina, arte
            },
            {
                description: 'Viajando por el mundo y descubriendo nuevos lugares',
                userId: users[0]._id,
                tags: [tags[4]._id] // viajes
            },
            {
                description: 'Escuchando música mientras programo',
                userId: users[1]._id,
                tags: [tags[2]._id, tags[5]._id] // música, programación
            }
        ]);
        console.log('Posts creados');

        // Crear imágenes para los posts
        const postImages = [];
        posts.forEach((post, index) => {
            // Cada post tendrá 1-3 imágenes
            const numImages = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numImages; i++) {
                postImages.push({
                    postId: post._id,
                    url: sampleImageUrls[(index + i) % sampleImageUrls.length]
                });
            }
        });
        await PostImage.insertMany(postImages);
        console.log('Imágenes de posts creadas');

        // Crear comentarios
        const comments = await Comment.insertMany([
            {
                content: '¡Excelente post!',
                userId: users[1]._id,
                postId: posts[0]._id
            },
            {
                content: 'Me encanta la tecnología',
                userId: users[2]._id,
                postId: posts[0]._id
            },
            {
                content: '¡Qué bueno que te diviertas con deportes!',
                userId: users[0]._id,
                postId: posts[1]._id
            },
            {
                content: '¿Podrías compartir la receta?',
                userId: users[1]._id,
                postId: posts[2]._id
            },
            {
                content: '¡Se ve delicioso!',
                userId: users[0]._id,
                postId: posts[2]._id
            },
            {
                content: '¿A dónde viajaste?',
                userId: users[2]._id,
                postId: posts[3]._id
            },
            {
                content: 'La música es lo mejor para programar',
                userId: users[0]._id,
                postId: posts[4]._id
            }
        ]);
        console.log('Comentarios creados');

        console.log('¡Seed completado exitosamente!');
        console.log(`- ${users.length} usuarios creados`);
        console.log(`- ${tags.length} tags creados`);
        console.log(`- ${posts.length} posts creados`);
        console.log(`- ${postImages.length} imágenes creadas`);
        console.log(`- ${comments.length} comentarios creados`);

    } catch (error) {
        console.error('Error durante el seed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Desconectado de MongoDB');
    }
}

// Ejecutar el seed si se llama directamente
if (require.main === module) {
    seed();
}

module.exports = seed; 