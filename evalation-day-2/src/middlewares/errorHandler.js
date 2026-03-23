export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); 

  // Gestion des erreurs Prisma 
  if (err.code === 'P2025') {
    return res.status(404).json({ 
      error: "Not Found", 
      message: "La ressource demandée n'existe pas." 
    });
  }

  // Formatage par défaut pour toutes les autres erreurs
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? "Internal Server Error" : "Error",
    message: err.message || "Une erreur inattendue est survenue."
  });
};