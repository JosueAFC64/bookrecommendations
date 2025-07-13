"use client"

import { useAuth } from "../contexts/AuthContext"
import Navbar from "./Navbar"
import LoadingSpinner from "./LoadingSpinner"

const Layout = ({ children }) => {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto">{children}</main>
    </div>
  )
}

export default Layout
