/**
 * Footnote hover preview
 */

export function initFootnotePreview() {
  const footnoteLinks = document.querySelectorAll('a.footnote[role="doc-noteref"]');

  if (footnoteLinks.length === 0) {
    return;
  }

  let tooltip = null;
  let backdrop = null;
  let hideTimeout = null;
  let isMobile = window.matchMedia('(max-width: 768px)').matches;

  // Update isMobile on resize
  window.matchMedia('(max-width: 768px)').addEventListener('change', (e) => {
    isMobile = e.matches;
  });

  function createBackdrop() {
    const el = document.createElement('div');
    el.className = 'footnote-backdrop';
    el.style.display = 'none';
    document.body.appendChild(el);
    return el;
  }

  function createTooltip() {
    const el = document.createElement('div');
    el.className = 'footnote-tooltip';
    el.style.position = isMobile ? 'fixed' : 'absolute';
    el.style.display = 'none';
    el.style.zIndex = '9999';
    document.body.appendChild(el);
    return el;
  }

  function getFootnoteContent(link) {
    const href = link.getAttribute('href');
    const footnoteId = href.substring(1); // Remove '#'
    const footnoteElement = document.getElementById(footnoteId);

    if (!footnoteElement) {
      return null;
    }

    // Clone the content and remove the back link
    const content = footnoteElement.cloneNode(true);
    const backLink = content.querySelector('.reversefootnote');
    if (backLink) {
      backLink.remove();
    }

    return content.innerHTML.trim();
  }

  function showTooltip(e) {
    // For mobile, prevent default link behavior
    if (isMobile && e.type === 'click') {
      e.preventDefault();
    }

    // Clear any pending hide timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    const link = e.currentTarget;
    const content = getFootnoteContent(link);

    if (!content) {
      return;
    }

    if (!tooltip) {
      tooltip = createTooltip();

      if (isMobile) {
        // Create backdrop for mobile
        backdrop = createBackdrop();
        backdrop.addEventListener('click', hideTooltipImmediately);
      } else {
        // Keep tooltip visible when mouse is over it (desktop only)
        tooltip.addEventListener('mouseenter', () => {
          if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
          }
        });

        tooltip.addEventListener('mouseleave', hideTooltip);
      }
    }

    // Create close button for mobile
    let closeBtn = tooltip.querySelector('.footnote-close');
    if (isMobile && !closeBtn) {
      closeBtn = document.createElement('button');
      closeBtn.className = 'footnote-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.addEventListener('click', hideTooltipImmediately);
    }

    tooltip.innerHTML = content;

    // Re-add close button after setting innerHTML
    if (isMobile && closeBtn) {
      tooltip.insertBefore(closeBtn, tooltip.firstChild);
    }

    tooltip.style.display = 'block';

    const rect = link.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    if (isMobile) {
      // Center horizontally, position vertically near the link on mobile
      tooltip.style.position = 'fixed';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';

      let top = rect.bottom + 5;

      // Adjust if tooltip goes off screen vertically
      if (top + tooltipRect.height > window.innerHeight) {
        top = rect.top - tooltipRect.height - 5;
      }

      // Make sure it doesn't go above the screen
      if (top < 10) {
        top = 10;
      }

      tooltip.style.top = `${top}px`;

      // Show backdrop
      if (backdrop) {
        backdrop.style.display = 'block';
      }
    } else {
      // Position the tooltip near the link on desktop
      tooltip.style.position = 'absolute';
      tooltip.style.transform = 'none';

      let left = rect.left + window.scrollX;
      let top = rect.bottom + window.scrollY + 5;

      // Adjust if tooltip goes off screen
      if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 10;
      }

      if (top + tooltipRect.height > window.innerHeight + window.scrollY) {
        top = rect.top + window.scrollY - tooltipRect.height - 5;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    }
  }

  function hideTooltip() {
    // Delay hiding to allow mouse to move to tooltip (desktop only)
    if (!isMobile) {
      hideTimeout = setTimeout(() => {
        hideTooltipImmediately();
      }, 100);
    }
  }

  function hideTooltipImmediately() {
    if (tooltip) {
      tooltip.style.display = 'none';
    }
    if (backdrop) {
      backdrop.style.display = 'none';
    }
  }

  // Attach event listeners to all footnote links
  footnoteLinks.forEach((link) => {
    if (isMobile) {
      // Mobile: use click/touch
      link.addEventListener('click', showTooltip);
    } else {
      // Desktop: use hover
      link.addEventListener('mouseenter', showTooltip);
      link.addEventListener('mouseleave', hideTooltip);
      link.addEventListener('focus', showTooltip);
      link.addEventListener('blur', hideTooltip);
    }
  });

  // Re-bind events on resize when switching between mobile/desktop
  window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (wasMobile !== isMobile) {
      // Rebind events
      footnoteLinks.forEach((link) => {
        // Remove all existing listeners by cloning
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        if (isMobile) {
          newLink.addEventListener('click', showTooltip);
        } else {
          newLink.addEventListener('mouseenter', showTooltip);
          newLink.addEventListener('mouseleave', hideTooltip);
          newLink.addEventListener('focus', showTooltip);
          newLink.addEventListener('blur', hideTooltip);
        }
      });
    }
  });
}
