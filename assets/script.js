async function fetchBooks(age, interest) {
    const query = `${age} year old ${interest} books`; 
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        console.log(data); // Check the response data in the console

        if (data.items) {
            displayBookResults(data.items); // Pass book data to display function
        } else {
            document.getElementById('results').innerHTML = 'No results found.';
        }
    } catch (error) {
        console.error("Error fetching books: ", error);
        document.getElementById('results').innerHTML = 'Error fetching book results.';
    }
}

// Function to display book results
function displayBookResults(books) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-xl', 'transition', 'duration-300', 'ease-in-out');

        const title = book.volumeInfo.title || 'No title available';
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'No authors available';
        const description = book.volumeInfo.description || 'No description available';
        const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';

        // Structure for each book item
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

        resultsDiv.appendChild(bookItem);
    });
}

// Form submission event listener
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get user input
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const interest = document.getElementById('interest').value;

    // Store user info in local storage
    const userInfo = {
        firstName: firstName,
        lastName: lastName,
        interest: interest
    };
    localStorage.setItem('user', JSON.stringify(userInfo));

    // Fetch books based on the user's interest
    fetchBooks(interest);
});