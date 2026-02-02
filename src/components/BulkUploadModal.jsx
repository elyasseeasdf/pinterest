import React, { useState } from 'react';

const BulkUploadModal = ({ isOpen, onClose, onUpload }) => {
    const [bulkJson, setBulkJson] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onUpload(bulkJson);
        setBulkJson('');
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
            <div className="modal-content animate-slide-up">
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.5rem'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="modal-header">
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Bulk Data Import</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                        Paste your Pinterest JSON configuration array below to populate your library.
                    </p>
                </div>

                <div className="modal-body">
                    <textarea
                        className="json-textarea"
                        placeholder={`[
  {
    "filename": "healthy_lifestyle",
    "Title": "10 Tips for Healthy Living",
    "Description": "Start your journey today...",
    "Board": "Fitness",
    "PublishDate": "2026-03-02T09:00",
    "Keywords": ["health", "tips"]
  }
]`}
                        value={bulkJson}
                        onChange={(e) => setBulkJson(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: 'auto' }}>
                    <button className="btn btn-secondary" onClick={onClose}>Discard</button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Import {bulkJson ? 'Data' : ''}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkUploadModal;
