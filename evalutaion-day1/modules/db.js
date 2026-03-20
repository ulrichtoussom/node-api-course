

// creation de function de lecture de d 'ecriture dans le fichier le db.json qui a la structure { books: [] }
import { readFile, writeFile } from 'node:fs/promises';


export const readDB = async () => {
    try {
        const data = await readFile('db.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur de lecture du fichier db.json:', error);
        return { books: [] }; // Retourne une structure vide en cas d'erreur
    }
};

export const writeDB = async (data) => {
    try {
        await writeFile('db.json', JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Erreur d\'écriture dans le fichier db.json:', error);
    }
};      