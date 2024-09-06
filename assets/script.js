// Function to fetch books based on age and interest
async function fetchBooks(age, interest) {
    // Create a query string based on the user's age and interest
    const query = `${age} year old ${interest} books`; 
    // Construct the API URL with the query string and set the maximum number of results to 40
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`;

    try {
        // Fetch data from the API URL
        const response = await fetch(API_URL);
        // Convert the response to JSON format
        const data = await response.json();

        // Log the response data to the console for debugging
        console.log(data);

        // Check if there are items in the response data
        if (data.items) {
            // If items exist, pass the book data to the display function
            displayBookResults(data.items);
        } else {
            // If no items found, display a message in the results section
            document.getElementById('results').innerHTML = 'No results found.';
        }
    } catch (error) {
        // Handle any errors that occur during fetching data
        console.error("Error fetching books: ", error);
        // Display an error message in the results section
        document.getElementById('results').innerHTML = 'Error fetching book results.';
    }
}

// Function to display book results in the UI
function displayBookResults(books) {
    // Get the results container element
    const resultsDiv = document.getElementById('results');
    // Clear any previous results in the container
    resultsDiv.innerHTML = '';

    // Iterate through each book in the array of books
    books.forEach(book => {
        // Create a new div element for each book item
        const bookItem = document.createElement('div');
        // Add styling classes to the book item
        bookItem.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-xl', 'transition', 'duration-300', 'ease-in-out');

        // Extract book details like title, authors, description, and thumbnail
        const title = book.volumeInfo.title || 'No title available';
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'No authors available';
        const description = book.volumeInfo.description || 'No description available';
        const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';

        // Structure the content for each book item
        bookItem.innerHTML = `
            <div class="flex items-start">
                ${thumbnail ? `<img src="${thumbnail}" alt="${title}" class="w-24 h-32 mr-4 object-cover rounded-md">` : ''}
                <div>
                    <h3 class="text-xl font-bold text-gray-800">${title}</h3>
                    <p class="text-gray-600"><strong>Author(s):</strong> ${authors}</p>
                    <p class="text-gray-500 mt-2">${description.length > 200 ? description.substring(0, 200) + '...' : description}</p>
                </div>
            </div>
        `;

        // Append the book item to the results container
        resultsDiv.appendChild(bookItem);
    });
}

// Event listener for form submission
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get user input values from the form
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const interest = document.getElementById('interest').value;

    // Store user info in local storage for future use
    const userInfo = {
        firstName: firstName,
        lastName: lastName,
        interest: interest
    };
    localStorage.setItem('user', JSON.stringify(userInfo));

    // Fetch books based on the user's interest
    fetchBooks(interest);
});