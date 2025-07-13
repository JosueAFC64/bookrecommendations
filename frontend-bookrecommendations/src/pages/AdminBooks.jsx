"use client";

import { useState, useEffect } from "react";
import { booksAPI, filesAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import BookCard from "../components/BookCard";
import { Plus, Search, Edit, Trash2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    publication_year: "",
    pages: "",
    isbn: "",
    cover_url: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [creatingBook, setCreatingBook] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await booksAPI.getAll();
      setBooks(response.data);
    } catch (error) {
      toast.error("Error al cargar los libros");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor selecciona un archivo de imagen válido");
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen debe ser menor a 5MB");
        return;
      }
      
      setSelectedImage(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    
    setUploadingImage(true);
    try {
      const response = await filesAPI.uploadImage(selectedImage);
      const filename = response.data.filename;
      setFormData(prev => ({
        ...prev,
        cover_url: filename
      }));
      toast.success("Imagen subida exitosamente");
    } catch (error) {
      toast.error("Error al subir la imagen");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      cover_url: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingBook(true);

    try {
      let finalCoverUrl = formData.cover_url;

      // Si hay una imagen seleccionada pero no se ha subido, subirla primero
      if (selectedImage && !formData.cover_url) {
        try {
          setUploadingImage(true);
          const response = await filesAPI.uploadImage(selectedImage);
          finalCoverUrl = response.data.filename;
          toast.success("Imagen subida exitosamente");
        } catch (uploadError) {
          toast.error("Error al subir la imagen");
          console.error(uploadError);
          setCreatingBook(false);
          setUploadingImage(false);
          return; // No continuar si falla la subida de imagen
        } finally {
          setUploadingImage(false);
        }
      }

      const bookData = {
        ...formData,
        cover_url: finalCoverUrl,
        publication_year: formData.publication_year
          ? Number.parseInt(formData.publication_year)
          : null,
        pages: formData.pages ? Number.parseInt(formData.pages) : null,
      };

      console.log("Datos del libro a crear:", bookData); // Para debugging

      await booksAPI.create(bookData);
      toast.success("Libro creado exitosamente");
      setShowCreateForm(false);
      setFormData({
        title: "",
        author: "",
        genre: "",
        description: "",
        publication_year: "",
        pages: "",
        isbn: "",
        cover_url: "",
      });
      setSelectedImage(null);
      setImagePreview(null);
      loadBooks();
    } catch (error) {
      console.error("Error al crear el libro:", error);
      toast.error("Error al crear el libro");
    } finally {
      setCreatingBook(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Administración de Libros
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Gestiona el catálogo de libros de la plataforma
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
              <span>Agregar Libro</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Buscar libros por título, autor o género..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200 text-slate-900 placeholder-slate-400 shadow-sm hover:shadow-md"
          />
        </div>

        {/* Create Book Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                <Plus className="h-6 w-6 text-blue-600" />
                <span>Agregar Nuevo Libro</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all duration-200"
                    placeholder="Título del libro"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Autor *
                  </label>
                  <input
                    type="text"
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all duration-200"
                    placeholder="Nombre del autor"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Género *
                  </label>
                  <input
                    type="text"
                    name="genre"
                    required
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all duration-200"
                    placeholder="Género literario"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Año de Publicación
                  </label>
                  <input
                    type="number"
                    name="publication_year"
                    value={formData.publication_year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all duration-200"
                    placeholder="2023"
                    min="1000"
                    max="2030"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Número de Páginas
                  </label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all duration-200"
                    placeholder="300"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    ISBN
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all duration-200"
                    placeholder="978-0123456789"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Portada
                </label>
                
                {imagePreview && (
                  <div className="relative mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-40 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Input de archivo */}
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                  >
                    <Upload className="h-5 w-5 text-slate-400 mr-2" />
                    <span className="text-slate-600">
                      {selectedImage ? selectedImage.name : "Seleccionar imagen"}
                    </span>
                  </label>
                  
                  {/* Mostrar nombre del archivo seleccionado */}
                  {selectedImage && (
                    <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        📁 Imagen seleccionada: {selectedImage.name}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        La imagen se subirá automáticamente al crear el libro
                      </p>
                    </div>
                  )}
                  
                  {/* Mostrar nombre del archivo subido */}
                  {formData.cover_url && (
                    <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        ✓ Imagen subida: {formData.cover_url}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all duration-200 resize-none"
                  placeholder="Descripción del libro..."
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingBook}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center space-x-2"
                >
                  {creatingBook ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{uploadingImage ? "Subiendo imagen..." : "Creando libro..."}</span>
                    </>
                  ) : (
                    <span>Crear Libro</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Books List */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <span>Libros</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {filteredBooks.length}
              </span>
            </h2>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-slate-400" />
              </div>
              <p className="text-slate-500 text-xl font-medium">
                {searchTerm
                  ? "No se encontraron libros con ese criterio"
                  : "No hay libros en el catálogo"}
              </p>
              <p className="text-slate-400 mt-2">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza agregando tu primer libro"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div key={book.id} className="relative group">
                  <BookCard book={book} />
                  <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:bg-white border border-slate-200 transition-all duration-200 hover:scale-110"
                      title="Editar libro"
                    >
                      <Edit className="h-4 w-4 text-slate-600 hover:text-blue-600" />
                    </button>
                    <button
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:bg-white border border-slate-200 transition-all duration-200 hover:scale-110"
                      title="Eliminar libro"
                    >
                      <Trash2 className="h-4 w-4 text-slate-600 hover:text-red-600" />
                    </button>
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

export default AdminBooks;
