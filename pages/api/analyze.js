// File: pages/api/analyze.js
import axios from 'axios';
import cheerio from 'cheerio';

const checkForAccessibilityIssues = async (html) => {
  // This is a simplified implementation
  // In a real application, you would use a more comprehensive library
  // like axe-core, pa11y, or connect to a specialized service
  
  const $ = cheerio.load(html);
  const issues = {
    errors: [],
    warnings: [],
    notices: []
  };
  
  // Check for images without alt text
  $('img').each((i, elem) => {
    const alt = $(elem).attr('alt');
    if (!alt) {
      issues.errors.push({
        title: 'Image missing alt text',
        description: 'Images must have alt text to be accessible to screen reader users.',
        selector: getSelector(elem),
        recommendation: 'Add descriptive alt text to the image that conveys its purpose or content.'
      });
    } else if (alt.trim() === '') {
      issues.warnings.push({
        title: 'Image has empty alt text',
        description: 'Empty alt text should only be used for decorative images.',
        selector: getSelector(elem),
        recommendation: 'Add descriptive alt text or confirm the image is purely decorative.'
      });
    }
  });
  
  // Check for form inputs without labels
  $('input, select, textarea').each((i, elem) => {
    const id = $(elem).attr('id');
    const ariaLabel = $(elem).attr('aria-label');
    const ariaLabelledBy = $(elem).attr('aria-labelledby');
    
    if (!id && !ariaLabel && !ariaLabelledBy) {
      issues.errors.push({
        title: 'Form control without label',
        description: 'Form controls must be labeled to be accessible to screen reader users.',
        selector: getSelector(elem),
        recommendation: 'Add a label element with a "for" attribute that matches the input\'s id, or use aria-label/aria-labelledby.'
      });
    } else if (id && $(`label[for="${id}"]`).length === 0 && !ariaLabel && !ariaLabelledBy) {
      issues.errors.push({
        title: 'Form control with ID but no associated label',
        description: 'Form controls with IDs should have associated label elements.',
        selector: getSelector(elem),
        recommendation: 'Add a label element with a "for" attribute that matches the input\'s id.'
      });
    }
  });
  
  // Check heading hierarchy
  let previousLevel = 0;
  $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
    const level = parseInt(elem.name.charAt(1));
    
    if (i === 0 && level !== 1) {
      issues.warnings.push({
        title: 'First heading is not h1',
        description: 'The first heading on a page should usually be h1.',
        selector: getSelector(elem),
        recommendation: 'Change this heading to an h1 if it represents the main title of the page.'
      });
    }
    
    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.warnings.push({
        title: 'Skipped heading level',
        description: `Jumped from h${previousLevel} to h${level}, skipping at least one level.`,
        selector: getSelector(elem),
        recommendation: 'Maintain a proper heading hierarchy without skipping levels.'
      });
    }
    
    previousLevel = level;
  });
  
  // Check for color contrast (simplified placeholder)
  issues.notices.push({
    title: 'Color contrast not checked',
    description: 'This automated test cannot check color contrast, which is important for users with low vision.',
    recommendation: 'Use a tool like WebAIM\'s Contrast Checker to verify sufficient contrast ratios.'
  });
  
  // Check for semantic landmarks
  if ($('main').length === 0) {
    issues.warnings.push({
      title: 'No main landmark',
      description: 'Pages should have a main landmark to indicate the primary content area.',
      recommendation: 'Add a <main> element to wrap the main content of the page.'
    });
  }
  
  if ($('nav').length === 0) {
    issues.notices.push({
      title: 'No navigation landmark',
      description: 'Pages with navigation should use a nav element.',
      recommendation: 'Add a <nav> element to wrap navigation links.'
    });
  }
  
  return issues;
};

// Helper function to get a selector for an element (simplified)
const getSelector = (elem) => {
  const tagName = elem.name;
  const id = $(elem).attr('id');
  const className = $(elem).attr('class');
  
  if (id) {
    return `#${id}`;
  } else if (className) {
    return `.${className.replace(/\s+/g, '.')}`;
  } else {
    return tagName;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }
  
  try {
    // Fetch the HTML content of the URL
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Accessibility-Analyzer/1.0'
      },
      timeout: 10000 // 10 seconds timeout
    });
    
    const html = response.data;
    
    // Analyze the HTML for accessibility issues
    const issues = await checkForAccessibilityIssues(html);
    
    // Return the analysis result
    return res.status(200).json({
      url,
      timestamp: new Date().toISOString(),
      issues: {
        total: issues.errors.length + issues.warnings.length + issues.notices.length,
        errorCount: issues.errors.length,
        warningCount: issues.warnings.length,
        noticeCount: issues.notices.length
      },
      errors: issues.errors,
      warnings: issues.warnings,
      notices: issues.notices
    });
  } catch (error) {
    console.error('Error analyzing website:', error);
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(400).json({ message: 'Could not connect to the website. Please check the URL and try again.' });
    }
    
    if (error.response) {
      const statusCode = error.response.status;
      if (statusCode === 404) {
        return res.status(400).json({ message: 'Website not found (404). Please check the URL and try again.' });
      } else {
        return res.status(400).json({ message: `Website returned error (${statusCode}). Please try a different URL.` });
      }
    }
    
    return res.status(500).json({ message: 'Failed to analyze website. Please try again later.' });
  }
}