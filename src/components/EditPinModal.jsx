import React from 'react';

const EditPinModal = ({ isOpen, pin, onClose, onSave, onChange }) => {
    if (!isOpen || !pin) return null;

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
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Edit Pin Details</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Update the information for this pin below.</p>
                </div>

                <div className="modal-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label>Filename</label>
                            <input value={pin.filename} onChange={e => onChange({ ...pin, filename: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Title</label>
                            <input value={pin.title} onChange={e => onChange({ ...pin, title: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Description</label>
                            <textarea rows="3" value={pin.description} onChange={e => onChange({ ...pin, description: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Board</label>
                            <input value={pin.board} onChange={e => onChange({ ...pin, board: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Publish Date</label>
                            <input type="datetime-local" value={pin.publishDate} onChange={e => onChange({ ...pin, publishDate: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Keywords (comma separated)</label>
                            <input
                                value={Array.isArray(pin.keywords) ? pin.keywords.join(', ') : ''}
                                onChange={e => onChange({ ...pin, keywords: e.target.value.split(',').map(s => s.trim()) })}
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Image Prompt</label>
                            <textarea rows="2" value={pin.imagePrompt} onChange={e => onChange({ ...pin, imagePrompt: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: 'auto' }}>
                    <button className="btn btn-secondary" onClick={onClose}>Discard</button>
                    <button className="btn btn-primary" onClick={onSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditPinModal;
