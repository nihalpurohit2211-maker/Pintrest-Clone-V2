import "./Navbar.css";
import "./Gallery.css";

import { useState, useEffect } from "react";

import Pin from "./components/Pin.jsx";
import InfoMatrixCard from "./components/InfoMatrixCard.jsx";
import searchPhotos from "./search.js";

function App() {
    const [photos, setPhotos] = useState([]);
    const [visible, setVisible] = useState(10);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // -------------------------
    // Load Random Feed
    // -------------------------
    function loadFeed() {
        const random = 43;
        setIsLoading(true);
        setPhotos([]);

        fetch(`/data/photos${random}.json`)
            .then((res) => res.json())
            .then((data) => {
                setPhotos(data);
                setVisible(20);
                window.scrollTo(0, 0);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    // Load feed once
    useEffect(() => {
        loadFeed();
    }, []);

    // -------------------------
    // Infinite Scroll
    // -------------------------
    useEffect(() => {
        function handleScroll() {
            const bottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 300;

            if (bottom) {
                if (visible < photos.length) {
                    setVisible((old) => old + 20);
                }
            }
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [visible, photos]);

    // -------------------------
    // Search
    // -------------------------
    async function startSearch() {
        if (search.trim() === "") {
            loadFeed();
            return;
        }

        setPhotos([]);
        setVisible(20);
        setIsLoading(true);
        window.scrollTo(0, 0);

        await searchPhotos(search, (newBatch) => {
            setPhotos((prev) => [...prev, ...newBatch]);
            setIsLoading(false);
        });

        setIsLoading(false);
    }

    return (
        <>
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">P</div>
                <button>Home</button>
                <button>Explore</button>
                <button>Create</button>
                <button>Message</button>
                <div className="bottom">
                    <button>Settings</button>
                </div>
            </div>

            {/* Navbar */}
            <div className="navbar">
                <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            startSearch();
                        }
                    }}
                />
                <div className="nav-right">
                    <button>🔔</button>
                </div>
            </div>

            {/* Gallery */}
            <div className="gallery">
                {photos.slice(0, visible).map((photo) => (
                    <Pin
                        key={photo.id}
                        photo={photo}
                        onPinClick={(p) => setSelectedPhoto(p)}
                    />
                ))}

                {/* Skeletons */}
                {isLoading &&
                    Array.from({ length: 10 }).map((_, i) => (
                        <div key={`skeleton-${i}`} className="skeleton-pin"></div>
                    ))}
            </div>

            {/* Pinterest InfoMatrix Card Modal */}
            {selectedPhoto && (
                <InfoMatrixCard
                    photo={selectedPhoto}
                    onClose={() => setSelectedPhoto(null)}
                />
            )}

            {/* End */}
            {!isLoading && visible >= photos.length && photos.length > 0 && (
                <h3
                    style={{
                        textAlign: "center",
                        padding: "30px"
                    }}
                >
                    End of Feed
                </h3>
            )}
        </>
    );
}

export default App;