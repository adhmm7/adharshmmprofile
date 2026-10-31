const progress = document.querySelector(".progress");
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${available > 0 ? (window.scrollY / available) * 100 : 0}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

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
