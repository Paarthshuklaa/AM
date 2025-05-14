import React, { useState } from 'react';

const AccessibilityReport = ({ data }) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  // Calculate the total issues count
  const totalIssues = 
    data.errors.length + 
    data.warnings.length + 
    data.notices.length;

  // Calculate compliance score - simple implementation
  // More sophisticated scoring would consider severity, standards, etc.
  const complianceScore = Math.max(
    0, 
    Math.round(100 - ((data.errors.length * 5 + data.warnings.length * 2) / 
    Math.max(1, totalIssues)) * 100)
  );
  
  const getScoreColorClass = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderIssuesList = (issues, type) => {
    if (issues.length === 0) {
      return (
        <div className="p-4 text-green-600">
          No {type} found. Great job!
        </div>
      );
    }

    return (
      <ul className="divide-y divide-gray-200">
        {issues.map((issue, index) => (
          <li key={index} className="py-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-start">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                  type === 'errors' ? 'bg-red-100 text-red-600' : 
                  type === 'warnings' ? 'bg-yellow-100 text-yellow-600' : 
                  'bg-blue-100 text-blue-600'
                }`}>
                  {type === 'errors' ? '!' : 
                   type === 'warnings' ? '⚠' : 'i'}
                </span>
                <h3 className="font-medium">{issue.title}</h3>
              </div>
              <p className="text-gray-600 ml-8">{issue.description}</p>
              {issue.selector && (
                <div className="ml-8 mt-2">
                  <p className="text-sm font-medium text-gray-700">Element:</p>
                  <code className="block p-2 mt-1 text-sm bg-gray-100 rounded overflow-x-auto">
                    {issue.selector}
                  </code>
                </div>
              )}
              {issue.recommendation && (
                <div className="ml-8 mt-2">
                  <p className="text-sm font-medium text-gray-700">Recommendation:</p>
                  <p className="text-sm text-gray-600">{issue.recommendation}</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          Accessibility Report: {data.url}
        </h2>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700">Compliance Score</h3>
            <p className={`text-3xl font-bold ${getScoreColorClass(complianceScore)}`}>
              {complianceScore}/100
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700">Issues Found</h3>
            <div className="flex space-x-4 mt-2">
              <div>
                <span className="block text-2xl font-bold text-red-600">
                  {data.errors.length}
                </span>
                <span className="text-sm text-gray-500">Errors</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-yellow-600">
                  {data.warnings.length}
                </span>
                <span className="text-sm text-gray-500">Warnings</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-blue-600">
                  {data.notices.length}
                </span>
                <span className="text-sm text-gray-500">Notices</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700">Standards Checked</h3>
            <div className="mt-2">
              <span className="inline-block px-2 py-1 mr-1 mb-1 text-xs font-medium bg-gray-200 rounded">
                WCAG 2.1 AA
              </span>
              <span className="inline-block px-2 py-1 mr-1 mb-1 text-xs font-medium bg-gray-200 rounded">
                Section 508
              </span>
              <span className="inline-block px-2 py-1 mr-1 mb-1 text-xs font-medium bg-gray-200 rounded">
                ARIA
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'summary'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'errors'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Errors ({data.errors.length})
          </button>
          <button
            onClick={() => setActiveTab('warnings')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'warnings'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Warnings ({data.warnings.length})
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'notices'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Notices ({data.notices.length})
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'summary' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Accessibility Overview
            </h3>
            <p className="mb-4 text-gray-600">
              This report provides an analysis of accessibility issues found on the website.
              The analysis is based on automated tests and may not capture all accessibility issues.
            </p>
            
            <h4 className="font-medium text-gray-900 mt-6 mb-2">
              Critical Issues
            </h4>
            {data.errors.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-600">
                {data.errors.slice(0, 3).map((issue, i) => (
                  <li key={i} className="mb-1">{issue.title}</li>
                ))}
                {data.errors.length > 3 && (
                  <li className="text-blue-600 cursor-pointer" onClick={() => setActiveTab('errors')}>
                    + {data.errors.length - 3} more errors
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-green-600">No critical issues found!</p>
            )}
            
            <h4 className="font-medium text-gray-900 mt-6 mb-2">
              Recommendations
            </h4>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <p className="text-blue-700">
                Consider reviewing all errors and warnings for a more accessible website.
                Fixing these issues will improve the experience for users with disabilities.
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'errors' && renderIssuesList(data.errors, 'errors')}
        {activeTab === 'warnings' && renderIssuesList(data.warnings, 'warnings')}
        {activeTab === 'notices' && renderIssuesList(data.notices, 'notices')}
      </div>
    </div>
  );
};

export default AccessibilityReport;