"use client"

import { useState } from "react"
import { booksAPI } from "../services/api"
import { Star } from "lucide-react"
import toast from "react-hot-toast"

const ReviewForm = ({ bookId, onReviewSubmitted, onCancel }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error("Por favor selecciona una calificación")
      return
    }

    setLoading(true)
    try {
      await booksAPI.createReview(bookId, {
        rating,
        comment: comment.trim() || null,
      })
      toast.success("Reseña enviada exitosamente")
      onReviewSubmitted()
    } catch (error) {
      toast.error("Error al enviar la reseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Escribir Reseña</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Calificación *</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">{rating > 0 && `${rating} de 5 estrellas`}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comentario (opcional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="input-field"
            placeholder="Comparte tu opinión sobre este libro..."
            maxLength={1000}
          />
          <div className="text-xs text-gray-500 mt-1">{comment.length}/1000 caracteres</div>
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading || rating === 0} className="btn-primary disabled:opacity-50">
            {loading ? "Enviando..." : "Enviar Reseña"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm
