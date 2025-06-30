import { useState, useEffect } from 'react';
import { getContactSettings, getSocialSettings } from '@/services/api';

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now()); // Track last update time

  // Function to fetch the latest data
  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      console.log('Fetching fresh contact information...');
      
      // Fetch both contact info and social links
      const [contactData, socialData] = await Promise.all([
        getContactSettings(),
        getSocialSettings()
      ]);
      
      // Ensure businessHours exists in the data structure
      const enhancedContactData = {
        ...contactData,
        // Add businessHours if it doesn't exist
        businessHours: contactData.businessHours || {
          weekdays: "Monday – Friday: 9AM – 6PM",
          weekend: "Saturday - Sunday: 11AM – 3PM"
        }
      };
      
      // Combine the data with proper structure
      const combinedData = {
        ...enhancedContactData,
        social: socialData
      };
      
      console.log('Contact info updated:', combinedData);
      setContactInfo(combinedData);
      setLastUpdate(Date.now());
      setError(null);
    } catch (err) {
      console.error('Error loading contact information:', err);
      setError(err.message || 'Failed to load contact information');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchContactInfo();
  }, []);
  
  // Listen for settings updates and refresh data
  useEffect(() => {
    const handleSettingsUpdate = (event) => {
      console.log('Settings updated event detected in useContactInfo hook:', event.detail);
      setLastUpdate(Date.now()); // Update timestamp to force re-fetch
      fetchContactInfo();
    };
    
    // Add event listener
    window.addEventListener('settings-updated', handleSettingsUpdate);
    
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('settings-updated', handleSettingsUpdate);
    };
  }, []);

  return { contactInfo, loading, error, refetch: fetchContactInfo, lastUpdate };
}

export default useContactInfo;
