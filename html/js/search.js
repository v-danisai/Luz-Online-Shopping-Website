const userSearch = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer'); 

userSearch.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { 
        e.preventDefault(); 
    }
});

userSearch.addEventListener('keyup', e => {
    let currChar = e.target.value.toLowerCase();
    
    resultsContainer.innerHTML = '';  

    // Get the latest dynamically added itemCards
    const allItemCards = document.querySelectorAll('.itemCard');
    const allCategories = document.querySelectorAll('.categorySection'); // All category sections including headers

    if (!currChar) {
        allItemCards.forEach(item => {
            // Reset text and remove highlights
            let itemName = item.querySelector('.itemName');
            let description = item.querySelector('.description');

            if (itemName && itemName.dataset.originalText) {
                itemName.innerHTML = itemName.dataset.originalText; // Reset name to original text
            }
            if (description && description.dataset.originalText) {
                description.innerHTML = description.dataset.originalText; // Reset description to original text
            }
            
            item.style.display = 'block'; 
        });
        // Show all category headers
        allCategories.forEach(category => {
            category.style.display = 'block';
        });
        return; 
    }

    let foundResults = false; 

    allCategories.forEach(category => {
        let sectionHasVisibleItems = false; // Flag to track if any item is visible in this section

        // Loop through the items in each section
        const itemCardsInSection = category.querySelectorAll('.itemCard');
        itemCardsInSection.forEach(parentItemCard => {
            const itemName = parentItemCard.querySelector('.itemName');
            const description = parentItemCard.querySelector('.description');
            
            // Function to highlight matching text
            const highlightText = (text, search) => {
                const regex = new RegExp(`(${search})`, 'gi'); // Case insensitive matching
                return text.replace(regex, '<span class="highlight">$1</span>'); // Wrap matches in <span> with highlight class
            };

            let itemNameHTML = itemName.textContent;
            let descriptionHTML = description.textContent;

            // Store original text if not already stored
            if (itemName && !itemName.dataset.originalText) {
                itemName.dataset.originalText = itemName.textContent;
            }
            if (description && !description.dataset.originalText) {
                description.dataset.originalText = description.textContent;
            }

            // If either name or description matches the search
            if ((itemName && itemName.textContent.toLowerCase().includes(currChar)) || 
                (description && description.textContent.toLowerCase().includes(currChar))) {
                
                // Highlight the matching text
                if (itemName) {
                    itemNameHTML = highlightText(itemName.textContent, currChar);
                    itemName.innerHTML = itemNameHTML;  // Update the itemName with highlighted text
                }

                if (description) {
                    descriptionHTML = highlightText(description.textContent, currChar);
                    description.innerHTML = descriptionHTML;  // Update the description with highlighted text
                }

                parentItemCard.style.display = 'block';
                sectionHasVisibleItems = true; // At least one item is visible in this section
            } else {
                parentItemCard.style.display = 'none'; 
            }
        });

        // Hide the category header if no items are visible in the section
        if (sectionHasVisibleItems) {
            category.style.display = 'block';
        } else {
            category.style.display = 'none'; 
        }
    });

    // Check if any results were found at all
    let anyVisibleItems = Array.from(allItemCards).some(item => item.style.display === 'block');

    if (!anyVisibleItems) {
        resultsContainer.innerHTML = '<p id="noResults">No Results Found</p>';
    }
});
