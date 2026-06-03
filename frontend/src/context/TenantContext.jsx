import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5240/api';
const TenantContext = createContext();

export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }) => {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [whyChooseUs, setWhyChooseUs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch restaurant
        const restaurantRes = await fetch(`${API}/Restaurant/${slug}`);
        if (!restaurantRes.ok) {
          if (restaurantRes.status === 404) {
            navigate('/');
            return;
          }
          throw new Error('Failed to fetch restaurant');
        }
        const restaurantData = await restaurantRes.json();
        setRestaurant(restaurantData);

        // Fetch menu categories
        const categoriesRes = await fetch(`${API}/Restaurant/${slug}/menu-categories`);
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setMenuCategories(categoriesData);
        }

        // Fetch menu items
        const itemsRes = await fetch(`${API}/Restaurant/${slug}/menu-items`);
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setMenuItems(itemsData);
        }

        // Fetch gallery
        const galleryRes = await fetch(`${API}/Restaurant/${slug}/gallery`);
        if (galleryRes.ok) {
          const galleryData = await galleryRes.json();
          setGallery(galleryData);
        }

        // Fetch reviews
        const reviewsRes = await fetch(`${API}/Restaurant/${slug}/reviews`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        }

        // Fetch Why Choose Us
        const whyChooseUsRes = await fetch(`${API}/Restaurant/${slug}/why-choose-us`);
        if (whyChooseUsRes.ok) {
          const whyChooseUsData = await whyChooseUsRes.json();
          setWhyChooseUs(whyChooseUsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug, navigate]);

  const value = {
    restaurant,
    menuItems,
    menuCategories,
    gallery,
    reviews,
    whyChooseUs,
    loading,
    error
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
