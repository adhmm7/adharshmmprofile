# Adharsh M M | Software Engineer Portfolio

A responsive personal portfolio for Adharsh M M, presenting software engineering experience, technical skills, selected impact, education, and contact links.

## Project Structure

```text
adharshmmprofile/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   │   ├── profile-casual.jpg
│   │   └── profile-professional.png
│   └── js/
│       └── main.js
├── index.html
├── README.md
└── .vscode/
	└── settings.json
```

## Features

- Responsive portfolio layout built with semantic HTML, CSS, and vanilla JavaScript.
- Entrance, hover, and scroll-reveal animations, with support for reduced-motion preferences.
- Profile assistant that answers common questions from curated profile information.
- Job-description checker that reports skills mentioned both in the role text and the profile.
- Direct email, phone, and LinkedIn links.

The assistant and job-description checker run entirely in the browser. They use local, rule-based matching, not a generative AI model. Job descriptions are not sent to a server, and the checker is not a hiring decision or a measure of overall role fit.

## Run Locally

No package installation or build step is required.

1. Open this folder in VS Code.
2. Open `index.html` directly in a browser, or use the Live Server extension to preview it locally.

Google Fonts require an internet connection. Profile photos are stored locally in `assets/images/`: `profile-professional.png` is used in the hero, and `profile-casual.jpg` appears as the secondary portrait.

## Customize

- Update profile content, links, experience, and assistant answers in `index.html` and `assets/js/main.js`.
- Update colors, layout, responsive rules, and animations in `assets/css/styles.css`.
- Replace the portrait files in `assets/images/` to update the profile photography while keeping the same filenames.
- Keep assistant responses grounded in verified profile details. The current assistant does not call an AI API.

## Deployment

This is a static site. It can be hosted on GitHub Pages or another static web host by publishing the repository root; `index.html` is the entry page.
