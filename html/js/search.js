const userSearch = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer'); // This is where the results will be displayed
const allItemCards = document.querySelectorAll('.itemCard'); // Grab all itemCards from the start

userSearch.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { 
        e.preventDefault(); // Prevent page refresh on Enter key press
    }
});

userSearch.addEventListener('keyup', e => {
    let currChar = e.target.value.toLowerCase();
    
    // Clear previous results in the results container
    resultsContainer.innerHTML = '';  // Clear any previously displayed results

    if (!currChar) {
        // If the search bar is empty, show all items (no search filter applied)
        allItemCards.forEach(item => {
            item.style.display = 'block'; // Make all items visible again
        });
        return; // Exit early to avoid showing "No results found" message
    }

    let foundResults = false; // Track if any items match the search query

    allItemCards.forEach(parentItemCard => {
        const itemName = parentItemCard.querySelector('.itemName');
        const description = parentItemCard.querySelector('.description');
        
        // Check if either itemName or description contains the search term
        if ((itemName && itemName.textContent.toLowerCase().includes(currChar)) || 
            (description && description.textContent.toLowerCase().includes(currChar))) {
            
            parentItemCard.style.display = 'block';  // Show matching items
            foundResults = true; // Mark that a result has been found
        } else {
            parentItemCard.style.display = 'none'; // Hide non-matching items
        }
    });

    // If no results are found, show a "No results found" message
    if (!foundResults) {
        resultsContainer.innerHTML = '<p>No results found</p>';
    }
});
