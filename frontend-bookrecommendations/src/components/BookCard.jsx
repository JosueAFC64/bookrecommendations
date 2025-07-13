"use client"

import { Link } from "react-router-dom"
import { Star, Calendar, User } from "lucide-react"

const BookCard = ({ book, showAddToHistory = false, onAddToHistory }) => {
  const handleAddToHistory = (status) => {
    if (onAddToHistory) {
      onAddToHistory(book.id, status)
    }
  }

  return (
    <div className="card hover:shadow-lg rounded transition-shadow duration-200">
      <div className="flex flex-col h-full w-[306px]">
        {/* Book Cover */}
        <div className="w-full h-64 bg-gray-200 rounded-t mb-4 flex items-center justify-center">
          {book.cover_url ? (
            <img
              src={`http://localhost:8000/images/${book.cover_url}`}
              alt={book.title}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-sm">Sin portada</div>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 px-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            <Link to={`/books/${book.id}`} className="hover:text-primary-600 transition-colors">
              {book.title}
            </Link>
          </h3>

          <div className="flex items-center text-gray-600 mb-2">
            <User className="h-4 w-4 mr-1" />
            <span className="text-sm">{book.author}</span>
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm">{book.publication_year}</span>
          </div>

          <div className="flex items-center mb-3">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{book.average_rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 ml-1">({book.rating_count} reseñas)</span>
          </div>

          <div className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-4 rounded-full">
            {book.genre}
          </div>
        </div>

        {/* Action Buttons */}
        {showAddToHistory && (
          <div className="mt-4 pt-4 border-t border-gray-200 px-4 mb-4 rounded-b">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAddToHistory("QUIERO_LEER")}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
              >
                Quiero Leer
              </button>
              <button
                onClick={() => handleAddToHistory("LEYENDO")}
                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
              >
                Leyendo
              </button>
              <button
                onClick={() => handleAddToHistory("LEIDO")}
                className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
              >
                Leído
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookCard
