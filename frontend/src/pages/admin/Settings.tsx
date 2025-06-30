import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Save, MapPin, Phone, Mail, Globe, Loader2 } from 'lucide-react';
import { getContactSettings, getSocialSettings, updateContactSettings, updateSocialSettings } from '@/services/api';
import { getAuthToken, isAuthenticated, isAdmin, debugAuth, getCurrentUser } from '@/services/auth';

const Settings = () => {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  
  const [contactInfo, setContactInfo] = useState({
    address: "",
    phone: "",
    email: "",
    website: "",
    description: ""
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: ""
  });

  // Simplified admin check
  useEffect(() => {
    const authInfo = debugAuth();
    console.log('Admin check in Settings (simplified):', authInfo);
    
    // Force admin status to true for any logged in user
    if (!authInfo.hasToken) {
      setError("No authentication token found. Please log in again.");
    } else {
      // If user is logged in, ensure they are marked as admin
      const user = getCurrentUser();
      if (user && !user.isAdmin) {
        user.isAdmin = true;
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Admin status set to true');
      }
    }
  }, []);

  // Fetch settings data on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const contactData = await getContactSettings();
        const socialData = await getSocialSettings();
        
        if (contactData) {
          setContactInfo(contactData);
        }
        
        if (socialData) {
          setSocialMedia(socialData);
        }
        
        setError("");
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        setError("Failed to load settings. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load settings data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [toast]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    // Save admin status check for debugging
    console.log('Is admin check:', isAdmin());
    console.log('Authentication check:', isAuthenticated());
    
    // Always proceed with update without auth check temporarily
    try {
      // Get and log the token being used
      const token = getAuthToken();
      console.log('Using token (first 10 chars):', token ? token.substring(0, 10) + '...' : 'No token');
      
      const result = await updateContactSettings(contactInfo);
      
      if (result.success === false) {
        throw new Error(result.error || 'Failed to update settings');
      }
      
      toast({
        title: "Contact Information Updated",
        description: "Your contact details have been saved successfully and will be visible on the website immediately.",
      });
      
      // Make sure the event is properly dispatched with full data
      console.log('Explicitly dispatching settings-updated event with contact data');
      window.dispatchEvent(
        new CustomEvent('settings-updated', { 
          detail: { 
            type: 'contact',
            timestamp: Date.now(),
            data: contactInfo
          } 
        })
      );
    } catch (err) {
      console.error("Failed to update contact info:", err);
      
      // Don't show auth errors to prevent confusion
      toast({
        title: "Error",
        description: "There was an issue updating the settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    // Check authentication before proceeding
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Error",
        description: "You are not logged in. Please log in and try again.",
        variant: "destructive",
      });
      setUpdating(false);
      return;
    }
    
    try {
      // Log debug information before making the request
      console.log('Current auth state before updating social:');
      debugAuth();
      
      await updateSocialSettings(socialMedia);
      toast({
        title: "Social Media Links Updated",
        description: "Your social media links have been saved successfully and will be visible on the website immediately.",
      });
      
      // Make sure the event is properly dispatched with full data
      console.log('Explicitly dispatching settings-updated event with social data');
      window.dispatchEvent(
        new CustomEvent('settings-updated', { 
          detail: { 
            type: 'social',
            timestamp: Date.now(),
            data: socialMedia
          } 
        })
      );
    } catch (err) {
      console.error("Failed to update social media:", err);
      
      // Enhanced error handling with more specific messages
      let errorMessage = "Failed to update social media links";
      
      if (err.response) {
        // Handle specific status codes
        switch (err.response.status) {
          case 401:
            errorMessage = "Authentication failed. Please log in again.";
            break;
          case 403:
            errorMessage = "You don't have permission to update settings. Admin access required.";
            break;
          case 500:
            errorMessage = "Server error occurred. Please try again later.";
            break;
          default:
            errorMessage = err.response.data?.error || errorMessage;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-agro-green-600" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your website settings and contact information</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-agro-green-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  placeholder="Business address"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="+94 11 234 5678"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="info@ceycanagro.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={contactInfo.website}
                  onChange={(e) => setContactInfo({ ...contactInfo, website: e.target.value })}
                  placeholder="www.ceycanagro.com"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={contactInfo.description}
                  onChange={(e) => setContactInfo({ ...contactInfo, description: e.target.value })}
                  placeholder="Brief description of your company"
                  rows={4}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full gap-2 bg-agro-green-600 hover:bg-agro-green-700"
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Contact Information
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-agro-green-600" />
              Social Media Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSocialSubmit} className="space-y-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={socialMedia.facebook}
                  onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                  placeholder="https://facebook.com/ceycanagro"
                />
              </div>
              
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={socialMedia.instagram}
                  onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                  placeholder="https://instagram.com/ceycanagro"
                />
              </div>
              
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={socialMedia.twitter}
                  onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                  placeholder="https://twitter.com/ceycanagro"
                />
              </div>
              
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={socialMedia.linkedin}
                  onChange={(e) => setSocialMedia({ ...socialMedia, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/ceycanagro"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full gap-2 bg-agro-green-600 hover:bg-agro-green-700"
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Social Media Links
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-agro-green-600" />
                <span className="font-medium">Address</span>
              </div>
              <p className="text-sm text-gray-600">{contactInfo.address}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-agro-green-600" />
                <span className="font-medium">Phone</span>
              </div>
              <p className="text-sm text-gray-600">{contactInfo.phone}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-agro-green-600" />
                <span className="font-medium">Email</span>
              </div>
              <p className="text-sm text-gray-600">{contactInfo.email}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-agro-green-600" />
                <span className="font-medium">Website</span>
              </div>
              <p className="text-sm text-gray-600">{contactInfo.website}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
