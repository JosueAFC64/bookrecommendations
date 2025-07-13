"use client"

import { Star, User } from "lucide-react"

const ReviewList = ({ reviews }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay reseñas para este libro aún.</p>
        <p className="text-gray-400 text-sm mt-1">¡Sé el primero en escribir una!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="card">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{review.user_name}</div>
                <div className="text-sm text-gray-500">{formatDate(review.created_at)}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {renderStars(review.rating)}
              <span className="text-sm font-medium text-gray-700">{review.rating.toFixed(1)}</span>
            </div>
          </div>

          {review.comment && <p className="text-gray-700 leading-relaxed">{review.comment}</p>}
        </div>
      ))}
    </div>
  )
}

export default ReviewList
