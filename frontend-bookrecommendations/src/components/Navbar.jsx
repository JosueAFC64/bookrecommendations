"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { BookOpen, User, LogOut, Home, Star, History, Settings } from "lucide-react"

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">BookRecommendations</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive("/") ? "bg-primary-100 text-primary-700" : "text-gray-600 hover:text-primary-600"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Link>

            <Link
              to="/books"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive("/books") ? "bg-primary-100 text-primary-700" : "text-gray-600 hover:text-primary-600"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Libros</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/recommendations"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    isActive("/recommendations")
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-primary-600"
                  }`}
                >
                  <Star className="h-4 w-4" />
                  <span>Recomendaciones</span>
                </Link>

                <Link
                  to="/reading-history"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    isActive("/reading-history")
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-primary-600"
                  }`}
                >
                  <History className="h-4 w-4" />
                  <span>Mi Historial</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/books"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                      isActive("/admin/books")
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-600 hover:text-primary-600"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">{user?.full_name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:block">Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-primary">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
