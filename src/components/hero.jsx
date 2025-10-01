import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Button } from './Button';  
import { InfiniteSlider } from './InfiniteSlider';  
import { cn } from '../lib/utils'; 
import { Menu, X, ShoppingBag, User, Heart, Search, Bell, MapPin, ChevronDown, Settings, LogOut } from 'lucide-react';
import ProgressiveBlur from './ProgressiveBlur';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../hooks/useAuth';

export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="mt-16">
        {/* Hero Banner Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Main Hero Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-12 sm:py-16 lg:py-20 min-h-[calc(80vh-4rem)]">
              {/* Left Content */}
              <div className="flex flex-col justify-center space-y-8 px-2 sm:px-4 lg:px-0">
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center rounded-full bg-white border-2 border-[#FF4081] px-6 py-2.5 text-sm font-semibold text-[#FF4081] shadow-sm hover:shadow-md hover:bg-[#FF4081] hover:text-white transition-all duration-300 mt-2">
                    <span className="mr-2 text-base">🔥</span>
                    Big Fashion Sale - Up to 80% OFF
                  </div>
                  
                  <div className="space-y-2 sm:space-y-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7.5xl font-bold tracking-tight text-[#1a1a1a] leading-[1.1] font-sans">
                      <span className="block">Fashion That</span>
                      <span className="text-[#047BD2] bg-clip-text bg-gradient-to-r from-[#047BD2] to-[#00B4D8]">Makes You</span>
                    </h1>
                    
                    <p className="text-base sm:text-lg md:text-xl text-[#4B5563] max-w-xl leading-relaxed font-sans font-light tracking-wide">
                      Discover premium fashion collections with exclusive designs and unbeatable prices.
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <Button asChild className="bg-[#047BD2] hover:bg-[#0369A1] text-white px-8 py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-body">
                    <Link to="/shop" className="flex items-center justify-center space-x-2">
                      <span>Shop Now</span>
                      <ShoppingBag className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-2 border-[#FF4081] text-[#FF4081] hover:bg-[#FF4081] hover:text-white px-8 py-4 text-base sm:text-lg rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-body">
                    <Link to="/categories" className="flex items-center justify-center space-x-2">
                      <span>Explore Categories</span>
                      <Search className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                {/* Popular Searches */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm sm:text-base text-[#666666] font-medium font-body">Popular:</span>
                  {['Shirts', 'Jeans', 'Dresses', 'Shoes', 'Accessories'].map((item) => (
                    <Link
                      key={item}
                      to={`/search?q=${item.toLowerCase()}`}
                      className="text-sm sm:text-base text-[#047BD2] hover:text-[#0369A1] hover:bg-blue-50 px-3 py-1 rounded-full transition-all duration-200 font-medium font-body"
                    >
                      {item}
                    </Link>
                  ))}
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-[#666666] pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="font-medium">10M+ Happy Customers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="font-medium">500+ Brands</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="font-medium">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative order-first lg:order-last">
                <div className="aspect-square lg:aspect-auto lg:h-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Fashion Collection"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Offers */}
                  <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-gradient-to-r from-[#FF4081] to-[#E91E63] text-white px-4 py-3 rounded-xl text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    50% OFF
                  </div>
                  
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    <div className="text-xs sm:text-sm text-[#666666] font-medium">Starting from</div>
                    <div className="text-lg sm:text-xl font-bold text-[#1a1a1a]">₹299</div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-1/2 left-0 w-4 h-4 bg-[#047BD2] rounded-full opacity-70 animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="absolute top-1/3 right-0 w-3 h-3 bg-[#FF4081] rounded-full opacity-70 animate-bounce" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-[#10B981] rounded-full opacity-70 animate-bounce" style={{animationDelay: '2s'}}></div>
                </div>
              </div>
            </div>

           
          </div>
        </section>

       
      </main>
    </>
  );
}



const menuItems = [
  { name: 'Men', href: '/categories/mens-fashion' },
  { name: 'Women', href: '/categories/womens-fashion' },
  { name: 'Kids', href: '/categories/kids-fashion' },
  { name: 'Shoes', href: '/categories/footwear' },
  { name: 'Accessories', href: '/categories/accessories' },
  { name: 'Sports', href: '/categories/sports-active' },
];


const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {user?.profile?.first_name || user?.email?.split('@')[0] || 'User'}
          </p>
          <p className="text-xs text-gray-500">My Account</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.profile?.first_name && user?.profile?.last_name
                      ? `${user.profile.first_name} ${user.profile.last_name}`
                      : user?.email}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
              
              <Link
                to="/cart"
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>My Orders</span>
              </Link>
              
              <Link
                to="/wishlist"
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-4 w-4" />
                <span>Wishlist</span>
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100 py-2">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false);
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleMobileLogout = async () => {
    await logout();
    navigate('/');
    setMenuState(false);
  };
  
  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#047BD2] text-white text-xs py-1.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="font-body">Deliver to 400708</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 font-body">
              <span>Download App</span>
              <span>|</span>
              <span>Become a Seller</span>
              <span>|</span>
              <span>Customer Care</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Left Section: Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <KuberFashionLogo />
              </Link>
            </div>

            {/* Center Section: Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 items-center justify-center px-8 mr-25">
              <div className="w-full max-w-2xl ml-25">
                <div className="relative group">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Search for products, brands and more"
                      className="w-full h-[42px] px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#047BD2] focus:border-[#047BD2] font-body text-[#1a1a1a] transition-all duration-200"
                    />
                    <Button className="h-[42px] bg-[#047BD2] hover:bg-[#0369A1] px-6 rounded-l-none rounded-r-lg group-hover:bg-[#0369A1] transition-all duration-200 hover:shadow-md">
                      <Search className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Icons */}
            <div className="flex items-center space-x-6">
              {/* Conditional Login/Profile */}
              {loading ? (
                <div className="hidden lg:flex items-center space-x-1 px-3 py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              ) : isAuthenticated ? (
                <div className="hidden lg:block">
                  <UserProfileDropdown />
                </div>
              ) : (
                <Button asChild variant="ghost" className="hidden lg:flex items-center space-x-1 text-[#047BD2] hover:text-[#0369A1] hover:bg-blue-50 transition-all duration-200">
                  <Link to="/login">
                    <User className="h-5 w-5" />
                    <span className="font-medium font-body">Login</span>
                  </Link>
                </Button>
              )}

              {/* More Dropdown */}
              <div className="hidden sm:flex items-center space-x-6 text-sm">
               
                <Link to="/wishlist" className="flex items-center space-x-1 hover:text-[#047BD2] transition-colors">
                  <Heart className={`h-4 w-4 ${wishlistCount > 0 ? 'fill-current text-red-500' : ''}`} />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-[#1a1a1a] hover:text-[#047BD2] transition-colors duration-200">
                <ShoppingBag className="h-6 w-6" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF4081] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium font-body">
                    {cart.totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuState(!menuState)}
                className="lg:hidden p-2 text-[#1a1a1a] hover:text-[#047BD2] transition-colors duration-200"
              >
                {menuState ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <div className="relative group">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#047BD2] focus:border-[#047BD2] font-body text-[#1a1a1a] transition-all duration-200"
                />
                <Button className="bg-[#047BD2] hover:bg-[#0369A1] px-6 rounded-l-none rounded-r-lg group-hover:bg-[#0369A1] transition-all duration-200">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="hidden lg:block bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 py-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-[#1a1a1a] hover:text-[#047BD2] transition-colors duration-200 font-body relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#047BD2] transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuState && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-[#1a1a1a] hover:text-[#047BD2] font-medium font-body py-2 transition-colors duration-200"
                onClick={() => setMenuState(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="block text-[#047BD2] hover:text-[#0369A1] font-medium font-body py-2 transition-colors duration-200"
                    onClick={() => setMenuState(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleMobileLogout}
                    className="block text-red-600 hover:text-red-700 font-medium font-body py-2 transition-colors duration-200 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block text-[#047BD2] hover:text-[#0369A1] font-medium font-body py-2 transition-colors duration-200"
                  onClick={() => setMenuState(false)}
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const KuberFashionLogo = () => {
  return (
    <div className="flex  items-center space-x-3 ">
      <div className="flex flex-col justify-center ">
        <div className="text-xl font-bold text-[#047BD2] font-body leading-tight whitespace-nowrap ">
          KuberFashion
        </div>
        <div className="text-xs text-[#666666] font-body -mt-0.5 ">Fashion Store</div>
      </div>
    </div>
  );
};

 
