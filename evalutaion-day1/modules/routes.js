
import { readDB, writeDB } from './db.js';

const getBooks = async (req, res) => {
    try {
        // 1. Analyser l'URL pour extraire les paramètres de recherche
        // On passe une base bidon "http://localhost" car l'objet URL en a besoin
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const availableParam = parsedUrl.searchParams.get('available');

        // 2. Lire la base de données
        const db = await readDB();
        let filteredBooks = db.books;

        // 3. Appliquer le filtre si le paramètre "available" est présent
        if (availableParam !== null) {
            // Attention : le paramètre arrive sous forme de chaîne "true" ou "false"
            const isAvailable = availableParam === 'true';
            filteredBooks = db.books.filter(book => book.available === isAvailable);
        }

        // 4. Envoyer la réponse
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            count: filteredBooks.length,
            data: filteredBooks
        }));

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: "Erreur lors de la récupération" }));
    }
}

const getBookById = async (req, res) => {

    const id = parseInt(req.params.id)
    const db = await readDB(); // On récupère l'objet global

    // On utilise db.books pour accéder au tableau et faire le .find()
    const book = db.books.find(b => b.id === id);

    if (book) {
        // Succès : Le livre existe
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: book
        }));
    }else {
        // Erreur : Le livre n'existe pas
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: `Livre avec l'id ${id} non trouvé`
        }));
    }
}

const createBook = async (req, res) => {

    let body = '';

    // Écouter les morceaux de données qui arrivent
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    // Une fois que toutes les données sont reçues
    req.on('end', async () => {
        try {
            const { title, author, year } = JSON.parse(body);

            // Validation des champs
            if (!title || !author || !year) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: false,
                    error: "Les champs title, author et year sont requis"
                }));
            }

            // Lecture de la base de données
            const db = await readDB();

            // Création du nouveau livre avec un ID auto-incrémenté
            const newBook = {
                id: db.books.length > 0 ? db.books[db.books.length - 1].id + 1 : 1,
                title,
                author,
                year,
                available: true
            };

            // Ajout et sauvegarde
            db.books.push(newBook);
            await writeDB(db);

            // Réponse de succès
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: newBook
            }));

        } catch (error) {
            // Cas où le JSON envoyé est mal formé
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: "Format JSON invalide" }));
        }
    });
};

const deleteBook = async (req, res) => {
    // 1. Récupérer l'ID (on suppose que req.params.id a été rempli dans le serveur)
    const id = parseInt(req.params.id);

    try {
        // 2. Lire la base de données
        const db = await readDB();

        // 3. Vérifier si le livre existe
        const bookIndex = db.books.findIndex(b => b.id === id);

        if (bookIndex === -1) {
            // Si findIndex retourne -1, le livre n'existe pas
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: false,
                error: "aucun book avec id correspondant"
            }));
        }

        // 4. Supprimer le livre du tableau
        // splice(index, nombre_a_supprimer)
        db.books.splice(bookIndex, 1);

        // 5. Sauvegarder les modifications dans le fichier db.json
        await writeDB(db);

        // 6. Réponse de succès
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            message: `Le livre avec l'id ${id} a été supprimé avec succès`
        }));

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: "Erreur serveur" }));
    }
};


export { getBooks, getBookById,createBook, deleteBook };





