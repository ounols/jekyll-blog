/**
 * Category Infinite Scroll
 * Implements lazy loading for category pages to improve initial render performance
 */

(function () {
  'use strict';

  const POSTS_PER_PAGE = 10;
  const SCROLL_THRESHOLD = 300; // pixels from bottom to trigger load

  let currentIndex = 0;
  let isLoading = false;
  let allPostCards = [];

  function init() {
    // Get all post card items
    allPostCards = Array.from(document.querySelectorAll('.card-wrapper'));

    if (allPostCards.length === 0) {
      return;
    }

    allPostCards.forEach(card => {
      card.style.display = 'none';
    });

    // Show initial posts
    loadMorePosts();

    // Setup scroll listener for infinite scroll
    window.addEventListener('scroll', handleScroll);

    // Setup load more button (backup for users who prefer clicking)
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', loadMorePosts);
    }
  }

  function loadMorePosts() {
    if (isLoading || currentIndex >= allPostCards.length) {
      return;
    }

    isLoading = true;
    showLoadingSpinner();

    // Simulate slight delay for smooth UX (optional)
    setTimeout(() => {
      const endIndex = Math.min(currentIndex + POSTS_PER_PAGE, allPostCards.length);

      // Show next batch of posts
      for (let i = currentIndex; i < endIndex; i++) {
        allPostCards[i].style.display = 'block';
      }

      currentIndex = endIndex;
      isLoading = false;
      hideLoadingSpinner();

      // Update UI state
      updateLoadMoreButton();
    }, 100);
  }

  function handleScroll() {
    if (isLoading || currentIndex >= allPostCards.length) {
      return;
    }

    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    // Check if user is near bottom
    if (pageHeight - scrollPosition < SCROLL_THRESHOLD) {
      loadMorePosts();
    }
  }

  function updateLoadMoreButton() {
    const loadMoreContainer = document.getElementById('load-more-container');
    const loadMoreBtn = document.getElementById('load-more-btn');

    if (!loadMoreContainer || !loadMoreBtn) {
      return;
    }

    if (currentIndex >= allPostCards.length) {
      // All posts loaded
      loadMoreContainer.style.display = 'none';
    } else {
      // More posts available
      loadMoreContainer.style.display = 'block';
      const remainingPosts = allPostCards.length - currentIndex;
      loadMoreBtn.textContent = `Load More Posts (${remainingPosts} remaining)`;
    }
  }

  function showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.style.display = 'block';
    }
  }

  function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
