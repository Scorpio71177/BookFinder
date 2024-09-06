// Asynchronous function to fetch books from the Google Books API
async function fetchBooks(age, interest) {
    // Create a search query based on the user's age and book interest
    const query = `${age} year old ${interest} books`; 
    
    // Construct the API URL with the query and set the maximum number of results to 40
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`;

    try {
        // Fetch data from the API using the constructed URL
        const response = await fetch(API_URL);
        
        // Convert the response data to JSON format
        const data = await response.json();

        // Log the response data to the console for debugging purposes
        console.log(data);

        // Check if the response contains any book items
        if (data.items) {
            // Call the display function to render the book results in the UI
            displayBookResults(data.items);
        } else {
            // Display a message if no book results are found
            document.getElementById('results').innerHTML = 'No results found.';
        }
    } catch (error) {
        // Log the error to the console if there's an issue with the API request
        console.error("Error fetching books: ", error);
        
        // Display an error message in the UI if the API fetch fails
        document.getElementById('results').innerHTML = 'Error fetching book results.';
    }
}

// Function to display book results in the UI
function displayBookResults(books) {
    // Get the HTML container where the results will be displayed
    const resultsDiv = document.getElementById('results');
    
    // Clear previous results from the container
    resultsDiv.innerHTML = '';

    // Loop through each book in the fetched data
    books.forEach(book => {
        // Create a new div element to hold each book's information
        const bookItem = document.createElement('div');
        
        // Add CSS classes for styling and hover effects using TailwindCSS classes
        bookItem.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-xl', 'transition', 'duration-300', 'ease-in-out');
        
        // Extract the book's title, authors, description, thumbnail image, and preview link from the API response
        const title = book.volumeInfo.title || 'No title available';  // Default to 'No title available' if title is missing
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'No authors available';  // Join authors array if available
        const description = book.volumeInfo.description || 'No description available';  // Default to 'No description available' if missing
        const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';  // Get book's thumbnail if available
        const previewLink = book.volumeInfo.previewLink || '#';  // Get preview link or default to '#'

        // Construct the HTML structure for each book item
        bookItem.innerHTML = `
            <div class="flex items-start">
                ${thumbnail ? `<img src="${thumbnail}" alt="${title}" class="w-24 h-32 mr-4 object-cover rounded-md">` : ''}  <!-- Display thumbnail if available -->
                <div>
                    <h3 class="text-xl font-bold text-gray-800">${title}</h3>  <!-- Display book title -->
                    <p class="text-gray-600"><strong>Author(s):</strong> ${authors}</p>  <!-- Display authors -->
                    <p class="text-gray-500 mt-2">${description.length > 200 ? description.substring(0, 200) + '...' : description}</p>  <!-- Display description, truncated if long -->
                    <a href="${previewLink}" target="_blank" class="text-blue-600 hover:underline mt-2 block" rel="noopener noreferrer">View Details</a>  <!-- Link to book details -->
                </div>
            </div>
        `;

        // Add an event listener for the book item to open the preview link in a new tab when clicked
        bookItem.addEventListener('click', function() {
            window.open(previewLink, '_blank');
        });

        // Append the book item to the results container
        resultsDiv.appendChild(bookItem);
    });
}

// Event listener for the form submission
document.getElementById('userForm').addEventListener('submit', function(event) {
    // Prevent the default form submission behavior to handle via JavaScript
    event.preventDefault();

    // Get user input values from the form fields
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const age = document.getElementById('age').value;  // Get the age input
    const interest = document.getElementById('interest').value;

    // Check if parental guidance is needed based on age and genre
    if (age < 18 && interest === 'fiction') {
        // Show an alert if the user is under 18 and selected 'fiction'
        alert('Parental guidance required for this genre.');
        return;  // Stop form submission if parental guidance is required
    }

    // Clear previous search results before fetching new ones
    document.getElementById('results').innerHTML = '';

    // Store the user information in local storage
    const userInfo = {
        firstName: firstName,
        lastName: lastName,
        age: age,
        interest: interest
    };
    localStorage.setItem('user', JSON.stringify(userInfo));  // Save as JSON in local storage

    // Call the fetchBooks function with the user's age and interest
    fetchBooks(age, interest);
});