
var stars = document.querySelectorAll('.star');

// Variable to store the selected rating (1-5)
var selectedRating = 0;

// Add click event to each star
for (var i = 0; i < stars.length; i++) {
    stars[i].addEventListener('click', function() {
        // Get the rating value from the clicked star's data-rating attribute
        selectedRating = parseInt(this.getAttribute('data-rating'), 10);
        
        // Update the visual display of stars
        updateStarDisplay();
    });
}

// Function to update which stars are highlighted (yellow)
function updateStarDisplay() {
    // Loop through all stars
    for (var i = 0; i < stars.length; i++) {
        var starValue = parseInt(stars[i].getAttribute('data-rating'), 10);
        
        // If this star's value is less than or equal to selected rating, make it yellow
        if (starValue <= selectedRating) {
            stars[i].classList.add('selected');
        } else {
            // Otherwise, remove the yellow color
            stars[i].classList.remove('selected');
        }
    }
}

// ========== FORM SUBMISSION HANDLER ==========
// Get the movie form element
var movieForm = document.getElementById('movieForm');

// Add submit event listener to the form
movieForm.addEventListener('submit', function(e) {
    // Prevent page reload on form submission
    e.preventDefault();

    // Validate that user selected a rating
    if (selectedRating === 0) {
        alert('Please select a rating!');
        return; // Stop if no rating selected
    }

    // Get the input values from the form
    var movieTitle = document.getElementById('title').value;
    var movieYear = document.getElementById('year').value;
    var movieGenre = document.getElementById('genre').value;

    // Create a movie object with proper structure
    var newMovie = {
        title: movieTitle,
        year: movieYear,
        genre: movieGenre,
        rating: parseInt(selectedRating, 10)
    };

    // ========== LOCALSTORAGE OPERATIONS ==========
    // Get existing movies from localStorage
    var storedMovies = localStorage.getItem('movies');
    
    // Declare array to hold all movies
    var movieList;
    
    // Check if movies already exist in localStorage
    if (storedMovies) {
        // Parse the JSON string back into an array
        movieList = JSON.parse(storedMovies);
    } else {
        // If no movies exist yet, create empty array
        movieList = [];
    }

    // Check if this title already exists (case-insensitive)
    var normalizedTitle = movieTitle.trim().toLowerCase();
    var existingMovieIndex = -1;
    for (var i = 0; i < movieList.length; i++) {
        if (movieList[i].title.trim().toLowerCase() === normalizedTitle) {
            existingMovieIndex = i;
            break;
        }
    }

    // Add new movie if title does not exist, otherwise update existing movie
    if (existingMovieIndex === -1) {
        movieList.push(newMovie);
    } else {
        // Average the old and new ratings, then overwrite year/genre details
        var oldRating = parseInt(movieList[existingMovieIndex].rating, 10);
        var newRating = parseInt(selectedRating, 10);
        var averagedRating = Math.round((oldRating + newRating) / 2);

        movieList[existingMovieIndex] = {
            title: movieTitle,
            year: movieYear,
            genre: movieGenre,
            rating: averagedRating
        };
    }

    // Save the updated array back to localStorage as JSON string
    localStorage.setItem('movies', JSON.stringify(movieList));

    // Reset the form fields
    movieForm.reset();
    
    // Reset the rating
    selectedRating = 0;
    updateStarDisplay(); // Clear the star selection

    // Update the movie list display
    displayMovieList();
});

// ========== DISPLAY MOVIES FUNCTION ==========
// Function to display all movies from localStorage
function displayMovieList() {
    // Get the container element where movies will be displayed
    var movieContainer = document.getElementById('movieContainer');

    // Retrieve movies from localStorage
    var storedMovies = localStorage.getItem('movies');

    // Check if there are no movies saved
    if (!storedMovies) {
        movieContainer.innerHTML = '<p>No movies added yet. Add your first movie!</p>';
        return;
    }

    // Parse JSON string back into JavaScript array
    var movieList = JSON.parse(storedMovies);

    // Show message if parsed list is empty
    if (movieList.length === 0) {
        movieContainer.innerHTML = '<p>No movies added yet. Add your first movie!</p>';
        return;
    }

    // Clear the container before adding movies
    movieContainer.innerHTML = '';

    // Loop through each movie in the array
    for (var i = 0; i < movieList.length; i++) {
        var currentMovie = movieList[i];
        
        // Create yellow stars for the rating
        var yellowStars = '';
        for (var j = 0; j < currentMovie.rating; j++) {
            yellowStars += '★'; // Add filled star
        }

        // Build the HTML for this movie with delete button
        var movieHTML = '<div class="movie-item">';
        movieHTML += '<div class="movie-content">';
        movieHTML += '<div class="movie-title">' + currentMovie.title + ' (' + currentMovie.year + ')</div>';
        movieHTML += '<div class="movie-info">' + currentMovie.genre + '</div>';
        movieHTML += '<div class="movie-rating">' + yellowStars + '</div>'; // Yellow stars
        movieHTML += '</div>';
        movieHTML += '<button class="delete-btn" data-index="' + i + '">Delete</button>';
        movieHTML += '</div>';

        // Add the movie HTML to the container
        movieContainer.innerHTML += movieHTML;
    }
    
    // Add event listeners to all delete buttons
    var deleteButtons = document.querySelectorAll('.delete-btn');
    for (var k = 0; k < deleteButtons.length; k++) {
        deleteButtons[k].addEventListener('click', function() {
            // Get the index of the movie to delete
            var movieIndex = this.getAttribute('data-index');
            deleteMovie(movieIndex);
        });
    }
}

// ========== DELETE MOVIE FUNCTION ==========
// Function to delete a movie from the list
function deleteMovie(index) {
    // Get movies from localStorage
    var storedMovies = localStorage.getItem('movies');
    
    if (storedMovies) {
        // Parse the JSON string to array
        var movieList = JSON.parse(storedMovies);
        
        // Get the movie title for confirmation message
        var movieIndex = parseInt(index, 10);
        var movieToDelete = movieList[movieIndex];
        
        // Show confirmation dialog
        var confirmDelete = confirm('Are you sure you want to delete "' + movieToDelete.title + '"?');
        
        // Only delete if user confirmed
        if (confirmDelete) {
            // Remove the movie at the specified index
            movieList.splice(movieIndex, 1);
            
            // Save the updated array back to localStorage
            localStorage.setItem('movies', JSON.stringify(movieList));
            
            // Refresh the display
            displayMovieList();
        }
    }
}

// ========== PAGE LOAD EVENT ==========
// When the page loads, display all saved movies
window.addEventListener('load', function() {
    displayMovieList();
});


