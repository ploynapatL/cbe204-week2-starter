# Rainshine Books

## 1. Project Name

**Rainshine Books**

Rainshine Books is a responsive front-end website for a small, independent book rental business.

## 2. Short Description

Rainshine Books is designed to feel like **reading a good book beside a window while rain falls outside at night**.

The website allows visitors to:

* Explore featured books
* Search for books by title or author
* Filter books by genre, rental duration, and price
* Sort books by recommendation, price, or title
* Add books to a rental basket
* Change rental durations
* View rental totals and service fees
* Complete a front-end rental confirmation form
* Read about the business and browse frequently asked questions
* Subscribe to a newsletter

The website is entirely front-end based and does not use a backend, database, authentication system, or real payment processing.

## 3. Pages Included

### `index.html` — Home

The homepage introduces Rainshine Books and includes:

* Responsive navigation
* Hero section
* Featured books
* How It Works section
* Why Rainshine Books section
* Call-to-action section
* Newsletter signup
* Footer

### `books.html` — Browse / Search Books

The browsing page includes:

* Book search
* Genre filtering
* Rental duration filtering
* Price filtering
* Sorting options
* 12 fictional books
* Book cards with covers, authors, genres, descriptions, prices, and rental durations
* Add to Basket functionality
* Empty search-result message

### `basket.html` — Basket / Rental

The basket page includes:

* Selected books
* Remove functionality
* Rental duration selection
* Dynamic rental pricing
* Rental subtotal
* Service fee
* Grand total
* Continue Browsing button
* Rental confirmation form
* Pickup / delivery preference
* Front-end rental confirmation message

Basket data is stored using browser `localStorage`, allowing it to persist between pages and browser refreshes.

### `about.html` — About / FAQ

The About page includes:

* Our Story
* Our Philosophy
* How It Works
* Why Choose Rainshine?
* FAQ accordion

The FAQ uses native expandable `<details>` elements and JavaScript interactions.

### `style.css` — Shared Styling

A single stylesheet is shared across all pages. It controls:

* Colors
* Typography
* Layout
* Book cards
* Buttons
* Navigation
* Forms
* Basket
* Modal
* Responsive breakpoints
* Decorative elements

### `script.js` — Shared JavaScript

A single JavaScript file provides functionality across the website, including:

* Mobile navigation
* Book searching
* Filtering
* Sorting
* Adding books to the basket
* Removing books
* Basket item-count badge
* Rental duration changes
* Dynamic rental prices
* Basket totals
* `localStorage` persistence
* Rental confirmation modal/form
* Newsletter form interaction
* Featured book rendering

## 4. Main UI / Layout Techniques Used

The design uses a calm, cozy visual style inspired by a rainy evening and a warm reading lamp.

Main techniques include:

* **CSS Grid** for hero, book, feature, and content layouts
* **Flexbox** for navigation, buttons, summaries, and smaller components
* **CSS gradients** to create midnight-blue and moonlit backgrounds
* **Rounded cards** for books, steps, forms, and content sections
* **Subtle glassmorphism** using translucent backgrounds and borders
* **Box shadows** for depth without excessive visual effects
* **CSS pseudo-elements** for decorative rain, moonlight, stars, and lamp effects
* **Responsive navigation** with a JavaScript-controlled hamburger menu
* **Semantic HTML5 elements** such as `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `form`, and `details`
* **Accessible focus states** for keyboard navigation
* **ARIA labels and attributes** for interactive controls

The color palette primarily uses deep navy, midnight blue, blue-gray, muted purple, soft cream, and subtle cyan.

## 5. Responsive Design Approach

The website follows a mobile-first responsive approach using CSS media queries.

### Desktop

* Full horizontal navigation
* Two-column hero section
* Three-column book grid
* Two-column basket layout
* Spacious content sections

### Tablet

* Reduced spacing
* Two-column book grid
* Flexible content layouts
* Adjusted typography and artwork sizes

### Mobile

* Hamburger navigation menu
* Single-column hero
* Single-column book grid
* Stacked forms and controls
* Responsive basket items
* Full-width buttons
* Mobile-friendly spacing and typography
* No intentional horizontal scrolling

The layout uses flexible widths such as `max-width`, `min()`, `clamp()`, CSS Grid, and Flexbox so the interface can adapt to different screen sizes.

## 6. AI Assistance Disclosure

AI assistance was used during the development of this project.

AI was used to help with:

* Generating and organizing HTML structure
* Developing the shared CSS styling
* Creating Vanilla JavaScript functionality
* Designing the responsive layout
* Creating fictional book content
* Implementing localStorage basket functionality
* Implementing search, filtering, sorting, and rental calculations
* Reviewing accessibility considerations
* Packaging the project files

The final project was reviewed and organized to meet the requested design, functionality, file structure, and technology requirements.

No external frameworks such as React, Bootstrap, or Tailwind were used.

## 7. Brief Reflection — What I Learned

Working on Rainshine Books helped me understand how multiple front-end pages can work together while sharing the same CSS and JavaScript.

One of the most useful things I learned was how `localStorage` can be used to maintain data between pages without requiring a backend. This allowed the rental basket to remain available when moving between the Browse and Basket pages.

I also learned more about creating responsive layouts with CSS Grid and Flexbox. Designing the same interface for desktop, tablet, and mobile required thinking carefully about spacing, navigation, typography, and how interactive elements should behave at smaller screen sizes.

Another important learning point was accessibility. Using semantic HTML, meaningful labels, keyboard focus states, accessible buttons, and ARIA attributes makes the website easier to use for a wider range of users.

Overall, the project helped me bring together HTML, CSS, and JavaScript into a complete multi-page website while keeping the design consistent and avoiding the need for external frameworks.
