import { useState, useEffect } from "react";
import "./InfoMatrixCard.css";

function InfoMatrixCard({ photo, onClose }) {
    const [isHighResLoaded, setIsHighResLoaded] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const savedPhotos = JSON.parse(localStorage.getItem("saved")) || [];
        setSaved(savedPhotos.includes(photo.id));

        function handleKeyDown(e) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [photo.id, onClose]);

    function toggleSave(e) {
        e.stopPropagation();
        let savedPhotos = JSON.parse(localStorage.getItem("saved")) || [];

        if (savedPhotos.includes(photo.id)) {
            savedPhotos = savedPhotos.filter((id) => id !== photo.id);
            setSaved(false);
        } else {
            savedPhotos.push(photo.id);
            setSaved(true);
        }

        localStorage.setItem("saved", JSON.stringify(savedPhotos));
    }

    async function downloadImage(e) {
        e.stopPropagation();
        try {
            const response = await fetch(photo.image);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `pinterest-clone-${photo.id}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setShowMenu(false);
        } catch (error) {
            console.error("Image download failed:", error);
            window.open(photo.image, "_blank"); 
        }
    }

    // Mathematical helper to calculate fractional aspect ratio using GCD
    function getAspectRatio(w, h) {
        function gcd(a, b) {
            return b === 0 ? a : gcd(b, a % b);
        }
        const divisor = gcd(w, h);
        return `${w / divisor}/${h / divisor}`;
    }

    // Low-res placeholder for initial blur-up
    const lowResPlaceholder = `${photo.image}?auto=format&fit=crop&w=300&q=30`;
    
    // Scaled down to ~65% resolution and 65% quality to eliminate rendering lag
    const scaledWidth = Math.round((photo.width || 1200) * 0.65);
    const highResUrl = `${photo.image}?auto=format&fit=max&w=${scaledWidth}&q=65`;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="infomatrix-card" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}>
                <button className="close-btn" onClick={onClose}>✕</button>

                <div className="card-image-wrapper">
                    {!isHighResLoaded && (
                        <div className="placeholder-container">
                            <img src={lowResPlaceholder} alt="placeholder" className="blur-placeholder" />
                            <div className="spinner"></div>
                        </div>
                    )}
                    <img
                        src={highResUrl}
                        alt={photo.tags ? photo.tags.join(" ") : "Pin"}
                        className={`full-res-image ${isHighResLoaded ? "loaded" : "loading"}`}
                        onLoad={() => setIsHighResLoaded(true)}
                    />
                </div>

                <div className="card-details">
                    <div className="card-actions" style={{ position: "relative" }}>
                        <button 
                            className="menu-btn" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                        >
                            ⋮
                        </button>
                        
                        {/* Dropdown for the Modal */}
                        {showMenu && (
                            <div className="dropdown-menu" style={{ top: "45px", bottom: "auto", left: "0", right: "auto" }}>
                                <button className="dropdown-item" onClick={downloadImage}>
                                    Download Image
                                </button>
                            </div>
                        )}

                        <button
                            className={`save-btn ${saved ? "saved" : ""}`}
                            onClick={toggleSave}
                        >
                            {saved ? "Saved" : "Save"}
                        </button>
                    </div>

                    <div className="metadata-container">
                        <h2>InfoMatrix Card</h2>
                        <div className="meta-grid">
                            <div className="meta-item">
                                <span className="meta-label">Author</span>
                                <span className="meta-value">John Doe</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Photo ID</span>
                                <span className="meta-value">{photo.id}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Resolution</span>
                                <span className="meta-value">{photo.width} × {photo.height} px</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Aspect Ratio</span>
                                <span className="meta-value">{getAspectRatio(photo.width, photo.height)}</span>
                            </div>
                        </div>

                        <h3>Tags</h3>
                        <div className="tags-container">
                            {photo.tags && photo.tags.length > 0 ? (
                                photo.tags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="tag-chip">#{tag}</span>
                                ))
                            ) : (
                                <span className="no-tags">No tags available</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoMatrixCard;