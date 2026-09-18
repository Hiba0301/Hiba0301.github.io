# Hiba Chaari — Personal Portfolio

Single-page responsive portfolio built with **HTML, CSS and vanilla JavaScript** and prepared for GitHub Pages.

## Included

- Sticky responsive navigation
- Mobile menu
- Light / dark mode with localStorage persistence
- Hero section focused on Software Engineering internships
- About + education section
- Skills grouped by category with Devicon / Font Awesome icons
- Certifications and languages
- Six detailed engineering projects + two additional projects
- Five professional experiences in a vertical timeline
- Project image modal / zoom
- Scroll reveal animations using IntersectionObserver
- Formspree-ready contact form
- SEO meta title and description
- GitHub Pages compatible relative paths

## Run locally

No build step is required.

1. Extract the project.
2. Open `index.html` directly in a browser, or serve the folder with a simple local server.

Example with VS Code: install **Live Server** and open `index.html` with Live Server.

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Upload the content of this folder to the repository root.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select `main` and `/root`.
6. Save.

## Items still requiring your personal information

Search the project for `TODO:`. The remaining TODOs are intentionally limited to information that was not included in the supplied CV. Both CV PDFs are already included and can be replaced later with your official versions if desired:

- GitHub URL
- LinkedIn URL
- Email address
- Formspree form ID
- Professional profile photo
- Public project/repository URLs where available

## Structure

```text
hiba-portfolio/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    ├── img/
    │   ├── profile-placeholder.svg
    │   ├── project-demarky.svg
    │   ├── project-gestiopro.svg
    │   ├── project-pipeline.svg
    │   ├── project-exam.svg
    │   ├── project-aws.svg
    │   └── project-plant.svg
    └── cv/
        ├── CV_FR.pdf
        └── CV_EN.pdf
```
