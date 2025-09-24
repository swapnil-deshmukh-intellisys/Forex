import React, { useState } from 'react';
import LogoPng from '../assets/Logo.png';
import { authAPI } from '../services/api';

const SignUpPage = ({ onSignUp, onBackToSignIn }) => {
   const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Account type
    accountType: 'Standard',
    email: '',
    password: '',
    repeatPassword: '',
    
    // Step 2: Personal details
    fullName: '',
    fatherName: '',
    motherName: '',
    gender: '',
    dateOfBirth: '',
    mobileCode: '+91',
    mobileNumber: '',
    
    // Step 3: Address details
    country: '',
    state: '',
    city: '',
    postalCode: '',
    streetAddress: '',
    
    // Step 4: Terms and conditions
    termsAccepted: false,
    privacyAccepted: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [errors, setErrors] = useState({});


  const steps = [
    { title: 'Account type', description: 'Choose your account type and create credentials' },
    { title: 'Personal details', description: 'Enter your personal information' },
    { title: 'Address details', description: 'Provide your address information' },
    { title: 'Terms and Conditions', description: 'Review and accept terms' }
  ];

  const accountTypes = [
    { value: 'Standard', label: 'Standard' },
    { value: 'Platinum', label: 'Platinum' },
    { value: 'Premium', label: 'Premium' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];



  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'IN', label: 'India' },
    { value: 'CN', label: 'China' },
    { value: 'JP', label: 'Japan' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'AU', label: 'Australia' }
  ];

  const mobileCodes = [
    { value: '+1', label: '+1', country: 'United States' },
    { value: '+44', label: '+44', country: 'United Kingdom' },
    { value: '+91', label: '+91', country: 'India' },
    { value: '+86', label: '+86', country: 'China' },
    { value: '+81', label: '+81', country: 'Japan' },
    { value: '+49', label: '+49', country: 'Germany' },
    { value: '+33', label: '+33', country: 'France' },
    { value: '+61', label: '+61', country: 'Australia' }
  ];

  const indianStates = [
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'CT', label: 'Chhattisgarh' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JH', label: 'Jharkhand' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'ML', label: 'Meghalaya' },
    { value: 'MZ', label: 'Mizoram' },
    { value: 'NL', label: 'Nagaland' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'SK', label: 'Sikkim' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TG', label: 'Telangana' },
    { value: 'TR', label: 'Tripura' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'UT', label: 'Uttarakhand' },
    { value: 'WB', label: 'West Bengal' },
    { value: 'AN', label: 'Andaman and Nicobar Islands' },
    { value: 'CH', label: 'Chandigarh' },
    { value: 'DN', label: 'Dadra and Nagar Haveli and Daman and Diu' },
    { value: 'DL', label: 'Delhi' },
    { value: 'JK', label: 'Jammu and Kashmir' },
    { value: 'LA', label: 'Ladakh' },
    { value: 'LD', label: 'Lakshadweep' },
    { value: 'PY', label: 'Puducherry' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };





  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0: // Account type
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!formData.repeatPassword) newErrors.repeatPassword = 'Please repeat your password';
        else if (formData.password !== formData.repeatPassword) newErrors.repeatPassword = 'Passwords do not match';
        break;

      case 1: // Personal details
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.fatherName) newErrors.fatherName = 'Father name is required';
        if (!formData.motherName) newErrors.motherName = 'Mother name is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
        else if (formData.mobileNumber.length < 10) newErrors.mobileNumber = 'Please enter a valid mobile number';
        break;

      case 2: // Address details
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
        if (!formData.streetAddress) newErrors.streetAddress = 'Full address is required';
        break;

      case 3: // Terms and conditions
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'You must accept the privacy policy';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
  if (e) e.preventDefault();

  if (validateStep(currentStep)) {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submit
      handleSubmit(e);
    }
  }
};

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

   const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await authAPI.signup(formData);
      setSuccessMessage("🎉 Registered Successfully!");
      setTimeout(() => {
        onBackToSignIn();
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || "Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Offers</label>
              <div className="relative">
              <select
                value={formData.accountType}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-hover-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all appearance-none"
              >
                {accountTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

                         <div>
               <label className="block text-sm font-medium text-text-secondary mb-2">Your email</label>
               <input
                 type="email"
                 value={formData.email}
                 onChange={(e) => handleInputChange('email', e.target.value)}
                 className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all"
                 placeholder="Enter your email"
               />
               {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
             </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all pr-12"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Repeat password</label>
                <div className="relative">
                  <input
                    type={showRepeatPassword ? "text" : "password"}
                    value={formData.repeatPassword}
                    onChange={(e) => handleInputChange('repeatPassword', e.target.value)}
                    className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all pr-12"
                    placeholder="Repeat password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary"
                  >
                    {showRepeatPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.repeatPassword && <p className="text-red-500 text-sm mt-1">{errors.repeatPassword}</p>}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Father Name</label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all"
                  placeholder="Enter father's name"
                />
                {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Mother Name</label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                  className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all"
                  placeholder="Enter mother's name"
                />
                {errors.motherName && <p className="text-red-500 text-sm mt-1">{errors.motherName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Gender</label>
                <div className="relative">
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 pr-10 bg-hover-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all appearance-none"
                >
                  <option value="">Select gender</option>
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Date of Birth</label>
                <div 
                  className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-lg text-text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-accent-color/50 focus-within:border-transparent transition-all cursor-pointer hover:bg-opacity-80 relative"
                  onClick={() => {
                    const input = document.getElementById('dateOfBirthInput');
                    // Check if we're on mobile and adjust viewport
                    if (window.innerWidth <= 768) {
                      // Scroll to center the input in viewport
                      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      // Small delay to ensure scroll completes before opening picker
                      setTimeout(() => {
                        input.showPicker?.() || input.focus();
                      }, 100);
                    } else {
                      input.showPicker?.() || input.focus();
                    }
                  }}
                >
                <input
                    id="dateOfBirthInput"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full bg-transparent border-none outline-none cursor-pointer"
                    style={{ 
                      colorScheme: 'dark',
                      position: 'relative',
                      zIndex: 1
                    }}
                  />
                </div>
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>
            </div>

                         <div>
               <label className="block text-sm font-medium text-text-secondary mb-2">Mobile Number</label>
               <div className="flex space-x-2 min-w-0">
                 <div className="relative">
                 <select
                   value={formData.mobileCode}
                   onChange={(e) => handleInputChange('mobileCode', e.target.value)}
                     className="w-16 sm:w-20 flex-shrink-0 px-2 py-3 pr-6 bg-hover-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all text-center text-sm appearance-none"
                   title={mobileCodes.find(code => code.value === formData.mobileCode)?.country}
                 >
                   {mobileCodes.map(code => (
                     <option key={code.value} value={code.value} title={code.country}>{code.label}</option>
                   ))}
                 </select>
                   <div className="absolute top-1/2 right-1 transform -translate-y-1/2 pointer-events-none">
                     <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                     </svg>
                   </div>
                 </div>
                 <input
                   type="tel"
                   value={formData.mobileNumber}
                   onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                   className="flex-1 min-w-0 px-3 py-3 bg-hover-bg border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all text-sm"
                   placeholder="Enter mobile number"
                 />
               </div>
               {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
             </div>




          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Country</label>
                <div className="relative">
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-3 pr-10 bg-hover-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all appearance-none"
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>{country.label}</option>
                  ))}
                </select>
                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>

                             <div>
                 <label className="block text-sm font-medium text-text-secondary mb-2">State</label>
                 <div className="relative">
                 <select
                   value={formData.state}
                   onChange={(e) => handleInputChange('state', e.target.value)}
                     className="w-full px-4 py-3 pr-10 bg-hover-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all appearance-none"
                 >
                   <option value="">Select state</option>
                   {indianStates.map(state => (
                     <option key={state.value} value={state.value}>{state.label}</option>
                   ))}
                 </select>
                   <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                     </svg>
                   </div>
                 </div>
                 {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all"
                  placeholder="Enter city"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Postal/Zip code</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all"
                  placeholder="Enter postal code"
                />
                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Full address</label>
              <input
                type="text"
                value={formData.streetAddress}
                onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all"
                placeholder="Enter Full address"
              />
              {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
            </div>
          </div>
                 );

       case 3:
        return (
          <div className="space-y-6">
            <div className="bg-bg-secondary p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Terms and Conditions</h3>
              <div className="text-sm text-text-secondary space-y-4 max-h-64 overflow-y-auto">
                <p>
                  By creating an account with Express Forex, you agree to the following terms and conditions:
                </p>
                <p>
                  1. You must be at least 18 years old to create an account and use our services.
                </p>
                <p>
                  2. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
                <p>
                  3. You agree to provide accurate and complete information during registration.
                </p>
                <p>
                  4. Express Forex reserves the right to modify these terms at any time.
                </p>
                <p>
                  5. Trading involves substantial risk and may not be suitable for all investors.
                </p>
                <p>
                  6. Past performance does not guarantee future results.
                </p>
                <p>
                  7. You acknowledge that you have read and understood our risk disclosure statement.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                  className="mt-1 h-4 w-4 text-accent-color focus:ring-accent-color border-gray-300 rounded"
                />
                <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                  I have read and agree to the <span className="text-accent-color font-medium">Terms and Conditions</span>
                </label>
              </div>
              {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
                  className="mt-1 h-4 w-4 text-accent-color focus:ring-accent-color border-gray-300 rounded"
                />
                <label htmlFor="privacyAccepted" className="text-sm text-gray-700">
                  I have read and agree to the <span className="text-accent-color font-medium">Privacy Policy</span>
                </label>
              </div>
              {errors.privacyAccepted && <p className="text-red-500 text-sm">{errors.privacyAccepted}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button fixed to viewport top-left */}
      <div className="fixed top-4 left-4 z-20">
        <button
          type="button"
          onClick={onBackToSignIn}
          className="flex items-center justify-center text-text-secondary hover:text-text-primary bg-card-bg/50 backdrop-blur-sm border border-border-color rounded-xl p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="max-w-md w-full space-y-6">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center">
              {/* Soft blurred white background behind logo */}
              <div className="absolute -inset-2 rounded-2xl bg-white blur-md" />
              <img src={LogoPng} alt="Express Forex" className="relative w-32 h-auto object-contain" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-accent-color mb-2">
            Open real account
          </h2>
          <p className="text-text-secondary text-sm">
            Fill out registration form
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-card-bg rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Step Title and Progress */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-accent-color mb-2">
              {steps[currentStep].title}
            </h3>
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded ₹{
                    index <= currentStep ? 'bg-accent-color' : 'bg-border-color'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 space-x-3">
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                className="flex-1 px-3 sm:px-6 py-3 border border-accent-color text-accent-color rounded-lg hover:bg-accent-color/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
  type={currentStep === steps.length - 1 ? "submit" : "button"}
  onClick={(e) => handleNextStep(e)}  // ✅ Pass event
  className="flex-1 px-3 sm:px-6 py-3 bg-accent-color text-text-quaternary rounded-lg hover:bg-accent-color/90 transition-colors text-sm sm:text-base font-medium flex items-center justify-center"
>
  {currentStep === steps.length - 1 ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )}
</button>
            </div>

            {/* Log In Link */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={onBackToSignIn}
                className="text-accent-color hover:text-accent-color/80 transition-all duration-300 text-sm font-medium flex items-center justify-center mx-auto space-x-2 hover:scale-105 group"
              >
                <span>Login</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-text-primary text-sm">
            © Express Forex
          </p>
          <p className="text-text-secondary text-xs">
            Contact us at{' '}
            <a href="mailto:support@expressforex.com" className="text-accent-color hover:text-accent-color/80">
              support@expressforex.com
            </a>{' '}
            if you encounter any problems. Version: v.1.13.0-828
          </p>
        </div>
      </div>
    </div>
  );
};



export default SignUpPage;
