async function fetchBooks(age, interest) {
    // Create a query based on the user's age and interest
    const query = `${age} year old ${interest} books`; 
    // Construct the API URL with the query and set the maximum number of results to 40
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`;

    try {
        // Fetch data from the API URL
        const response = await fetch(API_URL);
        // Parse the response data as JSON
        const data = await response.json();

        // Log the response data to the console for debugging
        console.log(data);

        // Check if there are items in the response data
        if (data.items) {
            // Pass the book data to the display function
            displayBookResults(data.items);
        } else {
            // Display a message if no results are found
            document.getElementById('results').innerHTML = 'No results found.';
        }
    } catch (error) {
        // Log and display an error message if there is an issue fetching the books
        console.error("Error fetching books: ", error);
        document.getElementById('results').innerHTML = 'Error fetching book results.';
    }
}

// Function to display book results
function displayBookResults(books) {
    // Get the results container element
    const resultsDiv = document.getElementById('results');
    // Clear previous results from the container
    resultsDiv.innerHTML = '';

    // Loop through each book in the data
    books.forEach(book => {
        // Create a div element to display each book
        const bookItem = document.createElement('div');
        // Add styling classes to the book item
        bookItem.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-xl', 'transition', 'duration-300', 'ease-in-out');
        
        // Extract book information like title, authors, description, thumbnail, and preview link
        const title = book.volumeInfo.title || 'No title available';
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'No authors available';
        const description = book.volumeInfo.description || 'No description available';
        const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';
        const previewLink = book.volumeInfo.previewLink || '#'; // Link to the book's preview or external link

        // Structure the HTML for each book item
        bookItem.innerHTML = `
            <div class="flex items-start">
                ${thumbnail ? `<img src="${thumbnail}" alt="${title}" class="w-24 h-32 mr-4 object-cover rounded-md">` : ''}
                <div>
                    <h3 class="text-xl font-bold text-gray-800">${title}</h3>
                    <p class="text-gray-600"><strong>Author(s):</strong> ${authors}</p>
                    <p class="text-gray-500 mt-2">${description.length > 200 ? description.substring(0, 200) + '...' : description}</p>
                    <a href="${previewLink}" target="_blank" class="text-blue-600 hover:underline mt-2 block" rel="noopener noreferrer">View Details</a>
                </div>
            </div>
        `;

        // Add a click event to open the book details in a new tab
        bookItem.addEventListener('click', function() {
            window.open(previewLink, '_blank');
        });

        // Append the book item to the results container
        resultsDiv.appendChild(bookItem);
    });
}

// Form submission event listener
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get user input from the form fields
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const age = document.getElementById('age').value; // Added age input field
    const interest = document.getElementById('interest').value;

    // Check parental guidance based on age and interest
    if (age < 18 && interest === 'fiction') {
        // Display an alert if parental guidance is required for fiction genre
        alert('Parental guidance required for this genre.');
        return;
    }

    // Clear previous results before fetching new books
    document.getElementById('results').innerHTML = '';

    // Store user information in local storage
    const userInfo = {
        firstName: firstName,
        lastName: lastName,
        age: age,
        interest: interest
    };
    localStorage.setItem('user', JSON.stringify(userInfo));

    // Fetch books based on the user's interest
    fetchBooks(age, interest);
});