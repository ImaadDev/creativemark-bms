"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { register } from "../../services/auth";
import { useTranslation } from "../../i18n/TranslationContext";

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    phoneCountryCode: "+966",
    nationality: "",
    residencyStatus: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countries, setCountries] = useState([]);


  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Fetch countries with their name, code (cca2), and calling code (idd)
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd");
        const data = await res.json();
  
        const sorted = data
          .map(c => {
            // Combine root and suffix to form the complete phone code (e.g., +966)
            const phoneCode = c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : "");
            return {
              name: c.name.common,
              code: c.cca2,
              phoneCode: phoneCode,
            }
          })
          .filter(c => c.phoneCode && c.name) // Filter out entries without a phone code or name
          .sort((a, b) => a.name.localeCompare(b.name));
          
        // Set countries with initial default selection logic if needed, but for now just populate
        setCountries(sorted);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
  
    fetchCountries();
  }, []);
  
  
  // --- START MODIFIED handleChange FUNCTION ---
  function handleChange(e) {
    const { name, value } = e.target;
    
    // Use functional state update for reliability
    setFormData(prev => {
      let updates = {
        [name]: value
      };

      // Logic to automatically set phoneCountryCode when nationality is selected
      if (name === "nationality") {
        const selectedCountry = countries.find(c => c.name === value);
        if (selectedCountry && selectedCountry.phoneCode) {
          // Add the phoneCode to the updates object
          updates.phoneCountryCode = selectedCountry.phoneCode;
        } else if (value === "") {
          // Reset to default or clear if nationality is reset
          updates.phoneCountryCode = ""; 
        }
      }

      return {
        ...prev,
        ...updates
      };
    });

    if (error) setError("");
    if (success) setSuccess("");
  }
  // --- END MODIFIED handleChange FUNCTION ---

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }

      // Prepare data for backend
      const registerData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        phoneCountryCode: formData.phoneCountryCode,
        nationality: formData.nationality,
        residencyStatus: formData.residencyStatus,
        password: formData.password,
        role: "client" // Always set role to client
      };

      // Call backend register API
      console.log("Sending register data:", registerData);
      const response = await register(registerData);
      console.log("Register response:", response);
      
      if (response.success) {
        setSuccess("Registration successful! Redirecting...");
        
        // Update AuthContext with user data
        updateUser(response.user);
        
        // Redirect to client dashboard after a short delay
        setTimeout(() => {
          router.push('/client');
        }, 2000);
      } else {
        setError(response.message || "Registration failed");
      }
      
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Helper function to get flag emoji from country code
  const getFlagEmoji = (countryCode) => {
    if (!countryCode) return "🏳️";
    // Standard function to convert 2-letter country code (e.g., SA) to flag emoji (🇸🇦)
    return countryCode
        .toUpperCase()
        .split('')
        .map(char => String.fromCodePoint(127397 + char.charCodeAt()))
        .join('');
  }

  // Find the selected country code to display the flag next to the phone code selector
  const currentPhoneCountry = countries.find(c => c.phoneCode === formData.phoneCountryCode);
  const currentNationalityCountry = countries.find(c => c.name === formData.nationality);
  const phoneFlagCode = currentPhoneCountry ? currentPhoneCountry.code : null;
  const nationalityFlagCode = currentNationalityCountry ? currentNationalityCountry.code : null;


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex relative overflow-hidden">
      

      {/* Left Side - Animated Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative overflow-hidden bg-gradient-to-br from-[#242021] via-[#2a2422] to-[#242021]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Circles */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#ffd17a]/10 animate-pulse"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-[#ffd17a]/20 animate-bounce delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-[#ffd17a]/5 animate-pulse delay-700"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-4 h-full p-8 transform rotate-12">
              {[...Array(64)].map((_, i) => (
                <div key={i} className="bg-[#ffd17a]/20 animate-pulse" style={{animationDelay: `${i * 100}ms`}}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-center text-white max-w-md">
            <div className="mb-8 animate-bounce">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#ffd17a]/20 rounded-2xl flex items-center justify-center shadow-lg">
                <img 
                  src="/CreativeMarkFavicon.png" 
                  alt="CreativeMark Logo" 
                  className="w-12 h-12 object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/48x48/242021/ffd17a?text=CM"; }}
                />
              </div>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold mb-6 animate-fade-in text-white">
              {t('auth.welcomeToTheFuture')}
            </h1>
            <p className="text-xl text-[#ffd17a] mb-8 animate-fade-in delay-300">
              {t('auth.createAccountJoinClients')}
            </p>
            
            {/* Animated Stats */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="text-center animate-fade-in delay-500 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold mb-2 text-[#ffd17a]">10K+</div>
                <div className='text-sm text-white/80'>{t('auth.happyClients')}</div>
              </div>
              <div className="text-center animate-fade-in delay-700 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold mb-2 text-[#ffd17a]">99.9%</div>
                <div className='text-sm text-white/80'>{t('auth.uptime')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="#ffd17a" fillOpacity="0.1">
              <animate attributeName="d" dur="10s" repeatCount="indefinite" 
                values="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z;M0,60 C300,0 900,120 1200,60 L1200,120 L0,120 Z;M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"/>
            </path>
          </svg>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-4 lg:p-0">
        <div className="w-full mx-auto">
          <div className="backdrop-blur-sm p-6 sm:p-8 lg:p-10 ring-1 ring-gray-100 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 bg-gradient-to-br from-[#242021] to-[#2a2422] rounded-xl sm:rounded-2xl shadow-lg animate-bounce">
                <img 
                  src="/CreativeMarkFavicon.png" 
                  alt="CreativeMark Logo" 
                  className="w-12 h-12 sm:w-8 sm:h-8 object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/48x48/242021/ffd17a?text=CM"; }}
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">{t('auth.createAccount')}</h2>
              <p className="text-gray-600 text-sm sm:text-base">{t('auth.joinUsStartJourney')}</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-green-800">{success}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl animate-shake">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-red-800">{error}</span>
                </div>
              </div>
            )}


            <form onSubmit={handleSubmit}>
              <div className="space-y-5 sm:space-y-6">
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-[#242021]">{t('auth.fullName')} *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder={t('auth.fullNamePlaceholder')}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base placeholder-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-[#242021]">{t('auth.email')} *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t('auth.emailPlaceholder')}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Phone with Country Code */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-[#242021]">{t('auth.phoneNumber')}</label>
                <div className="flex gap-2">
                  {/* Country Code Selector with Flag */}
                  <div className="relative flex-shrink-0">
                    <select
                      name="phoneCountryCode"
                      value={formData.phoneCountryCode}
                      onChange={handleChange}
                      className="w-40 px-3 py-3 sm:py-4 pl-10 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base appearance-none cursor-pointer"
                    >
                      <option value=''>{t('auth.code')}</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.phoneCode}>
                          {country.phoneCode} - {country.name}
                        </option>
                      ))}
                    </select>
                 
                    
                    {/* Dropdown Arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Phone Number Input */}
                  <div className="flex-1">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('auth.enterPhoneNumber')}
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Nationality Dropdown with Flag */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-[#242021]">{t('auth.nationality')}</label>
                <div className="relative">
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange} // This is the handler that triggers the phone code update
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 pl-12 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base appearance-none cursor-pointer"
                  >
                    <option value=''>{t('auth.selectNationality')}</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  
                
                  
                  {/* Dropdown Arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Residency Status */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-[#242021]">{t('auth.residencyStatus')}</label>
                <div className="relative">
                  <select
                  name="residencyStatus"
                  value={formData.residencyStatus}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base appearance-none cursor-pointer"
                >
                  <option value=''>{t('auth.selectResidencyStatus')}</option>
                  <option value='saudi'>{t('auth.saudi')}</option>
                  <option value='gulf'>{t('auth.gulfNational')}</option>
                  <option value='premium'>{t('auth.premiumResidency')}</option>
                  <option value='foreign'>{t('auth.foreign')}</option>
                </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-[#242021]">{t('auth.password')} *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base pr-12 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#242021] transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-[#242021]">{t('auth.confirmPassword')} *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base pr-12 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#242021] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 border-gray-300 rounded mt-0.5 focus:ring-[#ffd17a]/20 focus:ring-2"
                  style={{accentColor: '#ffd17a'}}
                />
                <label className="text-sm text-gray-700 leading-relaxed">
                  {t('auth.iAgreeToThe')} {" "}
                  <button type="button" className="font-semibold cursor-pointer text-[#242021] hover:text-[#242021]/80 hover:underline transition-colors">
                    {t('auth.termsAndConditions')}
                  </button>{" "}
                  {t('auth.and')} {" "}
                  <button type="button" className="font-semibold cursor-pointer text-[#242021] hover:text-[#242021]/80 hover:underline transition-colors">
                    {t('auth.privacyPolicy')}
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 cursor-pointer sm:py-4 font-bold text-white transition-all duration-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md text-sm sm:text-base ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#242021] hover:bg-[#242021]/90 focus:outline-none focus:ring-4 focus:ring-[#ffd17a]/20"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 cursor-pointer border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('auth.creatingAccount')}
                  </div>
                ) : (
                  t('auth.createAccountButton')
                )}
              </button>
              </div>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 sm:mt-8 text-center">
              <span className="text-gray-600">{t('auth.alreadyHaveAccount')} </span>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="font-semibold cursor-pointer text-[#242021] hover:text-[#242021]/80 hover:underline transition-colors"
              >
                {t('auth.signIn')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
      `}</style>
    </div>
  );
}
