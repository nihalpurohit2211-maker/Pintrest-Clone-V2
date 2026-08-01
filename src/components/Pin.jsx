import { useState, useEffect } from "react";
import "./Pin.css";

function Pin({ photo, onPinClick }) {
    const [saved, setSaved] = useState(false);
    const [showMenu, setShowMenu] = useState(false); // Controls the dropdown visibility

    useEffect(() => {
        let savedPhotos = JSON.parse(localStorage.getItem("saved")) || [];
        setSaved(savedPhotos.includes(photo.id));
    }, [photo.id]);

    function savePhoto(e) {
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

    // Advanced Download Logic to bypass Cross-Origin opening in a new tab
    async function downloadImage(e) {
        e.stopPropagation(); // Stop the pin from opening the InfoMatrix card
        try {
            // 1. Fetch the image as binary data (Blob)
            const response = await fetch(photo.image);
            const blob = await response.blob();
            
            // 2. Create a temporary local URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // 3. Create a temporary anchor element and force the click
            const link = document.createElement("a");
            link.href = url;
            link.download = `pinterest-clone-${photo.id}.jpg`;
            document.body.appendChild(link);
            link.click();
            
            // 4. Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setShowMenu(false); // Close the menu
        } catch (error) {
            console.error("Image download failed:", error);
            // Fallback just in case CORS blocks the fetch
            window.open(photo.image, "_blank"); 
        }
    }

    const lowResUrl = `${photo.image}?auto=format&fit=crop&w=500&q=75`;

    return (
        <div className="pin" onClick={() => onPinClick(photo)} onMouseLeave={() => setShowMenu(false)}>
            <img
                src={lowResUrl}
                alt={photo.tags ? photo.tags.join(" ") : ""}
                loading="lazy"
            />

            <div className="overlay">
                <button
                    className="save"
                    onClick={savePhoto}
                >
                    {saved ? "Saved" : "Save"}
                </button>

                <button 
                    className="menu" 
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                >
                    ⋮
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                    <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={downloadImage}>
                            Download Image
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Pin;