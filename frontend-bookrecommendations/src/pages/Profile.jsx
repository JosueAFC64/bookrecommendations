"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { preferencesAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { User, Mail, Shield, Settings, Star } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingPreferences, setEditingPreferences] = useState(false);

  const genres = [
    "Aventura",
    "Biografía",
    "Ciencia Ficción",
    "Clásico",
    "Distopía",
    "Drama",
    "Drama Histórico",
    "Ensayo Psicológico",
    "Fábula",
    "Fantasía",
    "Ficción Literaria",
    "Ficción Espiritual",
    "Ficción Transgresora",
    "Filosofía",
    "Historia",
    "Juvenil",
    "Literatura Experimental",
    "Misterio",
    "No Ficción",
    "Novela Histórica",
    "Realismo Mágico",
    "Romance",
    "Sátira Política",
    "Suspenso",
    "Terror",
    "Thriller Psicológico",
  ];

  // Añadir esta función para cargar las preferencias
  const loadUserPreferences = async () => {
    setLoading(true);
    try {
      const response = await preferencesAPI.get();
      // Combinar las preferencias recibidas con los valores predeterminados
      const initialPreferences = {};
      genres.forEach((genre) => {
        initialPreferences[genre] = response.data[genre] || 0;
      });
      setPreferences(initialPreferences);
    } catch (error) {
      toast.error("Error al cargar las preferencias");
      // Inicializar con valores predeterminados en caso de error
      const initialPreferences = {};
      genres.forEach((genre) => {
        initialPreferences[genre] = 0;
      });
      setPreferences(initialPreferences);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar las preferencias cuando el componente se monta
    loadUserPreferences();
  }, []);

  const handlePreferenceChange = (genre, value) => {
    setPreferences((prev) => ({
      ...prev,
      [genre]: Number.parseFloat(value),
    }));
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await preferencesAPI.update(preferences);
      toast.success("Preferencias actualizadas exitosamente");
      setEditingPreferences(false);
    } catch (error) {
      toast.error("Error al actualizar las preferencias");
    } finally {
      setLoading(false);
    }
  };

  const getPreferenceLabel = (value) => {
    if (value >= 0.7) return "Me encanta";
    if (value >= 0.3) return "Me gusta";
    if (value >= -0.3) return "Neutral";
    if (value >= -0.7) return "No me gusta";
    return "Odio";
  };

  const getPreferenceColor = (value) => {
    if (value >= 0.7) return "text-green-600";
    if (value >= 0.3) return "text-blue-600";
    if (value >= -0.3) return "text-gray-600";
    if (value >= -0.7) return "text-orange-600";
    return "text-red-600";
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-cyan-600/90"></div>

          {/* Animated Background Elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-white/5 rounded-full mix-blend-overlay filter blur-2xl opacity-40 animate-pulse delay-2000"></div>

          <div className="relative z-10 text-center px-8 py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Mi Perfil
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
              Gestiona tu información personal y tus preferencias de lectura.
            </p>
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Información Personal
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <span className="text-slate-900 font-medium">
                      {user.full_name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Mail className="h-5 w-5 text-slate-600" />
                    </div>
                    <span className="text-slate-900 font-medium">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Rol
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Shield className="h-5 w-5 text-slate-600" />
                    </div>
                    <span
                      className={`font-semibold px-3 py-1 rounded-full text-sm ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {user.role === "admin" ? "Administrador" : "Usuario"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Estado de la Cuenta
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          user.is_active ? "bg-green-500" : "bg-red-500"
                        } shadow-lg`}
                      ></div>
                    </div>
                    <span
                      className={`font-semibold px-3 py-1 rounded-full text-sm ${
                        user.is_active
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {user.is_active ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Preferences */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Preferencias de Lectura
              </h2>
            </div>
            <button
              onClick={() => setEditingPreferences(!editingPreferences)}
              className={`group relative px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
                editingPreferences
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  : "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white"
              }`}
            >
              <Settings className="h-5 w-5 transition-transform group-hover:rotate-45" />
              <span>{editingPreferences ? "Cancelar" : "Editar"}</span>
            </button>
          </div>

          <div className="space-y-8">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <p className="text-slate-700 text-sm leading-relaxed">
                Ajusta tus preferencias por género para recibir mejores
                recomendaciones. Usa la escala de -1 (odio) a 1 (me encanta).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {genres.map((genre) => (
                <div key={genre} className="group">
                  <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-bold text-slate-800">
                        {genre}
                      </label>
                      {!editingPreferences && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getPreferenceColor(
                            preferences[genre]
                          )}`}
                        >
                          {getPreferenceLabel(preferences[genre])}
                        </span>
                      )}
                    </div>

                    {editingPreferences ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="range"
                            min="-1"
                            max="1"
                            step="0.1"
                            value={preferences[genre] || 0}
                            onChange={(e) =>
                              handlePreferenceChange(genre, e.target.value)
                            }
                            className="w-full h-3 bg-gradient-to-r from-red-200 via-slate-200 to-green-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span className="font-medium">Odio</span>
                            <span className="font-medium">Neutral</span>
                            <span className="font-medium">Me encanta</span>
                          </div>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <span
                            className={`text-sm font-bold ${getPreferenceColor(
                              preferences[genre]
                            )}`}
                          >
                            {preferences[genre]?.toFixed(1)} -{" "}
                            {getPreferenceLabel(preferences[genre])}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-4 rounded-full transition-all duration-500 ${
                            preferences[genre] >= 0
                              ? "bg-gradient-to-r from-green-400 to-green-500 shadow-lg"
                              : "bg-gradient-to-r from-red-400 to-red-500 shadow-lg"
                          }`}
                          style={{
                            width: `${Math.abs(preferences[genre]) * 50 + 50}%`,
                            marginLeft:
                              preferences[genre] < 0
                                ? `${(1 + preferences[genre]) * 50}%`
                                : "0",
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {editingPreferences && (
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setEditingPreferences(false)}
                  className="px-6 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePreferences}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Guardando...</span>
                    </span>
                  ) : (
                    "Guardar Preferencias"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
