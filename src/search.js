// Existing live search function
export async function searchPhotos(word, onResultFound) {
    let results = [];

    for (let i = 1; i <= 50; i++) {
        try {
            const res = await fetch(`/data/photos${i}.json`);
            const photos = await res.json();
            
            let batch = [];
            for (let photo of photos) {
                if (photo.tags.join(" ").toLowerCase().includes(word.toLowerCase())) {
                    batch.push(photo);
                    results.push(photo);
                }
            }
            
            if (batch.length > 0 && onResultFound) {
                onResultFound(batch);
            }
        } catch (error) {
            console.error(`Failed to fetch photos${i}.json`, error);
        }
    }

    return results;
}

// New helper function to load all saved photos by their IDs
export async function getSavedPhotos(savedIds) {
    if (!savedIds || savedIds.length === 0) return [];

    let matchedPhotos = [];
    let remainingIds = new Set(savedIds);

    for (let i = 1; i <= 50; i++) {
        if (remainingIds.size === 0) break; // Stop early if all saved photos are found

        try {
            const res = await fetch(`/data/photos${i}.json`);
            const photos = await res.json();

            for (let photo of photos) {
                if (remainingIds.has(photo.id)) {
                    matchedPhotos.push(photo);
                    remainingIds.delete(photo.id);
                }
            }
        } catch (error) {
            console.error(`Failed to fetch photos${i}.json`, error);
        }
    }

    return matchedPhotos;
}

export default searchPhotos;