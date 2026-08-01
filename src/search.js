async function searchPhotos(word, onResultFound) {
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

export default searchPhotos;