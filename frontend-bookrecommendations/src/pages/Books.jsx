"use client";

import { useState, useEffect } from "react";
import { booksAPI, readingHistoryAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await booksAPI.getAll();
      setBooks(response.data);
    } catch (error) {
      toast.error("Error al cargar los libros");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchData) => {
    const filteredSearch = Object.fromEntries(
      Object.entries(searchData).filter(([_, value]) => value.trim() !== "")
    );

    if (Object.keys(filteredSearch).length === 0) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await booksAPI.search(filteredSearch);
      setSearchResults(response.data);
    } catch (error) {
      toast.error("Error en la búsqueda");
    }
  };

  const handleAddToHistory = async (bookId, status) => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar libros a tu historial");
      return;
    }

    try {
      await readingHistoryAPI.create({
        book_id: bookId,
        status: status,
        start_date: new Date().toISOString(),
      });
      toast.success(`Libro agregado como "${status.replace("_", " ")}"`);
    } catch (error) {
      toast.error("Error al agregar el libro al historial");
    }
  };

  const displayBooks = searchResults || books;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute top-20 left-1/4  h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4  h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

        <div className="relative z-10 text-center px-4 py-12 flex flex-col items-center justify-center">
          <h1 className="h-18 text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
            Catálogo de Libros
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Explora nuestra colección de libros y encuentra tu próxima lectura
            perfecta.
          </p>
        </div>
      </div>

      <div className="space-y-8 px-4 pb-8">
        {/* Search Bar Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Search Results Info */}
        {searchResults && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 flex items-center justify-between border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-green-800 font-medium">
                  {searchResults.length} resultado(s) encontrado(s)
                </p>
              </div>
              <button
                onClick={() => setSearchResults(null)}
                className="bg-white/80 text-green-700 hover:bg-white hover:text-green-800 px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Limpiar búsqueda
              </button>
            </div>
          </div>
        )}

        {/* Books Grid or Empty State */}
        <div className="max-w-7xl mx-auto">
          {displayBooks.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-200 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {searchResults
                    ? "No se encontraron libros"
                    : "No hay libros disponibles"}
                </h3>
                <p className="text-gray-600">
                  {searchResults
                    ? "Intenta con diferentes criterios de búsqueda"
                    : "Los libros se cargarán pronto"}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <BookCard
                    book={book}
                    showAddToHistory={isAuthenticated}
                    onAddToHistory={handleAddToHistory}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
