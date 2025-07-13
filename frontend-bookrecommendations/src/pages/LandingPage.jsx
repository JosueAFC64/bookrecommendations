const LandingPage = () => {
  const isAuthenticated = false; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative text-center py-20 px-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-20"></div>
              <div className="relative bg-white p-4 rounded-full shadow-lg">
                <BookOpen className="h-12 w-12 text-purple-600" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Descubre tu próxima
            <br />
            <span className="relative">
              lectura perfecta
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
            </span>
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Sistema inteligente de recomendaciones de libros basado en tus gustos, historial de lectura y la comunidad de
            lectores.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Ver Recomendaciones
                </button>
                <button className="bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-300 text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Explorar Catálogo
                </button>
              </>
            ) : (
              <>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Comenzar Gratis
                </button>
                <button className="bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-300 text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Explorar Libros
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ¿Por qué elegir nuestra plataforma?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center h-full">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-yellow-100 to-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Star className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Recomendaciones Inteligentes</h3>
                <p className="text-gray-600 leading-relaxed">Algoritmos avanzados que aprenden de tus gustos y preferencias de lectura.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center h-full">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-green-100 to-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Catálogo Extenso</h3>
                <p className="text-gray-600 leading-relaxed">
                  Miles de libros organizados por género, autor y calificaciones de la comunidad.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center h-full">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-pink-100 to-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-rose-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Comunidad de Lectores</h3>
                <p className="text-gray-600 leading-relaxed">Conecta con otros lectores, comparte reseñas y descubre nuevas perspectivas.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center h-full">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-indigo-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Seguimiento de Progreso</h3>
                <p className="text-gray-600 leading-relaxed">Mantén un registro de tu historial de lectura y progreso personal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"white\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z\"/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
              
              <div className="relative p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  ¿Listo para encontrar tu próximo libro favorito?
                </h2>
                
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Únete a nuestra comunidad de lectores y recibe recomendaciones personalizadas.
                </p>
                
                <button className="bg-white text-purple-600 hover:bg-gray-50 text-lg px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Crear Cuenta Gratuita
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;