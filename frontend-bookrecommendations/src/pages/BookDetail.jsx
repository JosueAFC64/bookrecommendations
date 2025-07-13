"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { booksAPI, readingHistoryAPI } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import ReviewForm from "../components/ReviewForm"
import ReviewList from "../components/ReviewList"
import { Star, Calendar, User, BookOpen, ArrowLeft, Plus } from "lucide-react"
import toast from "react-hot-toast"

const BookDetail = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (id) {
      loadBookDetails()
    }
  }, [id])

  const loadBookDetails = async () => {
    try {
      const [bookResponse, reviewsResponse] = await Promise.all([booksAPI.getById(id), booksAPI.getReviews(id)])

      setBook(bookResponse.data)
      setReviews(reviewsResponse.data)
    } catch (error) {
      toast.error("Error al cargar los detalles del libro")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToHistory = async (status) => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar libros a tu historial")
      return
    }

    try {
      await readingHistoryAPI.create({
        book_id: Number.parseInt(id),
        status: status,
        start_date: new Date().toISOString(),
      })
      toast.success(`Libro agregado como "${status.replace("_", " ")}"`)
    } catch (error) {
      toast.error("Error al agregar el libro al historial")
    }
  }

  const handleReviewSubmitted = () => {
    setShowReviewForm(false)
    loadBookDetails()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Libro no encontrado</h2>
        <Link to="/books" className="btn-primary">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back Button */}
      <Link to="/books" className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mt-8">
        <ArrowLeft className="h-4 w-4" />
        <span>Volver al catálogo</span>
      </Link>

      {/* Book Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="lg:col-span-1">
          <div className="w-full max-w-sm mx-auto">
            {book.cover_url ? (
              <img
                src={`http://localhost:8000/images/${book.cover_url}`}
                alt={book.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <BookOpen className="h-16 w-16 mx-auto mb-4" />
                  <p>Sin portada disponible</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Book Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>

            <div className="flex items-center space-x-4 text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{book.author}</span>
              </div>

              {book.publication_year && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{book.publication_year}</span>
                </div>
              )}

              {book.pages && (
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{book.pages} páginas</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold">{book.average_rating.toFixed(1)}</span>
                <span className="text-gray-500">({book.rating_count} reseñas)</span>
              </div>

              <div className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
                {book.genre}
              </div>
            </div>

            {book.isbn && (
              <p className="text-sm text-gray-600 mb-4">
                <strong>ISBN:</strong> {book.isbn}
              </p>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Action Buttons */}
          {isAuthenticated && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Agregar a mi historial</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleAddToHistory("QUIERO_LEER")}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Quiero Leer
                </button>
                <button
                  onClick={() => handleAddToHistory("LEYENDO")}
                  className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Leyendo
                </button>
                <button
                  onClick={() => handleAddToHistory("LEIDO")}
                  className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Leído
                </button>
                <button
                  onClick={() => handleAddToHistory("ABANDONADO")}
                  className="bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Abandonado
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Reseñas</h2>
          {isAuthenticated && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Escribir reseña</span>
            </button>
          )}
        </div>

        {showReviewForm && (
          <ReviewForm
            bookId={Number.parseInt(id)}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => setShowReviewForm(false)}
          />
        )}

        <ReviewList reviews={reviews} />
      </div>
    </div>
  )
}

export default BookDetail
