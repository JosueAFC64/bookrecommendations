"use client";

import { useState, useEffect } from "react";
import { readingHistoryAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { BookOpen, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const ReadingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const statusConfig = {
    QUIERO_LEER: {
      label: "Quiero Leer",
      color: "blue",
      icon: BookOpen,
    },
    LEYENDO: {
      label: "Leyendo",
      color: "green",
      icon: Clock,
    },
    LEIDO: {
      label: "Leído",
      color: "purple",
      icon: CheckCircle,
    },
    ABANDONADO: {
      label: "Abandonado",
      color: "red",
      icon: XCircle,
    },
  };

  const filters = [
    { key: "ALL", label: "Todos" },
    { key: "QUIERO_LEER", label: "Quiero Leer" },
    { key: "LEYENDO", label: "Leyendo" },
    { key: "LEIDO", label: "Leído" },
    { key: "ABANDONADO", label: "Abandonado" },
  ];

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await readingHistoryAPI.getAll();
      setHistory(response.data);
    } catch (error) {
      toast.error("Error al cargar el historial de lectura");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory =
    activeFilter === "ALL"
      ? history
      : history.filter((item) => item.status === activeFilter);

  const getStatusStats = () => {
    const stats = {};
    Object.keys(statusConfig).forEach((status) => {
      stats[status] = history.filter((item) => item.status === status).length;
    });
    return stats;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header with decorative background */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20"></div>
        <div className="absolute top-0 left-1/4 w-64 h-72 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-64 h-72 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-800 bg-clip-text text-transparent mb-6">
            Mi Historial de Lectura
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Lleva un registro de todos los libros que has leído, estás leyendo o
            planeas leer.
          </p>
        </div>
      </div>

      <div className="space-y-8 px-4 pb-8">
        {/* Enhanced Statistics */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statusConfig).map(([status, config], index) => {
              const Icon = config.icon;
              const gradientClasses = [
                "from-blue-500 to-indigo-500",
                "from-yellow-500 to-orange-500",
                "from-green-500 to-emerald-500",
                "from-purple-500 to-pink-500",
              ];

              return (
                <div key={status} className="group">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div
                      className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${gradientClasses[index]} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stats[status]}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {config.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => {
                const isActive = activeFilter === filter.key;
                return (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg transform scale-105"
                        : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    {filter.label}
                    {filter.key !== "ALL" && (
                      <span
                        className={`ml-2 text-xs px-2 py-1 rounded-full ${
                          isActive ? "bg-white/20" : "bg-gray-200"
                        }`}
                      >
                        {stats[filter.key] || 0}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* History List or Empty State */}
        <div className="max-w-6xl mx-auto">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-200 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {activeFilter === "ALL"
                    ? "No tienes libros en tu historial"
                    : `No tienes libros en "${
                        filters.find((f) => f.key === activeFilter)?.label
                      }"`}
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza agregando libros desde el catálogo
                </p>
                <a
                  href="/books"
                  className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Explorar Libros
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item, index) => {
                const config = statusConfig[item.status];
                const Icon = config.icon;
                const statusColors = {
                  WANT_TO_READ: "from-blue-500 to-indigo-500",
                  READING: "from-yellow-500 to-orange-500",
                  READ: "from-green-500 to-emerald-500",
                  ABANDONED: "from-purple-500 to-pink-500",
                };

                return (
                  <div
                    key={item.id}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Book Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              Libro: "{item.book_name}"
                            </h3>
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                                  statusColors[item.status] ||
                                  "from-gray-400 to-gray-500"
                                }`}
                              ></div>
                              <span className="text-sm text-gray-600 font-medium">
                                {config.label}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${
                              statusColors[item.status] ||
                              "from-gray-400 to-gray-500"
                            } text-white shadow-md`}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {config.label}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 block">
                                Agregado
                              </span>
                              <span className="text-sm font-medium">
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                          </div>

                          {item.start_date && (
                            <div className="flex items-center space-x-2 text-gray-600">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 block">
                                  Iniciado
                                </span>
                                <span className="text-sm font-medium">
                                  {formatDate(item.start_date)}
                                </span>
                              </div>
                            </div>
                          )}

                          {item.finish_date && (
                            <div className="flex items-center space-x-2 text-gray-600">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 block">
                                  Terminado
                                </span>
                                <span className="text-sm font-medium">
                                  {formatDate(item.finish_date)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {item.progress_pages > 0 && (
                          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">
                                  📖
                                </span>
                              </div>
                              <span className="text-sm font-medium text-emerald-700">
                                Progreso: {item.progress_pages} páginas
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingHistory;
