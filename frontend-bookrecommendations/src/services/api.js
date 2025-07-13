import axios from "axios"
import toast from "react-hot-toast"

// Configuración base de axios - CORREGIDA
const api = axios.create({
  baseURL: "http://localhost:8000", // Cambia esto a tu URL base
  withCredentials: true, // IMPORTANTE: Envía cookies automáticamente
  headers: {
    "Content-Type": "application/json",
  },
})

// Variable para evitar bucles infinitos
let isRefreshing = false

// Interceptor para manejar errores - MEJORADO
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
      // Evitar bucle infinito
      if (originalRequest.url?.includes("/auth/")) {
        return Promise.reject(error)
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Intentar verificar si el usuario sigue autenticado
        await api.get("/auth/me")
        isRefreshing = false
        return api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        // Solo redirigir si no estamos ya en login
        if (!window.location.pathname.includes("/login")) {
          toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.")
          window.location.href = "/login"
        }
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

// API de autenticación
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
}

// API de libros
export const booksAPI = {
  getAll: (params = {}) => api.get("/books", { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (bookData) => api.post("/books", bookData),
  search: (searchData) => api.post("/books/search", searchData),
  getReviews: (bookId) => api.get(`/books/${bookId}/reviews`),
  createReview: (bookId, reviewData) => api.post(`/books/${bookId}/reviews`, reviewData),
}

// API de historial de lectura
export const readingHistoryAPI = {
  getAll: () => api.get("/reading-history"),
  create: (historyData) => api.post("/reading-history", historyData),
}

// API de recomendaciones
export const recommendationsAPI = {
  byGenre: () => api.get("/recommendations/by-genre"),
  byAuthor: () => api.get("/recommendations/by-author"),
  collaborative: () => api.get("/recommendations/collaborative"),
  popular: () => api.get("/recommendations/popular"),
}

// API de preferencias
export const preferencesAPI = {
  get: () => api.get("/preferences"),
  update: (preferences) => api.put("/preferences", preferences),
};

export default api
