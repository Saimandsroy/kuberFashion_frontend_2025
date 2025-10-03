import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      if (state.items.some(item => item.id === action.payload.id)) {
        return state; // Item already in wishlist
      }
      const newStateAdd = {
        ...state,
        items: [...state.items, action.payload]
      };
      localStorage.setItem('wishlist', JSON.stringify(newStateAdd.items));
      return newStateAdd;

    case 'REMOVE_FROM_WISHLIST':
      const newStateRemove = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
      localStorage.setItem('wishlist', JSON.stringify(newStateRemove.items));
      return newStateRemove;

    case 'CLEAR_WISHLIST':
      localStorage.removeItem('wishlist');
      return {
        ...state,
        items: []
      };

    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: []
  });
  const { isAuthenticated } = useAuth();

  // Load wishlist from backend on mount if authenticated
  useEffect(() => {
    const loadWishlist = async () => {
      if (isAuthenticated) {
        try {
          const response = await wishlistAPI.getWishlist();
          if (response.data?.success) {
            const items = response.data.data || [];
            dispatch({ type: 'LOAD_WISHLIST', payload: items });
          }
        } catch (error) {
          console.error('Failed to load wishlist:', error);
          // Fallback to localStorage
          const savedWishlist = localStorage.getItem('wishlist');
          if (savedWishlist) {
            dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) });
          }
        }
      } else {
        // Load from localStorage for guest users
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          try {
            const parsedWishlist = JSON.parse(savedWishlist);
            dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist });
          } catch (error) {
            console.error('Error loading wishlist from localStorage:', error);
          }
        }
      }
    };
    loadWishlist();
  }, [isAuthenticated]);

  const addToWishlist = async (product) => {
    if (isAuthenticated) {
      try {
        await wishlistAPI.addItem(product.id);
        dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
      }
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        await wishlistAPI.removeItem(productId);
        dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
      }
    } else {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    }
  };

  const clearWishlist = async () => {
    if (isAuthenticated) {
      try {
        await wishlistAPI.clearWishlist();
        dispatch({ type: 'CLEAR_WISHLIST' });
      } catch (error) {
        console.error('Failed to clear wishlist:', error);
      }
    } else {
      dispatch({ type: 'CLEAR_WISHLIST' });
    }
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const value = {
    wishlistItems: state.items,
    wishlistCount: state.items.length,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
