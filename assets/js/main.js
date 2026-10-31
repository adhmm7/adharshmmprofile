const progress = document.querySelector(".progress");
const heroArtwork = document.querySelector(".hero-art");
let progressUpdateScheduled = false;
    const updateProgress = () => {
  if (progressUpdateScheduled) return;
  progressUpdateScheduled = true;
  requestAnimationFrame(() => {
    progressUpdateScheduled = false;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${available > 0 ? (window.scrollY / available) * 100 : 0}%`;
    if (heroArtwork) {
      const heroProgress = Math.min(window.scrollY / Math.max(heroArtwork.offsetHeight, 1), 1);
      heroArtwork.style.setProperty("--hero-scroll-shift", `${(-24 * heroProgress).toFixed(1)}px`);
    }
  });
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    const menuButton = document.querySelector("#menu-toggle");
    const primaryNavigation = document.querySelector("#primary-navigation");
    const closeNavigation = (restoreFocus = false) => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      primaryNavigation.classList.remove("is-open");
      if (restoreFocus) menuButton.focus();
    };
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      primaryNavigation.classList.toggle("is-open", !isOpen);
      if (!isOpen && window.innerWidth <= 800) primaryNavigation.querySelector("a").focus();
    });
    primaryNavigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNavigation();
    });
    document.addEventListener("click", (event) => {
      if (menuButton.getAttribute("aria-expanded") === "true" && !event.target.closest(".site-header")) closeNavigation();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") closeNavigation(true);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) closeNavigation();
    });

    const sectionLinks = [...primaryNavigation.querySelectorAll('a[href^="#"]')]
      .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
      .filter((item) => item.section);
    if ("IntersectionObserver" in window) {
      const navigationObserver = new IntersectionObserver((entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)[0];
        if (!activeEntry) return;
        for (const item of sectionLinks) {
          const isActive = item.section === activeEntry.target;
          item.link.classList.toggle("is-active", isActive);
          if (isActive) item.link.setAttribute("aria-current", "location");
          else item.link.removeAttribute("aria-current");
        }
      }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
      sectionLinks.forEach((item) => navigationObserver.observe(item.section));
    }

    const projectCards = [...document.querySelectorAll(".project-card")];
    const projectFilters = [...document.querySelectorAll(".project-filter")];
    const projectCount = document.querySelector("#project-count");
    projectFilters.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        let visibleCount = 0;
        for (const card of projectCards) {
          const matches = filter === "all" || card.dataset.categories.split(" ").includes(filter);
          card.hidden = !matches;
          if (matches) visibleCount++;
        }
        projectFilters.forEach((filterButton) => filterButton.setAttribute("aria-pressed", String(filterButton === button)));
        projectCount.textContent = `${visibleCount} ${visibleCount === 1 ? "project" : "projects"} shown`;
      });
    });

    const impactMetrics = [...document.querySelectorAll(".impact-item strong[data-count]")];
    if ("IntersectionObserver" in window) {
      const impactObserver = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const metric = entry.target;
          observer.unobserve(metric);
          const target = Number(metric.dataset.count);
          if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
            metric.textContent = `${target}%`;
            continue;
          }
          const start = performance.now();
          const duration = 850;
          const updateMetric = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            metric.textContent = `${Math.round(target * eased)}%`;
            if (progress < 1) requestAnimationFrame(updateMetric);
          };
          requestAnimationFrame(updateMetric);
        }
      }, { threshold: .55 });
      impactMetrics.forEach((metric) => {
        metric.textContent = "0%";
        metric.setAttribute("aria-label", `${metric.dataset.count}%`);
        impactObserver.observe(metric);
      });
    } else {
      impactMetrics.forEach((metric) => {
        metric.textContent = `${metric.dataset.count}%`;
        metric.setAttribute("aria-label", `${metric.dataset.count}%`);
      });
    }

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        }
      }, { threshold: .12 });
      document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
    } else {
      document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
    }

    const assistantLauncher = document.querySelector("#assistant-launcher");
    const assistantNavTrigger = document.querySelector("#assistant-nav-trigger");
    const assistantPanel = document.querySelector("#profile-assistant");
    const assistantClose = document.querySelector("#assistant-close");
    const assistantInput = document.querySelector("#assistant-input");
    const assistantLog = document.querySelector("#assistant-log");
    const assistantAnswers = [
      {
        terms: ["hpe", "ngq", "quoting", "quote", "cost relief", "salesforce", "s4", "corona", "deloitte", "current role"],
        answer: "At Deloitte, Adharsh works on HPE's Next Generation Quoting (NGQ) enterprise CPQ platform. His work includes Java/Spring Boot microservices, quote lifecycle workflows, Cost Relief, Salesforce and S4/Corona integrations, data consistency, and SIT/UAT defect resolution."
      },
      {
        terms: ["tagit", "axis", "banking", "gift city", "omni-channel", "production support", "mobile banking"],
        answer: "At Tagit India, Adharsh built and supported digital banking systems. His work covered payment, dashboard and authentication services, multi-currency and cross-border APIs, compliance, reconciliation, and production support."
      },
      {
        terms: ["impact", "achievement", "result", "latency", "failure", "efficiency", "incident", "improved", "percentage", "metric"],
        answer: "Selected results in the profile: 20% lower API latency, 25% higher processing efficiency, 30% faster incident resolution, and 15% fewer transaction failures."
      },
      {
        terms: ["skill", "technology", "technologies", "tech stack", "java", "spring", "sql", "api", "kubernetes", "docker", "distributed", "concurrency", "observability", "tools"],
        answer: "The profile lists Java/J2EE, Spring Boot/MVC/Cloud, microservices, REST/SOAP/JMS, SQL/JDBC/JPA/Hibernate, Redis, Docker, Kubernetes, Jenkins, AWS basics, Kafka basics, observability tools, concurrency, and system design."
      },
      {
        terms: ["education", "degree", "university", "certification", "certificate", "certificates", "course"],
        answer: "Adharsh has a B.E. in Computer Science & Engineering from VTU (2016–2021). Listed certificates include Google Project Management, IBM Java Developer, Google Cybersecurity, and Deloitte AI Generalist/Expert programs."
      },
      {
        terms: ["contact", "email", "phone", "linkedin", "reach", "connect"],
        answer: "You can reach Adharsh at adhmm7india@gmail.com or +91 62821 28051, or connect on LinkedIn at linkedin.com/in/adhmm7/."
      },
      {
        terms: ["experience", "career", "background", "summary", "years", "software engineer"],
        answer: "Adharsh is a software engineer with 4+ years of experience building, improving, and supporting production services. His strengths span backend engineering, APIs, data performance, distributed systems, concurrency, and reliability."
      }
    ];
    const skillTerms = [
      ["Java", ["java", "j2ee"]], ["Spring Boot", ["spring boot"]], ["Spring Cloud", ["spring cloud"]],
      ["Microservices", ["microservice"]], ["REST APIs", ["rest api", "restful"]], ["SOAP", ["soap"]],
      ["JMS", ["jms"]], ["Kafka", ["kafka"]], ["SQL", ["sql", "oracle"]], ["JDBC", ["jdbc"]],
      ["JPA / Hibernate", ["jpa", "hibernate"]], ["Redis", ["redis"]], ["Docker", ["docker"]],
      ["Kubernetes", ["kubernetes"]], ["Jenkins / CI/CD", ["jenkins", "ci/cd", "continuous integration"]],
      ["AWS basics", ["aws"]], ["Distributed systems", ["distributed system"]],
      ["Concurrency", ["concurrency", "thread pool", "async processing"]],
      ["Prometheus / Grafana", ["prometheus", "grafana"]], ["Performance engineering", ["performance", "optimization"]]
    ];

    const openAssistant = () => {
      assistantPanel.hidden = false;
      assistantLauncher.setAttribute("aria-expanded", "true");
      assistantInput.focus();
    };
    const closeAssistant = () => {
      assistantPanel.hidden = true;
      assistantLauncher.setAttribute("aria-expanded", "false");
      assistantLauncher.focus();
    };
    assistantNavTrigger.addEventListener("click", () => {
      closeNavigation();
      openAssistant();
    });
    assistantLauncher.addEventListener("click", () => {
      if (assistantPanel.hidden) openAssistant();
      else closeAssistant();
    });
    assistantClose.addEventListener("click", closeAssistant);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !assistantPanel.hidden) closeAssistant();
    });

    const addAssistantMessage = (text, isUser = false) => {
      const message = document.createElement("div");
      message.className = `assistant-message${isUser ? " assistant-message--user" : ""}`;
      message.textContent = text;
      assistantLog.append(message);
      assistantLog.scrollTop = assistantLog.scrollHeight;
    };
    const answerProfileQuestion = (question) => {
      const query = question.toLowerCase();
      const answer = assistantAnswers
        .map((item) => ({
          text: item.answer,
          score: item.terms.reduce((score, term) => score + (query.includes(term) ? term.length : 0), 0)
        }))
        .sort((first, second) => second.score - first.score)[0];
      return answer.score
        ? answer.text
        : "I can answer from the profile about HPE/NGQ, Tagit/Axis, skills, impact, education, or contact details. Try one of those topics.";
    };
    const submitQuestion = (question) => {
      const trimmedQuestion = question.trim();
      if (!trimmedQuestion) return;
      addAssistantMessage(trimmedQuestion, true);
      addAssistantMessage(answerProfileQuestion(trimmedQuestion));
    };
    document.querySelector("#assistant-form").addEventListener("submit", (event) => {
      event.preventDefault();
      submitQuestion(assistantInput.value);
      assistantInput.value = "";
      assistantInput.focus();
    });
    document.querySelectorAll(".assistant-suggestions button").forEach((button) => {
      button.addEventListener("click", () => submitQuestion(button.dataset.question));
    });

    document.querySelector("#match-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const description = document.querySelector("#job-description").value.toLowerCase();
      const matches = skillTerms
        .filter(([, terms]) => terms.some((term) => description.includes(term)))
        .map(([label]) => label);
      const result = document.querySelector("#match-result");
      result.textContent = matches.length
        ? `Profile terms found in the role (${matches.length}): ${matches.join(", ")}.`
        : "No listed profile skills matched those terms. Try including the role's technical requirements.";
    });
