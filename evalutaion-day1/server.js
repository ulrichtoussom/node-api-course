

// creation d'un serveur node avec le module http 
import { createServer } from 'node:http';
import { getBooks, getBookById, createBook,deleteBook} from './modules/routes.js';

const server = createServer((req, res) => {
    
    const { method, url } = req;

    // 1. Route simple (statique)
    if(method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Bienvenue sur l\'API de gestion de livres pour acceder a la liste des livres tapez /books, pour acceder a un livre specifique tapez /books/id, pour creer un livre tapez /books en POST et le corps de la requete doit contenir les champs title, author et year');
    }
    if (method === 'GET' && url === '/books') {
        return getBooks(req, res);
    }

    if (method === 'POST' && url === '/books') {
        // On appelle notre nouvelle fonction
        return createBook(req, res);
    }

    // 2. Route dynamique (avec ID)
    // On vérifie si l'URL correspond au pattern /books/ suivi de chiffres
    const bookIdMatch = url.match(/^\/books\/(\d+)$/); 
    
    if (method === 'GET' && bookIdMatch) {
        // On récupère l'ID capturé par la parenthèse dans le regex
        req.params = { id: bookIdMatch[1] }; 
        return getBookById(req, res);
    }

    if (method === 'DELETE'&& bookIdMatch) {
        req.params = { id: bookIdMatch[1] }; 
        return deleteBook(req, res);
    }



    // 404 par défaut
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ "success": false, "error": "Route non trouvée" }));

    
});

server.listen(3000, () => console.log('Serveur lancé sur http://localhost:3000'));