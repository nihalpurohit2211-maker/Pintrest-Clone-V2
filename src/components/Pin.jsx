import { useState, useEffect } from "react";
import "./Pin.css";

function Pin({ photo, onPinClick }) {
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        let savedPhotos = JSON.parse(localStorage.getItem("saved")) || [];
        setSaved(savedPhotos.includes(photo.id));
    }, [photo.id]);

    function savePhoto(e) {
        e.stopPropagation(); // Prevents opening the modal when clicking save
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

    // Low-resolution URL optimization for high performance feed
    const lowResUrl = `${photo.image}?auto=format&fit=crop&w=500&q=30`;

    return (
        <div className="pin" onClick={() => onPinClick(photo)}>
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

                <button className="menu" onClick={(e) => e.stopPropagation()}>
                    ⋮
                </button>
            </div>
        </div>
    );
}

export default Pin;