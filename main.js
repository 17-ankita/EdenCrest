function scrollCards(direction) {
    const loader = document.getElementById('reviewLoader');
    loader.scrollBy({
        left: direction * 320,
        behavior: 'smooth'
    });
}