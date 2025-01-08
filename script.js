const container = document.querySelector(".container");
const dialog = document.querySelector("dialog");
const closeBtn = document.getElementById("close");
const bookForm = document.getElementById("bookForm");
const submitBtn = document.getElementById("submit");
const addBtn = document.querySelector(".nav-button");

let myLibrary = [];

// Functions

function Book(name, author, pages, status) {
	(this.name = name),
		(this.author = author),
		(this.pages = pages),
		(this.status = status);
}

function addBookToLibrary(name, author, pages, status) {
	// check if book exists
	if (myLibrary.some((book) => book.name === name)) {
		alert("This book already exists in your library");
		return;
	}
	myLibrary.push(new Book(name, author, pages, status));
}

addBookToLibrary("Search for Madarion", "Matthew Sefa", 2134, false);
addBookToLibrary("Lost Paradise", "Milton Winston", 852, true);

function displayBooks() {
	myLibrary.forEach((book, index) => {
		createBookCard(book, index);
	});
}

// Create the book card

function createBookCard(book) {
	const bookName = book.name;
	const bookAuthor = book.author;
	const bookPages = book.pages;
	const bookStatus = book.status;

	const cardDiv = document.createElement("div");

	// add the book name as a data attribute to the card
	cardDiv.dataset.name = book.name;
	cardDiv.classList.add("card");

	const buttonsDiv = document.createElement("div");

	buttonsDiv.classList.add("buttons");

	buttonsDiv.innerHTML = `<button class="edit"><i class="fa-solid fa-pen"></i></button>
						<button class="remove"><i class="fa-solid fa-x"></i></button>
						<button class="state">${bookStatus ? "Read" : "Not Read"}</button>`;

	const infoDiv = document.createElement("div");
	const name = document.createElement("p");
	name.textContent = bookName;

	const author = document.createElement("p");
	author.textContent = `By ${bookAuthor}`;

	const pages = document.createElement("p");
	pages.textContent = `${bookPages} pages`;

	infoDiv.append(name, author, pages);

	cardDiv.append(infoDiv, buttonsDiv);

	container.appendChild(cardDiv);
}

function submitBookForm(e) {
	e.preventDefault();

	// Get form values

	const bookName = document.getElementById("name").value;
	const author = document.getElementById("author").value;
	const pages = document.getElementById("pages").value;
	const status = document.getElementById("status").checked;

	// check if book exists
	if (
		myLibrary.some((e) => e.name === bookName) &&
		submitBtn.textContent === "Add"
	) {
		alert("This book already exists in your library");
		return;
	}

	if (submitBtn.textContent === "Edit") {
		// select the card with the original name cuz the bookName variable has the new name
		// thus the querySelector cant find the card

		let cardInfoDiv = container.querySelector(
			`[data-name="${submitBtn.dataset.originalName}"]`
		);
		updateLibrary(
			submitBtn.dataset.originalName,
			bookName,
			author,
			pages,
			status
		);
		updateCard(cardInfoDiv, bookName, author, pages, status);
		bookForm.reset();
		dialog.close();
		delete submitBtn.dataset.originalName;
		return;
	}

	addBookToLibrary(bookName, author, pages, status);

	const book = new Book(bookName, author, pages, status);
	createBookCard(book);

	bookForm.reset();
	dialog.close();
}
//
function updateCard(card, name, author, pages, status) {
	// Select first div in card
	card.dataset.name = name;
	card.firstElementChild.innerHTML = `
						<p>${name}</p>
						<p>By ${author}</p>
						<p>${pages} pages</p>`;

	const button = card.lastElementChild.lastElementChild;
	button.textContent = status ? "Read" : "not Read";
	console.log(button);
}

function updateLibrary(originalName, newName, newAuthor, newPages, newStatus) {
	let book = myLibrary.find((book) => book.name === originalName);

	book.name = newName;
	book.author = newAuthor;
	book.pages = newPages;
	book.status = newStatus;
	book = myLibrary.find((book) => book.name === newName);
	console.log(myLibrary);
	console.log(book);
}

function onCardClick(e) {
	// check if remove button or remove icon was clicked
	if (
		e.target.className === "remove" ||
		e.target.className === "fa-solid fa-x"
	) {
		const bookName = e.target.closest("[data-name]").dataset.name;

		// Remove element from DOM
		removeFromLibrary(bookName);

		e.target.closest("[data-name]").remove();
	} else if (e.target.className === "state") {
		toggleStatus(e.target);
	} else if (
		e.target.className === "edit" ||
		e.target.className === "fa-solid fa-pen"
	) {
		const bookName = e.target.closest("[data-name]").dataset.name;

		const book = myLibrary.find((book) => book.name === bookName);

		//

		// Populate the form with data of the selected book
		populateForm(book);
		showDialog(e);
	} else {
		return;
	}
}
// Called when edit button is clicked
function populateForm(book) {
	document.getElementById("name").value = book.name;
	document.getElementById("author").value = book.author;
	document.getElementById("pages").value = book.pages;
	document.getElementById("status").checked = book.status;
}

function removeFromLibrary(name) {
	console.log(name);

	myLibrary = myLibrary.filter((book) => book.name !== name);
	console.log(myLibrary);
}

function toggleStatus(button) {
	const bookName = button.closest("[data-name]").dataset.name;
	const book = myLibrary.find((book) => book.name === bookName);

	if (book) {
		console.log(book.status);
		book.status = !book.status;
		button.textContent = book.status ? "Read" : "Not Read";
		console.log(book.status);
	}
}

function showDialog(e) {
	// Check if this event was triggered by the "Add Book" button
	if (e.target === addBtn) {
		// Reset the form and set the button text to "Add"
		bookForm.reset();
		submitBtn.textContent = "Add";
		delete submitBtn.dataset.originalName; // No original name for new books
	} else {
		// If it's for editing, change the button text to "Edit"
		submitBtn.textContent = "Edit";

		// Get the original name of the book
		const bookName = e.target.closest("[data-name]").dataset.name;

		// Save the original name in the submit button
		submitBtn.dataset.originalName = bookName;
	}

	dialog.showModal();
}

function closeDialog(e) {
	bookForm.reset();
	dialog.close();
}

// Event listeners
document.addEventListener("DOMContentLoaded", displayBooks);

addBtn.addEventListener("click", showDialog);

closeBtn.addEventListener("click", closeDialog);

container.addEventListener("click", onCardClick);

bookForm.addEventListener("submit", submitBookForm);