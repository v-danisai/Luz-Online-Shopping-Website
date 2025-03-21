const userSearch=document.getElementById('searchInput');
userSearch.addEventListener('keyup', e=> {

    let currChar = e.target.value.toLowerCase();
    let items = document.querySelectorAll('.itemName, .description');

    items.forEach(item => {
        const parentItemCard = item.closest('.itemCard');  

        if (currChar && (item.textContent.toLowerCase().includes(currChar))) {
            parentItemCard.style.display = 'block';  
        } else {
            if (!currChar) {
                parentItemCard.style.display = 'block'; 
            } else {
                parentItemCard.style.display = 'none'; 
            }
        }
    });
});