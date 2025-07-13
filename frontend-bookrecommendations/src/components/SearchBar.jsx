"use client"

import { useState } from "react"
import { Search } from "lucide-react"

const SearchBar = ({ onSearch, placeholder = "Buscar libros..." }) => {
  const [searchData, setSearchData] = useState({
    title: "",
    author: "",
    genre: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchData)
  }

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            name="title"
            value={searchData.title}
            onChange={handleChange}
            placeholder="Título del libro"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
          <input
            type="text"
            name="author"
            value={searchData.author}
            onChange={handleChange}
            placeholder="Nombre del autor"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
          <input
            type="text"
            name="genre"
            value={searchData.genre}
            onChange={handleChange}
            placeholder="Género literario"
            className="input-field"
          />
        </div>

        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Buscar</span>
          </button>
        </div>
      </div>
    </form>
  )
}

export default SearchBar
