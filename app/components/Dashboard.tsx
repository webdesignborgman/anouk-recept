'use client'

import { useState, ChangeEvent } from 'react'

export interface DashboardItem {
  id: string
  name: string
  category: string
  fileType: 'pdf' | 'image'
  fileUrl: string
  createdAt: any
  userId: string
  tags?: string[]
}

interface DashboardListProps {
  items: DashboardItem[]
  onDelete: (id: string, fileUrl: string) => void
  onEdit: (item: DashboardItem) => void
}

export default function DashboardList({ items, onDelete, onEdit }: DashboardListProps) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
  }

  const categories = Array.from(
    new Set(items.map((item) => item.category).filter(Boolean))
  )

  const filteredItems = items.filter((item) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      item.name.toLowerCase().includes(searchLower) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(searchLower))

    const matchesCategory = selectedCategory ? item.category === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  return (
    <div>
      {/* Zoekveld */}
      <input
        type="text"
        placeholder="Zoeken op naam of tags..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 mb-4 border rounded shadow-sm"
      />

      {/* Categorie dropdown */}
      {categories.length > 0 && (
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-2 mb-4 border rounded shadow-sm bg-white"
        >
          <option value="">Alle categorieën</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      )}

      {/* Resultaten */}
      {filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <div key={item.id} className="mb-4 p-4 border rounded shadow-sm bg-white">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500">Categorie: {item.category}</p>

            {item.tags && (
              <div className="mt-1 text-xs text-gray-400">
                Tags: {item.tags.join(', ')}
              </div>
            )}

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
              >
                Bewerken
              </button>
              <button
                onClick={() => onDelete(item.id, item.fileUrl)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded"
              >
                Verwijderen
              </button>
            </div>
          </div>
        ))
      ) : searchQuery || selectedCategory ? (
        <p>Geen resultaten gevonden.</p>
      ) : (
        <p>Je hebt nog geen recepten.</p>
      )}
    </div>
  )
}
