"use client";

import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { BookOpen, Star, Users, TrendingUp, Sparkles } from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 min-h-screen max-w-screen">
      {/* Hero Section */}
      <section className="text-center py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute top-20 left-1/4  h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4  h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
            Descubre tu próxima
            <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              {" "}
              lectura perfecta
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Sistema inteligente de recomendaciones de libros basado en tus
            gustos, historial de lectura y la comunidad de lectores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/recommendations"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Ver Recomendaciones
                </Link>
                <Link
                  to="/books"
                  className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Explorar Catálogo
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Comenzar Gratis
                </Link>
                <Link
                  to="/books"
                  className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Explorar Libros
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
        <div className="text-center group">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transform group-hover:-translate-y-2 transition-all duration-300">
            <Star className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Recomendaciones Inteligentes
          </h3>
          <p className="text-gray-600">
            Algoritmos avanzados que aprenden de tus gustos y preferencias de
            lectura.
          </p>
        </div>

        <div className="text-center group">
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transform group-hover:-translate-y-2 transition-all duration-300">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Catálogo Extenso
          </h3>
          <p className="text-gray-600">
            Miles de libros organizados por género, autor y calificaciones de la
            comunidad.
          </p>
        </div>

        <div className="text-center group">
          <div className="bg-gradient-to-br from-blue-400 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transform group-hover:-translate-y-2 transition-all duration-300">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Comunidad de Lectores
          </h3>
          <p className="text-gray-600">
            Conecta con otros lectores, comparte reseñas y descubre nuevas
            perspectivas.
          </p>
        </div>

        <div className="text-center group">
          <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transform group-hover:-translate-y-2 transition-all duration-300">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Seguimiento de Progreso
          </h3>
          <p className="text-gray-600">
            Mantén un registro de tu historial de lectura y progreso personal.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="mx-6 max-w-4xl lg:mx-auto relative">
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-center shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-300/20 rounded-full blur-xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">
                ¿Listo para encontrar tu próximo libro favorito?
              </h2>
              <p className="text-lg text-purple-100 mb-6">
                Únete a nuestra comunidad de lectores y recibe recomendaciones
                personalizadas.
              </p>
              <Link
                to="/register"
                className="bg-white text-purple-600 hover:bg-purple-50 font-semibold text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-block"
              >
                Crear Cuenta Gratuita
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
