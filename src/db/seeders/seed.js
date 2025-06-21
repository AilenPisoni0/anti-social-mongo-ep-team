const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const Tag = require('../models/tag');
const Comment = require('../models/comment');
const PostImage = require('../models/postImage');
require('dotenv').config();

// URLs de imágenes de ejemplo
const sampleImageUrls = [
    'https://ejemplo.com/imagen1.jpg',
    'https://ejemplo.com/imagen2.jpg',
    'https://ejemplo.com/imagen3.jpg',
    'https://ejemplo.com/imagen4.jpg',
    'https://ejemplo.com/imagen5.jpg',
];

async function seed() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI no está definida en las variables de entorno');
        }

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');

        await User.deleteMany({});
        await Post.deleteMany({});
        await Tag.deleteMany({});
        await Comment.deleteMany({});
        await PostImage.deleteMany({});
        console.log('Colecciones limpiadas');

        const users = await User.insertMany([
            {
                nickName: 'usuario1',
                email: 'usuario1@example.com'
            },
            {
                nickName: 'usuario2',
                email: 'usuario2@example.com'
            },
            {
                nickName: 'usuario3',
                email: 'usuario3@example.com'
            }
        ]);
        console.log(`${users.length} usuarios creados`);

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
        console.log(`${tags.length} tags creados`);

        const posts = await Post.insertMany([
            {
                description: 'Mi primer post en la red antisocial! :)',
                userId: users[0]._id,
                tags: [tags[0]._id, tags[5]._id] // tecnología, programación
            },
            {
                description: 'Aguante Messi!',
                userId: users[1]._id,
                tags: [tags[1]._id] // deportes
            },
            {
                description: 'Nueva receta que probé hoy, quedó riquisima!',
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
        console.log(`${posts.length} posts creados`);

        const postImages = [];
        posts.forEach((post, index) => {
            // Cada post va a tener 1-3 imágenes random elegidas
            const numImages = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numImages; i++) {
                postImages.push({
                    postId: post._id,
                    url: sampleImageUrls[(index + i) % sampleImageUrls.length]
                });
            }
        });
        await PostImage.insertMany(postImages);
        console.log(`${postImages.length} imágenes de posts creadas`);

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
                content: 'God!',
                userId: users[0]._id,
                postId: posts[1]._id
            },
            {
                content: '¿Podrías compartir la receta?',
                userId: users[1]._id,
                postId: posts[2]._id
            },
            {
                content: '¡Se ve re bueno!',
                userId: users[0]._id,
                postId: posts[2]._id
            },
            {
                content: '¿A dónde fuiste?',
                userId: users[2]._id,
                postId: posts[3]._id
            },
            {
                content: 'La música es lo mejor para programar',
                userId: users[0]._id,
                postId: posts[4]._id
            }
        ]);
        console.log(`${comments.length} comentarios creados`);

    } catch (error) {
        console.error('Error durante el seed:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('Desconectado de MongoDB');
        }
    }
}

if (require.main === module) {
    seed();
}

module.exports = seed; 