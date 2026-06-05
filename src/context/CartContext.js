"use client"
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [mounted, setMounted] = useState(false)

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('lrh_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart data")
      }
    }
    setMounted(true)
  }, [])

  // Save to local storage when items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('lrh_cart', JSON.stringify(items))
    }
  }, [items, mounted])

  const addToCart = (product, quantity = 1, variant = null, addons = []) => {
    setItems(prevItems => {
      // Create a unique hash for the item based on ID, variant, and addons
      const addonIds = addons.map(a => a.id).sort().join(',')
      const cartItemId = `${product.id}-${variant?.id || 'base'}-${addonIds}`
      
      const existingItemIndex = prevItems.findIndex(item => item.cartItemId === cartItemId)
      
      if (existingItemIndex >= 0) {
        const newItems = [...prevItems]
        newItems[existingItemIndex].quantity += quantity
        return newItems
      } else {
        return [...prevItems, {
          cartItemId,
          product,
          variant,
          addons,
          quantity
        }]
      }
    })
  }

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId)
      return
    }
    setItems(prevItems => 
      prevItems.map(item => 
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeFromCart = (cartItemId) => {
    setItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId))
  }

  const clearCart = () => setItems([])

  const totalItems = items.length
  
  const calculateItemTotal = (item) => {
    let itemPrice = item.variant ? item.variant.price : item.product.price
    let addonsPrice = item.addons.reduce((addSum, add) => addSum + add.price, 0)
    let totalAddons = addonsPrice * item.quantity

    let productTotal = 0
    if (!item.variant && item.product.packPrice && item.product.packQty) {
      const packs = Math.floor(item.quantity / item.product.packQty)
      const singles = item.quantity % item.product.packQty
      productTotal = (packs * item.product.packPrice) + (singles * itemPrice)
    } else {
      productTotal = itemPrice * item.quantity
    }

    return productTotal + totalAddons
  }

  const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0)

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart,
      totalItems,
      subtotal,
      calculateItemTotal,
      mounted
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
