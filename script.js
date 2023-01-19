"use strict";
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const navigationLinksContainer = document.querySelector(".nav__links");
const header = document.querySelector(".header");
const operations = document.querySelector(".operations");
const tabs = operations.querySelector(".operations__tab-container");
const nav = document.querySelector(".nav");
const lazyImages = document.querySelectorAll(".features__img");
const slides = document.querySelectorAll(".slide");
const dotContainer = document.querySelector(".dots");
const leftSliderBtn = document.querySelector(".slider__btn--left");
const rightSliderBtn = document.querySelector(".slider__btn--right");
let currentSlide = 0;

///////////////////////////////////////Modal window///////////////////////////////////////

//Displays the modal window to the screen
const openModal = function (e) {
	e.preventDefault();
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
};

//Closes the modal window
const closeModal = function () {
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
};

btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);

//The user can also close the modal window by clicking anywhere on the screen outside the modal window
overlay.addEventListener("click", closeModal);

//The user can also close the modal window by hitting the escape key
document.addEventListener("keydown", function (e) {
	if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

///////////////////////////////////////Scrolling///////////////////////////////////////

//Smoothly scrolls to the first section upon clicking the learn more button in header
btnScrollTo.addEventListener("click", function (e) {
	section1.scrollIntoView({ behavior: "smooth" });
});

//Smoothly scrolls to corresponding section when a navigation link is clicked
//Utilizes event delegation by attaching event listener to navigation links' container
navigationLinksContainer.addEventListener("click", function (e) {
	e.preventDefault();

	//Executes only if a nav link in the navigation container was clicked
	if (e.target.classList.contains("nav__link"))
		document
			.querySelector(e.target.getAttribute("href"))
			.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////Operations Tab///////////////////////////////////////

//Removes the current tab content from display
const hideCurrentTab = function () {
	tabs.querySelector(".operations__tab--active")?.classList.remove("operations__tab--active");
	operations
		.querySelector(".operations__content--active")
		?.classList.remove("operations__content--active");
};

//Displays the clicked tab to the screen
const showClickedTab = function (clicked) {
	clicked.classList.add("operations__tab--active");

	operations
		.querySelector(`.operations__content--${clicked.dataset.tab}`)
		.classList.add("operations__content--active");
};

//Switches between tabs accordingly when a tab is clicked
//Utilizes event delegation by attaching the event to the tabs container
tabs.addEventListener("click", function (e) {
	/**
	 * Within each operation tab is a span element and some text
	 * Therefore, clicked stores the operations tab button regardless
	 * of whether the button or its content was clicked
	 */
	const clicked = e.target.closest(".operations__tab");

	//Returns if the tabs container itself is empty since clicked would be nullish
	if (!clicked) return;

	hideCurrentTab();
	showClickedTab(clicked);
});

///////////////////////////////////////Navigation///////////////////////////////////////

/**
 * Controls the opacity of the all links in the nav links container except the one hovered over.
 * The required opacity is passed to the function by setting it as the this keyword for the function.
 * For example, setNavOpacity.bind(0.5) will set the opacity of all links to 0.5 except the one hovered over.
 */
const setNavOpacity = function (event) {
	const linkHoveredOver = event.target;

	//Returns if the mouse is not hovered over one of the nav links in the nav links container
	if (!linkHoveredOver.classList.contains("nav__link")) return;

	const siblingLinks = linkHoveredOver.closest(".nav").querySelectorAll(".nav__link");
	siblingLinks.forEach(el => {
		if (el !== linkHoveredOver) el.style.opacity = this;
	});
	linkHoveredOver.closest(".nav").querySelector("img").style.opacity = this;
};

//Dims the other links in the navigation links container when one is hovered over
navigationLinksContainer.addEventListener("mouseover", setNavOpacity.bind(0.5));

//Re-lights the other links in the navigation links container when none is hovered over
navigationLinksContainer.addEventListener("mouseout", setNavOpacity.bind(1));

///////////////////////////////////////Sticky Navigation///////////////////////////////////////

const makeHeaderSticky = function (entries) {
	const [headerEntry] = entries;
	if (!headerEntry.isIntersecting) nav.classList.add("sticky");
	else nav.classList.remove("sticky");
};
const stickyHeaderObsOptions = {
	root: null,
	threshold: 0,
	rootMargin: `${-nav.clientHeight}px`,
};
const headerObserver = new IntersectionObserver(makeHeaderSticky, stickyHeaderObsOptions);
headerObserver.observe(header);

///////////////////////////////////////Sections///////////////////////////////////////

//Unhides the content of a section on the UI
const revealSection = function (entries, observer) {
	const [sectionEntry] = entries;

	if (!sectionEntry.isIntersecting) return;

	sectionEntry.target.classList.remove("section--hidden");
	observer.unobserve(sectionEntry.target);
};

//reveals a section only when the user scrolls to it for the first time
const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});

document.querySelectorAll(".section").forEach(element => {
	sectionObserver.observe(element);
	element.classList.add("section--hidden");
});

///////////////////////////////////////Image Loading///////////////////////////////////////

//Reveals images on the website by removing lazy images after the original image has fully loaded
const revealImage = function (entries, observer) {
	const [imageEntry] = entries;

	if (!imageEntry.isIntersecting) return;

	const image = imageEntry.target;
	image.src = image.dataset.src;
	image.addEventListener("load", function () {
		this.classList.remove("lazy-img");
	});
	observer.unobserve(image);
};

const imageObserver = new IntersectionObserver(revealImage, {
	root: null,
	threshold: 0,
	rootMargin: "200px",
});
lazyImages.forEach(element => imageObserver.observe(element));

///////////////////////////////////////Testimonial Slides///////////////////////////////////////

//Adds navigation dots to the testimonial slides section
//The number of dots is equal to the number of slides
const createDots = function () {
	slides.forEach(function (_, i) {
		dotContainer.insertAdjacentHTML(
			"beforeend",
			`<button class = "dots__dot" data-slide="${i}"></button>`
		);
	});
};

createDots();

//Since the first slide appears by default, the first dot is also highlighted by default
document.querySelectorAll(".dots__dot")[0].classList.add("dots__dot--active");

/**
 * Unhighlights all the dots in the dot container in the testimonials section
 * and highlights a specific dot as per the passed value.
 * @param {*} dotNumber The position of the dot that will be highlighted
 */
const updateDotHighlighting = function (dotNumber) {
	dotContainer.querySelector(".dots__dot--active").classList.remove("dots__dot--active");
	dotContainer.querySelector(`[data-slide = "${dotNumber}"]`)?.classList.add("dots__dot--active");
};

/**
 * Scrolls to a specific slide as per the passed value and hides the remaining slides
 * @param {*} targetSlide The slide number that will come into view
 */
const goToSlide = function (targetSlide) {
	if (targetSlide < 0) currentSlide = slides.length - 1;
	else if (targetSlide >= slides.length) currentSlide = 0;
	else currentSlide = targetSlide;
	slides.forEach(
		(slide, index) => (slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`)
	);
	updateDotHighlighting(currentSlide);
};
const previousSlide = function () {
	goToSlide(currentSlide - 1);
};
const nextSlide = function () {
	goToSlide(currentSlide + 1);
};

// //Originally shows the first slide and hides the rest by translating them horizontally to the right of the viewport
goToSlide(0);

leftSliderBtn.addEventListener("click", previousSlide);
rightSliderBtn.addEventListener("click", nextSlide);

//Switches to a slide when its corresponding dot is clicked
dotContainer.addEventListener("click", function (e) {
	//Returns if the dot container itself, not a dot, is clicked
	if (!e.target.classList.contains("dots__dot")) return;

	goToSlide(e.target.dataset.slide);
});

//Allows the user to switch to previous and next slide using left and right arrow keys
document.addEventListener("keydown", function (e) {
	if (e.key === "ArrowLeft") previousSlide();
	else if (e.key === "ArrowRight") nextSlide();
});
//////////////////////////////////////////////////////////////////////////////////////
