import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard, Truck, Shield, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
  {
    label: 'Shop',
    links: [
      { title: 'New Arrivals', href: '/new-arrivals' },
      { title: 'Best Sellers', href: '/best-sellers' },
      { title: 'Sale', href: '/sale' },
      { title: 'Trending Now', href: '/trending' },
    ],
  },
  {
    label: 'Customer Service',
    links: [
      { title: 'Contact Us', href: '/contact' },
      { title: 'FAQs', href: '/faqs' },
      { title: 'Shipping & Returns', href: '/shipping' },
      { title: 'Track Order', href: '/track-order' },
    ],
  },
  {
    label: 'About Us',
    links: [
      { title: 'Our Story', href: '/about' },
      { title: 'Careers', href: '/careers' },
      { title: 'Blog', href: '/blog' },
      { title: 'Press', href: '/press' },
    ],
  },
  {
    label: 'Legal',
    links: [
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms & Conditions', href: '/terms' },
      { title: 'Cookie Policy', href: '/cookie-policy' },
      { title: 'Sitemap', href: '/sitemap' },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over $50' },
  { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Shield, title: 'Secure Payment', description: '100% secure payment' },
  { icon: CreditCard, title: 'Flexible Payment', description: 'Multiple payment options' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      {/* Features */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-blue-50 p-3 rounded-full">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand and description */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">KuberFashion</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Your one-stop destination for the latest fashion trends. We offer high-quality clothing, accessories, and more for the modern individual.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">support@kuberfashion.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-600">123 Fashion St, New York, NY 10001</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-gray-500"
                  aria-label={social.label}
                >
                  <span className="sr-only">{social.label}</span>
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                {section.label}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} KuberFashion. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-gray-500 hover:text-gray-700">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
