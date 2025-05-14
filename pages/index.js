import React, { useState } from 'react';
import URLInput from './components/URLInput';
import AccessibilityReport from './components/AccessibilityReport';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorDisplay from './components/ErrorDisplay';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  const analyzeWebsite = async (url) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze website');
      }
      
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Web Accessibility Analyzer
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Analyze websites for accessibility issues and get recommendations
          </p>
        </header>
        
        <URLInput onAnalyze={analyzeWebsite} isLoading={isLoading} />
        
        <div className="mt-8">
          {isLoading && <LoadingIndicator />}
          {error && <ErrorDisplay message={error} />}
          {report && <AccessibilityReport data={report} />}
        </div>
      </div>
    </div>
  );
};

export default App;