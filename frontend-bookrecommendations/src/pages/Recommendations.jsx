"use client";

import { useState, useEffect } from "react";
import { recommendationsAPI } from "../services/api";
import BookCard from "../components/BookCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Star, Users, TrendingUp, Heart } from "lucide-react";
import toast from "react-hot-toast";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState({
    genre: [],
    author: [],
    collaborative: [],
    popular: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("genre");

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const [genreRes, authorRes, collaborativeRes, popularRes] =
        await Promise.all([
          recommendationsAPI.byGenre(),
          recommendationsAPI.byAuthor(),
          recommendationsAPI.collaborative(),
          recommendationsAPI.popular(),
        ]);

      setRecommendations({
        genre: genreRes.data,
        author: authorRes.data,
        collaborative: collaborativeRes.data,
        popular: popularRes.data,
      });
    } catch (error) {
      toast.error("Error al cargar las recomendaciones");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "genre",
      name: "Por Género",
      icon: Star,
      description: "Basado en tus géneros favoritos",
    },
    {
      id: "author",
      name: "Por Autor",
      icon: Heart,
      description: "Autores que te han gustado",
    },
    {
      id: "collaborative",
      name: "Usuarios Similares",
      icon: Users,
      description: "Lectores con gustos parecidos",
    },
    {
      id: "popular",
      name: "Populares",
      icon: TrendingUp,
      description: "Los más valorados por la comunidad",
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  const currentRecommendations = recommendations[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Header with decorative background */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute top-20 left-1/4  h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4  h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>


        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
            Recomendaciones Personalizadas
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Descubre libros seleccionados especialmente para ti basados en tus
            gustos y preferencias.
          </p>
        </div>
      </div>

      <div className="space-y-8 px-4 pb-8">
        {/* Enhanced Tabs */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-purple-100 mt-4 flex items-center justify-center">
            <nav className="flex space-x-2 px-4 py-4 overflow-x-auto justify-between w-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-gray-800 hover:bg-white/80"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content Header */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent mb-2">
              {tabs.find((tab) => tab.id === activeTab)?.name}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {tabs.find((tab) => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Recommendations Grid or Empty State */}
        <div className="max-w-7xl mx-auto">
          {currentRecommendations.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-200 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No hay recomendaciones disponibles
                </h3>
                <p className="text-gray-600 mb-1">
                  Lee más libros y califica para obtener mejores
                  recomendaciones.
                </p>
                <p className="text-gray-500 text-sm">
                  ¡Mientras más interactúes, mejores serán nuestras sugerencias!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentRecommendations.map((recommendation, index) => (
                <div
                  key={`${recommendation.book.id}-${index}`}
                  className="relative group transform transition-all duration-300 hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="relative">
                    <BookCard book={recommendation.book} />

                    {/* Match Score Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {(recommendation.score * 100).toFixed(0)}% match
                      </div>
                    </div>

                    {/* Recommendation Reason */}
                    <div className="mt-3 p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-violet-700 font-medium leading-relaxed">
                          {recommendation.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
