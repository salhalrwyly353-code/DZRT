"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: number
  productId: number
  nameAr: string
  nameEn: string
  strength: string
  price: number
  quantity: number
  imageUrl: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: any, quantity?: number) => void
  removeItem: (lineId: number) => void
  updateQuantity: (lineId: number, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getTotal: (shippingCost: number) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "dzrt_cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product: any, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.strength === product.strength,
      )
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [
        ...prev,
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          productId: product.id,
          nameAr: product.nameAr,
          nameEn: product.nameEn,
          strength: product.strength,
          price: Number.parseFloat(product.price),
          quantity,
          imageUrl: product.imageUrl,
        },
      ]
    })
  }

  const removeItem = (lineId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== lineId))
  }

  const updateQuantity = (lineId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(lineId)
      return
    }
    setItems((prev) => prev.map((item) => (item.id === lineId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getItemCount = () => {
    return items.reduce((acc, item) => acc + item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  }

  const getTotal = (shippingCost: number) => {
    return getSubtotal() + shippingCost
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
