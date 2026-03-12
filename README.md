# Cybersecurity Portfolio - Rohan Kumar

A professional cybersecurity portfolio website with an integrated admin dashboard for managing content. Built with vanilla HTML, CSS, and JavaScript for easy deployment on GitHub Pages.

![Portfolio Preview](assets/images/preview.png)

## Features

### Public Portfolio Website
- **Modern Dark Theme** - Cybersecurity aesthetic with neon green/blue accents
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Smooth Animations** - Scroll animations, skill bars, and counter effects
- **Dynamic Content** - Loads all content from a single JSON file
- **Sections Include:**
  - Home with hero section
  - About with personal information
  - Services offered
  - Skills with proficiency levels
  - Projects showcase
  - Tools dashboard
  - Security writeups
  - Certifications
  - Education timeline
  - Contact form

### Admin Dashboard
- **Secure Login** - Authentication system with session management
- **Dashboard Overview** - Statistics and recent activity
- **Content Management** - Edit all portfolio sections through forms
- **Dynamic Lists** - Add/remove items like projects, skills, certifications
- **Data Persistence** - Changes saved to localStorage (for GitHub Pages compatibility)

## Project Structure

```
portfolio-system/
│
├── index.html                  # Main landing page
│
├── html/                       # Public portfolio pages
│   ├── about.html
│   ├── services.html
│   ├── skills.html
│   ├── projects.html
│   ├── tools.html
│   ├── writeups.html
│   ├── certifications.html
│   ├── education.html
│   └── contact.html
│
├── admin/                      # Admin dashboard pages
│   ├── login.html              # Admin login page
│   ├── dashboard.html          # Main dashboard
│   ├── edit-about.html         # Edit About section
│   ├── edit-services.html      # Edit Services section
│   ├── edit-skills.html        # Edit Skills section
│   ├── edit-projects.html      # Edit Projects section
│   ├── edit-tools.html         # Edit Tools section
│   ├── edit-education.html     # Edit Education section
│   ├── edit-certifications.html # Edit Certifications section
│   └── edit-contact.html       # Edit Contact section
│
├── css/                        # Stylesheets
│   ├── style.css               # Main portfolio styles
│   └── admin.css               # Admin dashboard styles
│
├── js/                         # JavaScript files
│   ├── script.js               # Main portfolio scripts
│   ├── admin.js                # Admin dashboard functionality
│   └── auth.js                 # Authentication system
│
├── data/                       # Data files
│   └── portfolio-data.json     # Portfolio content data
│
├── assets/                     # Assets folder
│   ├── images/                 # Image files
│   └── icons/                  # Icon files
│
└── README.md                   # This file
```

## Default Admin Credentials

```
Username: Admin123
Password: **********
```

**Note:** For production use, change these credentials in the `js/auth.js` file.

## Getting Started

### Local Development

1. **Clone or download** this repository
2. **Open** `index.html` in your web browser
3. **To access admin panel:**
   - Navigate to `admin/login.html`
   - Login with default credentials

### GitHub Pages Deployment

1. **Create a new repository** on GitHub
2. **Upload all files** to the repository
3. **Go to Settings** > Pages
4. **Select source** as main branch
5. **Your site will be live** at `https://yourusername.github.io/repository-name/`

## How to Edit Content

### Method 1: Using Admin Dashboard (Recommended)

1. Login to the admin panel at `admin/login.html`
2. Navigate to the section you want to edit
3. Make your changes in the form
4. Click "Save Changes"
5. Refresh the public site to see changes

### Method 2: Editing JSON File Directly

1. Open `data/portfolio-data.json`
2. Edit the content as needed
3. Save the file
4. Changes will reflect on the website

## Data Structure

The `portfolio-data.json` file contains all portfolio content:

```json
{
  "personal": {
    "name": "Rohan Kumar",
    "title": "Cybersecurity Student",
    "email": "...",
    "phone": "...",
    ...
  },
  "about": {
    "heading": "About Me",
    "description": "...",
    ...
  },
  "services": [...],
  "skills": {
    "technical": [...],
    "soft": [...]
  },
  "projects": [...],
  "tools": [...],
  "writeups": [...],
  "certifications": [...],
  "education": [...],
  "contact": {...}
}
```

## Customization

### Changing Colors

Edit CSS variables in `css/style.css`:

```css
:root {
  --accent-green: #00ff88;    /* Primary accent */
  --accent-blue: #00d4ff;     /* Secondary accent */
  --bg-primary: #0a0a0a;      /* Background color */
  --text-primary: #ffffff;    /* Text color */
  ...
}
```

### Changing Admin Credentials

Edit `js/auth.js`:

```javascript
const AUTH_CONFIG = {
  username: 'your-username',
  password: 'your-password',
  ...
};
```

### Adding New Sections

1. Create a new HTML file in the `html/` folder
2. Add navigation link in all pages
3. Add data structure in `portfolio-data.json`
4. Create edit page in `admin/` folder
5. Add form handling in `js/admin.js`

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Security Notes

This portfolio uses client-side authentication suitable for GitHub Pages hosting:

- Credentials are stored in JavaScript (visible to users)
- Data is stored in localStorage (client-side only)
- For production with sensitive data, implement server-side authentication

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, flexbox, grid
- **JavaScript (ES6+)** - Modern JavaScript features
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

- Design & Development: Rohan Kumar
- Icons: Font Awesome
- Fonts: Google Fonts (Inter, Fira Code)

## Support

For questions or issues, please contact:
- Email: rohanden786@gmail.com
- LinkedIn: https://linkedin.com/in/rohankumar

---

**Note:** This is a portfolio template designed for cybersecurity students and professionals. Feel free to customize it to match your personal brand and style.
