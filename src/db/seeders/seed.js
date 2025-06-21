const User = require('../models/user');
const Post = require('../models/post');
const Tag = require('../models/tag');
const Comment = require('../models/comment');
const PostImage = require('../models/postImage');

const seedData = async () => {
    try {
        console.log('Iniciando seeding de datos...');

        await User.deleteMany({});
        await Post.deleteMany({});
        await Tag.deleteMany({});
        await Comment.deleteMany({});
        await PostImage.deleteMany({});

        console.log('Datos anteriores eliminados');

        const users = await User.create([
            {
                nickName: 'john_doe',
                email: 'john@example.com'
            },
            {
                nickName: 'jane_smith',
                email: 'jane@example.com'
            },
            {
                nickName: 'bob_wilson',
                email: 'bob@example.com'
            }
        ]);

        console.log('Usuarios creados:', users.length);

        const tags = await Tag.create([
            {
                name: 'tecnologia',
                color: '#FF5733'
            },
            {
                name: 'lifestyle',
                color: '#33FF57'
            },
            {
                name: 'viajes',
                color: '#3357FF'
            },
            {
                name: 'programacion',
                color: '#F333FF'
            }
        ]);

        console.log('Tags creados:', tags.length);

        const posts = await Post.create([
            {
                description: 'Este es mi primer post en la red social!',
                userId: users[0]._id,
                tags: [tags[0]._id, tags[3]._id]
            },
            {
                description: 'Compartiendo mis pensamientos en esta nueva plataforma',
                userId: users[1]._id,
                tags: [tags[1]._id]
            },
            {
                description: 'Hola a todos! Me encanta esta red social',
                userId: users[2]._id,
                tags: [tags[2]._id]
            }
        ]);

        console.log('Posts creados:', posts.length);

        const comments = await Comment.create([
            {
                content: 'Excelente post! Me encanta la tecnologia',
                userId: users[1]._id,
                postId: posts[0]._id
            },
            {
                content: 'Totalmente de acuerdo contigo',
                userId: users[2]._id,
                postId: posts[0]._id
            },
            {
                content: 'Bienvenido a la plataforma!',
                userId: users[0]._id,
                postId: posts[2]._id
            }
        ]);

        console.log('Comentarios creados:', comments.length);

        const postImages = await PostImage.create([
            {
                postId: posts[0]._id,
                url: '/uploads/images/prueba.jpg'
            },
            {
                postId: posts[1]._id,
                url: '/uploads/images/prueba-2.jpg'
            }
        ]);

        console.log('Imagenes creadas:', postImages.length);

        console.log('Seeding completado exitosamente!');
        console.log('Resumen de datos creados:');
        console.log(`- Usuarios: ${users.length}`);
        console.log(`- Tags: ${tags.length}`);
        console.log(`- Posts: ${posts.length}`);
        console.log(`- Comentarios: ${comments.length}`);
        console.log(`- Imagenes: ${postImages.length}`);

        console.log('IDs importantes para pruebas:');
        console.log(`- Usuario 1 (john_doe): ${users[0]._id}`);
        console.log(`- Usuario 2 (jane_smith): ${users[1]._id}`);
        console.log(`- Post 1: ${posts[0]._id}`);
        console.log(`- Tag tecnologia: ${tags[0]._id}`);

    } catch (error) {
        console.error('Error durante el seeding:', error);
    }
};

if (require.main === module) {
    const mongoose = require('mongoose');
    require('dotenv').config();

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Conectado a MongoDB');
            return seedData();
        })
        .then(() => {
            console.log('Proceso completado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = seedData; 