'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function MigrateDisplayPage() {
  const [content, setContent] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [fileName, setFileName] = useState('');

  const showContent = async () => {
    try {
      const response = await fetch('/api/migrate-display');
      const data = await response.json();
      setContent(data.content);
      
      // Extract uid from the researchDocData object
      const uidMatch = data.content.match(/const researchDocData = {\s*"type": "[^"]+",\s*"uid": "([^"]+)"/);
      const uid = uidMatch ? uidMatch[1] : 'migrate2';
      setFileName(uid);
      
      setIsVisible(true);
      setCopySuccess('');
    } catch (error) {
      console.error('Error fetching content:', error);
      alert('Error loading content. Please try again.');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      setCopySuccess('Failed to copy');
    }
  };

  const downloadContent = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${month}-${day}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datePrefix}-${fileName}.mjs`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <>
      <Navbar />
      <div>
        <div style={{ margin: '20px' }}>
          <button 
            onClick={showContent}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Show migrate2.mjs with JSON Content
          </button>
          {isVisible && (
            <>
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: copySuccess ? '#4CAF50' : '#ffffff',
                  marginRight: '10px'
                }}
              >
                {copySuccess || 'Copy to Clipboard'}
              </button>
              <button
                onClick={downloadContent}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Download as {`${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}-${fileName}.mjs`}
              </button>
            </>
          )}
        </div>
        <pre
          style={{
            display: isVisible ? 'block' : 'none',
            whiteSpace: 'pre',
            fontFamily: 'monospace',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            marginTop: '20px',
            overflowX: 'auto'
          }}
        >
          {content}
        </pre>
      </div>
    </>
  );
}
