'use client';

import { useState, FormEvent, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function MigratePage() {
  console.log('MigratePage component rendered');

  const [output, setOutput] = useState('Terminal output will appear here...');
  const [isLoading, setIsLoading] = useState(false);
  const [researchDocData, setResearchDocData] = useState('');
  const [researchBodyData, setResearchBodyData] = useState('');
  const [researchDocData_es, setResearchDocData_es] = useState('');
  const [researchBodyData_es, setResearchBodyData_es] = useState('');
  const [experts, setExperts] = useState('');
  const [experts_es, setExperts_es] = useState('');
  const [online, setOnline] = useState('');
  const [online_es, setOnline_es] = useState('');
  const [reddit, setReddit] = useState('');
  const [reddit_es, setReddit_es] = useState('');
  const [studies, setStudies] = useState('');
  const [studies_es, setStudies_es] = useState('');
  const [xmentions, setXmentions] = useState('');
  const [xmentions_es, setXmentions_es] = useState('');
  const [youtube, setYoutube] = useState('');
  const [youtube_es, setYoutube_es] = useState('');

  useEffect(() => {
    console.log('Form state updated');
  }, [
    researchDocData, researchBodyData, 
    researchDocData_es, researchBodyData_es,
    experts, experts_es,
    online, online_es,
    reddit, reddit_es,
    studies, studies_es,
    xmentions, xmentions_es,
    youtube, youtube_es
  ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setIsLoading(true);
    setOutput('Updating migration data...\n');
    console.log('Form submitted with data');

    try {
      const validateJsonData = (data: string, field: string) => {
        if (!data.trim()) {
          throw new Error(`Please provide JSON data for ${field}`);
        }
        try {
          return JSON.parse(data);
        } catch (error) {
          throw new Error(`Invalid JSON format for ${field}: ${error instanceof Error ? error.message : String(error)}`);
        }
      };

      const parseField = (value: string, field: string) => value.trim() ? validateJsonData(value, field) : null;

      const payload = {
        ...(parseField(researchDocData, 'researchDocData') && { researchDocData: parseField(researchDocData, 'researchDocData') }),
        ...(parseField(researchBodyData, 'researchBodyData') && { researchBodyData: parseField(researchBodyData, 'researchBodyData') }),
        ...(parseField(researchDocData_es, 'researchDocData_es') && { researchDocData_es: parseField(researchDocData_es, 'researchDocData_es') }),
        ...(parseField(researchBodyData_es, 'researchBodyData_es') && { researchBodyData_es: parseField(researchBodyData_es, 'researchBodyData_es') }),
        ...(parseField(experts, 'experts') && { experts: parseField(experts, 'experts') }),
        ...(parseField(experts_es, 'experts_es') && { experts_es: parseField(experts_es, 'experts_es') }),
        ...(parseField(online, 'online') && { online: parseField(online, 'online') }),
        ...(parseField(online_es, 'online_es') && { online_es: parseField(online_es, 'online_es') }),
        ...(parseField(reddit, 'reddit') && { reddit: parseField(reddit, 'reddit') }),
        ...(parseField(reddit_es, 'reddit_es') && { reddit_es: parseField(reddit_es, 'reddit_es') }),
        ...(parseField(studies, 'studies') && { studies: parseField(studies, 'studies') }),
        ...(parseField(studies_es, 'studies_es') && { studies_es: parseField(studies_es, 'studies_es') }),
        ...(parseField(xmentions, 'xmentions') && { xmentions: parseField(xmentions, 'xmentions') }),
        ...(parseField(xmentions_es, 'xmentions_es') && { xmentions_es: parseField(xmentions_es, 'xmentions_es') }),
        ...(parseField(youtube, 'youtube') && { youtube: parseField(youtube, 'youtube') }),
        ...(parseField(youtube_es, 'youtube_es') && { youtube_es: parseField(youtube_es, 'youtube_es') })
      };

      console.log('Parsed data:', payload);

      if (Object.keys(payload).length === 0) {
        throw new Error('At least one field must contain valid JSON data');
      }

      const response = await fetch('/api/run-migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('Server response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update migration data');
      }

      // Display storage type information
      const storageType = result.storageType === 'file' ? 'JSON files' : 'in-memory data';
      setOutput(prev => prev + `\nSuccess: ${result.message}`);
      setOutput(prev => prev + `\nStorage type: ${storageType}`);
      
      if (result.storageType === 'memory') {
        setOutput(prev => prev + '\nNote: Data is stored in memory and will be lost when the server restarts.');
      }
      
      setResearchDocData('');
      setResearchBodyData('');
      setResearchDocData_es('');
      setResearchBodyData_es('');
      setExperts('');
      setExperts_es('');
      setOnline('');
      setOnline_es('');
      setReddit('');
      setReddit_es('');
      setStudies('');
      setStudies_es('');
      setXmentions('');
      setXmentions_es('');
      setYoutube('');
      setYoutube_es('');
    } catch (error) {
      console.error('Error:', error);
      setOutput(prev => prev + `\nError: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="form-container">
      <h1>Migration Form</h1>
      <p className="description">
        Enter JSON arrays or objects to update the migration data. 
        In development mode, data is stored in JSON files. 
        In production (Vercel), data is stored in memory.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="researchDocData">researchDocData</label>
              <textarea
                id="researchDocData"
                name="researchDocData"
                value={researchDocData}
                onChange={(e) => {
                  console.log('Change event researchDoc');
                  setResearchDocData(e.target.value);
                }}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="researchBodyData">researchBodyData</label>
              <textarea
                id="researchBodyData"
                name="researchBodyData"
                value={researchBodyData}
                onChange={(e) => {
                  console.log('Change event researchBody');
                  setResearchBodyData(e.target.value);
                }}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="researchDocData_es">researchDocData_es</label>
              <textarea
                id="researchDocData_es"
                name="researchDocData_es"
                value={researchDocData_es}
                onChange={(e) => {
                  console.log('Change event researchDoc_es');
                  setResearchDocData_es(e.target.value);
                }}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="researchBodyData_es">researchBodyData_es</label>
              <textarea
                id="researchBodyData_es"
                name="researchBodyData_es"
                value={researchBodyData_es}
                onChange={(e) => {
                  console.log('Change event researchBody_es');
                  setResearchBodyData_es(e.target.value);
                }}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>
        </div>
        <div className="form-grid sources-grid">
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="experts">experts</label>
              <textarea
                id="experts"
                name="experts"
                value={experts}
                onChange={(e) => setExperts(e.target.value)}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="online">online</label>
              <textarea
                id="online"
                name="online"
                value={online}
                onChange={(e) => setOnline(e.target.value)}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="reddit">reddit</label>
              <textarea
                id="reddit"
                name="reddit"
                value={reddit}
                onChange={(e) => setReddit(e.target.value)}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="studies">studies</label>
              <textarea
                id="studies"
                name="studies"
                value={studies}
                onChange={(e) => setStudies(e.target.value)}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="xmentions">xmentions</label>
              <textarea
                id="xmentions"
                name="xmentions"
                value={xmentions}
                onChange={(e) => setXmentions(e.target.value)}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="youtube">youtube</label>
              <textarea
                id="youtube"
                name="youtube"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="experts_es">experts_es</label>
              <textarea
                id="experts_es"
                name="experts_es"
                value={experts_es}
                onChange={(e) => setExperts_es(e.target.value)}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="online_es">online_es</label>
              <textarea
                id="online_es"
                name="online_es"
                value={online_es}
                onChange={(e) => setOnline_es(e.target.value)}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="reddit_es">reddit_es</label>
              <textarea
                id="reddit_es"
                name="reddit_es"
                value={reddit_es}
                onChange={(e) => setReddit_es(e.target.value)}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="studies_es">studies_es</label>
              <textarea
                id="studies_es"
                name="studies_es"
                value={studies_es}
                onChange={(e) => setStudies_es(e.target.value)}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="xmentions_es">xmentions_es</label>
              <textarea
                id="xmentions_es"
                name="xmentions_es"
                value={xmentions_es}
                onChange={(e) => setXmentions_es(e.target.value)}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="youtube_es">youtube_es</label>
              <textarea
                id="youtube_es"
                name="youtube_es"
                value={youtube_es}
                onChange={(e) => setYoutube_es(e.target.value)}
                placeholder="Enter JSON array or object data"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>
        </div>
        <div className="button-group">
          <button
            type="submit"
            disabled={isLoading}
            onClick={() => console.log('Submit button clicked')}
          >
          {isLoading ? 'Updating...' : 'Update Migration Data'}
          </button>
        </div>
      </form>
        <div className="output">{output}</div>
      </div>
      <style jsx>{`
        .form-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .form-column {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .sources-grid {
          margin-top: 20px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        .description {
          margin-bottom: 20px;
          color: #666;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        textarea {
          width: 100%;
          height: 200px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
          font-family: monospace;
          resize: vertical;
          tab-size: 2;
          white-space: pre;
          overflow-wrap: normal;
          overflow-x: auto;
        }
        button {
          background: #0070f3;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
          min-width: 200px;
        }
        button:hover {
          background: #0051b3;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .output {
          margin-top: 20px;
          padding: 15px;
          background: #1e1e1e;
          color: #fff;
          border-radius: 4px;
          font-family: monospace;
          white-space: pre-wrap;
          min-height: 100px;
          max-height: 400px;
          overflow-y: auto;
        }
        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
