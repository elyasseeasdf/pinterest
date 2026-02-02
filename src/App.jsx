import React, { useState } from 'react';
import './App.css';
import PinCard from './components/PinCard';
import BulkUploadModal from './components/BulkUploadModal';
import EditPinModal from './components/EditPinModal';

const App = () => {
  const [pins, setPins] = useState(() => {
    const saved = localStorage.getItem('pinterest_pins');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading pins", e);
        return [];
      }
    }
    return [];
  });

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Track verified extensions separately from pin objects
  const [verifiedExtensions, setVerifiedExtensions] = useState(() => {
    const saved = localStorage.getItem('pinterest_verified_extensions');
    return saved ? JSON.parse(saved) : {};
  });

  const saveExtensionsToStorage = (updatedExtensions) => {
    localStorage.setItem('pinterest_verified_extensions', JSON.stringify(updatedExtensions));
  };

  const saveToStorage = (updatedPins) => {
    localStorage.setItem('pinterest_pins', JSON.stringify(updatedPins));
  };

  const handleBulkUpload = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      const pinsArray = Array.isArray(data) ? data : [data];

      const normalizedPins = pinsArray.map(pin => ({
        id: crypto.randomUUID(),
        filename: pin.filename || '',
        title: pin.Title || '',
        description: pin.Description || pin["**Description**"] || '',
        board: pin.Board || pin["**Pinterest board**"] || '',
        publishDate: pin.PublishDate || pin["**Publish date**"] || '',
        imagePrompt: pin["image prompt"] || pin.ImagePrompt || '',
        keywords: pin.Keywords || pin["**Keywords**"] || [],
      }));

      const newPinsList = [...pins, ...normalizedPins];
      setPins(newPinsList);
      saveToStorage(newPinsList);
      setIsBulkModalOpen(false);
    } catch (e) {
      alert("Invalid JSON format. Please check your data.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this pin?")) {
      const updated = pins.filter(p => p.id !== id);
      setPins(updated);
      saveToStorage(updated);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("CRITICAL: Are you sure you want to delete EVERY pin? This cannot be undone.")) {
      setPins([]);
      saveToStorage([]);
    }
  };

  const handleEdit = (pin) => {
    setCurrentPin({ ...pin });
    setIsEditModalOpen(true);
  };

  const saveEdit = () => {
    const updated = pins.map(p => p.id === currentPin.id ? currentPin : p);
    setPins(updated);
    saveToStorage(updated);
    setIsEditModalOpen(false);
    setCurrentPin(null);
  };

  const exportToCsv = () => {
    if (pins.length === 0) return;

    // Pinterest Bulk Upload Headers
    const headers = [
      "Title",
      "Description",
      "Media URL",
      "Link",
      "Pinterest Board",
      "Publish Date",
      "Keywords",
      "Alt Text"
    ];

    const rows = pins.map(pin => {
      const imageUrl = getImageUrl(pin) || "";
      return [
        `"${pin.title.replace(/"/g, '""')}"`,
        `"${pin.description.replace(/"/g, '""')}"`,
        `"${imageUrl}"`,
        `""`, // Link (can be empty or a destination URL)
        `"${pin.board.replace(/"/g, '""')}"`,
        `"${pin.publishDate}"`,
        `"${(Array.isArray(pin.keywords) ? pin.keywords.join(', ') : "").replace(/"/g, '""')}"`,
        `"${(pin.imagePrompt || "").replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "pinterest_bulk_upload.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectExtension = (pinId, ext) => {
    setVerifiedExtensions(prev => {
      const updated = { ...prev, [pinId]: ext };
      saveExtensionsToStorage(updated);
      return updated;
    });
  };

  const getImageUrl = (pin, forcedExt = null) => {
    if (!pin || !pin.filename) return '';

    const repoPath = 'https://raw.githubusercontent.com/elyasseeasdf/pinterest-images/refs/heads/main/';
    const verified = forcedExt || verifiedExtensions[pin.id];

    if (verified === 'FAILED') return 'https://via.placeholder.com/400x600?text=Image+Not+Found';

    const nameWithoutExt = pin.filename.includes('.')
      ? pin.filename.substring(0, pin.filename.lastIndexOf('.'))
      : pin.filename;

    if (verified) {
      return `${repoPath}${nameWithoutExt}${verified}?raw=true`;
    }

    // If no verification and no forced extension, check if filename has one
    if (pin.filename.includes('.')) {
      return `${repoPath}${pin.filename}?raw=true`;
    }

    // Default to .png if nothing else
    return `${repoPath}${pin.filename}.png?raw=true`;
  };

  const [filteredPins, setFilteredPins] = useState([]);

  React.useEffect(() => {
    setFilteredPins(
      pins.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.filename.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [pins, searchTerm]);

  // Handle body scroll locking
  React.useEffect(() => {
    if (isBulkModalOpen || isEditModalOpen) {
      document.body.classList.add('body-lock');
    } else {
      document.body.classList.remove('body-lock');
    }
  }, [isBulkModalOpen, isEditModalOpen]);

  return (
    <>
      <div className="container animate-fade-in">
        <header>
          <div className="brand">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.17-.1-.94-.19-2.39.04-3.41.21-.92 1.34-5.69 1.34-5.69s-.34-.68-.34-1.69c0-1.58.92-2.76 2.06-2.76 0.97 0 1.44.73 1.44 1.61 0 .98-.62 2.44-.94 3.79-.27 1.13.57 2.06 1.68 2.06 2.02 0 3.57-2.13 3.57-5.21 0-2.73-1.96-4.63-4.75-4.63-3.24 0-5.14 2.43-5.14 4.93 0 .98.38 2.02.85 2.59.09.11.1.21.07.33l-.32 1.31c-.05.21-.16.26-.37.16-1.39-.65-2.26-2.67-2.26-4.3 0-3.5 2.54-6.72 7.34-6.72 3.85 0 6.85 2.74 6.85 6.42 0 3.83-2.41 6.91-5.76 6.91-1.12 0-2.18-.58-2.54-1.27l-.69 2.63c-.25.96-.92 2.16-1.37 2.89C10.23 23.83 11.11 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
            </svg>
            PinGen
          </div>

          <div className="search-wrapper">
            <svg style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search your pins..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {pins.length > 0 && (
              <button className="btn btn-secondary" style={{ color: '#ff4d4d' }} onClick={handleClearAll}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Clear
              </button>
            )}
            <button className="btn btn-secondary" onClick={exportToCsv}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l3 3 3-3m-3 3V3"></path>
              </svg>
              Export
            </button>
            <button className="btn btn-primary" onClick={() => setIsBulkModalOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Bulk Upload
            </button>
          </div>
        </header>

        <main>
          <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Library</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You have {pins.length} pins ready for export</p>
            </div>
          </div>

          {pins.length === 0 ? (
            <div className="empty-state animate-fade-in">
              <div style={{ padding: '2rem', background: 'rgba(230, 0, 35, 0.05)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No pins yet</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto 2rem' }}>
                Upload your JSON data to start generating Pinterest-optimized CSV files.
              </p>
              <button className="btn btn-primary" onClick={() => setIsBulkModalOpen(true)}>
                Get Started
              </button>
            </div>
          ) : (
            <div className="pin-grid">
              {filteredPins.map((pin) => (
                <PinCard
                  key={pin.id}
                  pin={pin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  getImageUrl={getImageUrl}
                  onSelectExtension={handleSelectExtension}
                  verifiedExtension={verifiedExtensions[pin.id]}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onUpload={handleBulkUpload}
      />

      <EditPinModal
        isOpen={isEditModalOpen}
        pin={currentPin}
        onChange={setCurrentPin}
        onClose={() => setIsEditModalOpen(false)}
        onSave={saveEdit}
      />
    </>
  );
};

export default App;
