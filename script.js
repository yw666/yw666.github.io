// Tab logic with hash routing + accessibility and theme toggle
(function () {
  const panels = {
    intro: document.getElementById("panel-intro"),
    photos: document.getElementById("panel-photos"),
    work: document.getElementById("panel-work"),
  };
  const tabs = {
    intro: document.getElementById("tab-intro"),
    photos: document.getElementById("tab-photos"),
    work: document.getElementById("tab-work"),
  };

  function show(section) {
    for (const key of Object.keys(panels)) {
      const active = key === section;
      panels[key].hidden = !active;
      panels[key].classList.toggle("is-active", active);
      tabs[key].classList.toggle("is-active", active);
      tabs[key].setAttribute("aria-selected", String(active));
    }
  }

  function syncFromHash() {
    const hash = (location.hash.replace("#", "") || "intro").toLowerCase();
    const section = panels[hash] ? hash : "intro";
    show(section);
  }

  // Click to navigate
  Object.values(tabs).forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      history.pushState(null, "", "#" + target);
      show(target);
    });
  });

  // Hash routing
  window.addEventListener("hashchange", syncFromHash);
  syncFromHash();

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle (persist)
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");
  if (saved === "dark") root.classList.add("dark");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      root.classList.toggle("dark");
      localStorage.setItem(
        "theme",
        root.classList.contains("dark") ? "dark" : "light"
      );
    });
  }

  // Keyboard support for tabs
  const order = ["intro", "photos", "work"];
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("keydown", (e) => {
      const idx = order.indexOf(tab.dataset.target);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        tabs[order[(idx + 1) % order.length]].focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        tabs[order[(idx - 1 + order.length) % order.length]].focus();
      }
    });
  });

  /* ===============================
     Visitor counter + time tracking
     =============================== */

  const VISITOR_API = "https://visitor-counter.yw1.workers.dev";

  // ---- Load visit count + total minutes on page load ----
  function loadVisitorStats() {
    // Get header elements only (footer removed)
    const countHeaderEl = document.getElementById("visit-count-header");
    const minutesHeaderEl = document.getElementById("total-minutes-header");

    // If nothing exists in the DOM, do nothing
    if (!countHeaderEl && !minutesHeaderEl) return;

    console.log("Fetching stats from:", `${VISITOR_API}/count`);

    fetch(`${VISITOR_API}/count`, { cache: "no-store" })
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Raw data received:", data);

        const count = Number(data.count ?? 0);
        const totalSeconds = Number(data.totalSeconds ?? 0);
        const totalMinutes = Number(data.totalMinutes ?? 0);

        console.log("Parsed values:", { count, totalSeconds, totalMinutes });

        // Update visit count in header
        if (Number.isFinite(count) && countHeaderEl) {
          countHeaderEl.textContent = count.toLocaleString();
          console.log("Updated header count to:", count);
        }

        // Update minutes in header
        if (Number.isFinite(totalMinutes) && minutesHeaderEl) {
          let shown;
          if (totalMinutes >= 10) {
            shown = Math.round(totalMinutes);      // e.g. 27
          } else if (totalMinutes >= 1) {
            shown = totalMinutes.toFixed(1);       // e.g. 3.4
          } else {
            shown = totalMinutes.toFixed(2);       // e.g. 0.42
          }

          minutesHeaderEl.textContent = shown;
          console.log("Updated header minutes display to:", shown, "(from", totalMinutes, "minutes /", totalSeconds, "seconds)");
        }
      })
      .catch((err) => {
        console.error("Visitor counter error:", err);
      });
  }

  // Load stats on page load
  loadVisitorStats();

  // Optionally refresh stats every 60 seconds to see updates
  setInterval(loadVisitorStats, 60000);

  // ---- Time-on-page tracking with visibility handling ----

  let activeTime = 0; // Total active time in milliseconds
  let sessionStart = performance.now(); // When current active session started
  let isVisible = !document.hidden; // Current visibility state

  // Calculate active time accumulated so far
  function getActiveTime() {
    let total = activeTime;
    if (isVisible) {
      total += performance.now() - sessionStart;
    }
    return total;
  }

  // Handle visibility changes (tab switch, minimize, etc.)
  function handleVisibilityChange() {
    const now = performance.now();

    if (document.hidden && isVisible) {
      // Tab just became hidden - accumulate the time
      activeTime += now - sessionStart;
      isVisible = false;
      console.log("Tab hidden. Active time so far:", Math.round(activeTime / 1000), "seconds");
    } else if (!document.hidden && !isVisible) {
      // Tab just became visible again - restart the session
      sessionStart = now;
      isVisible = true;
      console.log("Tab visible again");
    }
  }

  // Send accumulated active time to server
  function sendTimeSpent() {
    const totalMs = getActiveTime();
    const seconds = Math.round(totalMs / 1000);

    console.log("=== SENDING TIME ===");
    console.log("Total active milliseconds:", totalMs);
    console.log("Seconds to send:", seconds);

    // Ignore super-short visits
    if (seconds < 2) {
      console.log("Visit too short (<2s), not sending time");
      return;
    }

    const url = `${VISITOR_API}/time`;

    // Try sendBeacon first (most reliable for page unload)
    if (navigator.sendBeacon) {
      // Convert to JSON blob
      const blob = new Blob([JSON.stringify({ seconds })], {
        type: "application/json"
      });

      const sent = navigator.sendBeacon(url, blob);
      console.log("sendBeacon result:", sent);

      if (!sent) {
        console.warn("sendBeacon failed, trying fetch...");
        // Fallback to fetch if beacon fails
        tryFetchWithKeepalive(url, seconds);
      }
    } else {
      console.log("sendBeacon not supported, using fetch");
      tryFetchWithKeepalive(url, seconds);
    }
  }

  // Helper function for fetch with keepalive
  function tryFetchWithKeepalive(url, seconds) {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seconds }),
      keepalive: true,
    }).then(res => {
      console.log("Fetch keepalive response:", res.status);
    }).catch(err => {
      console.error("Fetch keepalive error:", err);
    });
  }

  // Listen for visibility changes
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Send time when user leaves the page
  window.addEventListener("pagehide", sendTimeSpent);

  // Backup for browsers that don't support pagehide
  window.addEventListener("beforeunload", sendTimeSpent);

  // IMPORTANT: Also send time periodically while user is on page
  // This ensures we capture time even if final beacon fails
  let lastSaveTime = 0;
  setInterval(() => {
    const totalMs = getActiveTime();
    const seconds = Math.round(totalMs / 1000);

    // Save every 30 seconds if user has been active for more than 5 seconds since last save
    if (seconds - lastSaveTime >= 5) {
      console.log("Periodic save - Current session time:", seconds, "seconds");

      // Send the increment since last save
      const incrementSeconds = seconds - lastSaveTime;

      fetch(`${VISITOR_API}/time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seconds: incrementSeconds }),
      }).then(res => {
        if (res.ok) {
          lastSaveTime = seconds;
          console.log("Periodic save successful, saved", incrementSeconds, "seconds");
        }
      }).catch(err => {
        console.error("Periodic save failed:", err);
      });
    }
  }, 30000); // Check every 30 seconds

  // Optional: Log session time every 30 seconds for debugging
  setInterval(() => {
    const totalMs = getActiveTime();
    const seconds = Math.round(totalMs / 1000);
    console.log("Current session time:", seconds, "seconds (last saved:", lastSaveTime, "seconds)");
  }, 30000);

  // DEBUG: Add a test button to manually send time and see response
  window.testSendTime = function() {
    const totalMs = getActiveTime();
    const seconds = Math.round(totalMs / 1000);

    console.log("=== MANUAL TEST SEND ===");
    console.log("Sending", seconds, "seconds");

    fetch(`${VISITOR_API}/time`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seconds })
    })
    .then(res => {
      console.log("Response status:", res.status);
      return res.text().then(text => ({status: res.status, text}));
    })
    .then(({status, text}) => {
      console.log("Response text:", text);
      try {
        const json = JSON.parse(text);
        console.log("Response JSON:", json);
      } catch(e) {
        console.log("Not JSON response");
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
    });
  };

  console.log("DEBUG: Run testSendTime() in console to manually test time sending");
})();
