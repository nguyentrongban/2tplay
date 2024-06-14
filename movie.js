document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=";
    let currentPage = 1;
    let totalPages = 1;

    function fetchMovies(page) {
        fetch(apiUrl + page)
            .then(response => response.json())
            .then(data => {
                const movies = data.items;
                if (Array.isArray(movies)) {
                    const movieList = document.getElementById("movie-list");
                    movieList.innerHTML = ""; // Xóa danh sách phim trước khi thêm mới

                    movies.forEach(movie => {
                        const movieDiv = document.createElement("div");
                        movieDiv.className = "movie";
                        movieDiv.setAttribute("data-slug", movie.slug); // Thêm thuộc tính dữ liệu data-slug
                        movieDiv.innerHTML = `
                             <img class="poster-image" src="${movie.poster_url}" alt="${movie.name} Poster" loading="lazy"> <!-- Thêm loading="lazy" vào đây -->
                            <h2>${movie.name}</h2>
                            <p> ${movie.origin_name}</p>
                             `;
                        movieList.appendChild(movieDiv);

                        // Thêm sự kiện click vào div của phim
                        movieDiv.addEventListener("click", function() {
                            handleMovieClick(movie.slug);
                        });
                    });

                    // Cập nhật tổng số trang
                    totalPages = data.pagination.totalPages;

                    // Hiển thị phân trang
                    renderPagination();
                } else {
                    console.error("Expected an array but got:", movies);
                }
            })
            .catch(error => console.error("Error fetching movies:", error));
    }

// Hàm render phân trang
function renderPagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // Xóa nội dung phân trang trước khi render lại

    const visiblePages = 5; // Số trang hiển thị

    // Tính toán vị trí bắt đầu và kết thúc của dãy số trang
    let startPage = currentPage - Math.floor(visiblePages / 2);
    let endPage = currentPage + Math.floor(visiblePages / 2);
    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(totalPages, visiblePages);
    }
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, totalPages - visiblePages + 1);
    }

    // Thêm nút "Trang đầu tiên" nếu cần
    if (startPage > 1) {
        const firstPageButton = document.createElement("button");
        firstPageButton.textContent = "1";
        firstPageButton.addEventListener("click", function() {
            currentPage = 1;
            fetchMovies(currentPage);
        });
        paginationContainer.appendChild(firstPageButton);
        paginationContainer.appendChild(document.createTextNode("... "));
    }

    // Thêm các nút số trang
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.addEventListener("click", function() {
            currentPage = i;
            fetchMovies(currentPage);
        });
        // Đánh dấu màu khác cho trang hiện tại
        if (i === currentPage) {
            pageButton.classList.add("current-page");
        }
        paginationContainer.appendChild(pageButton);
    }

    // Thêm dấu ba chấm nếu cần
    if (endPage < totalPages) {
        paginationContainer.appendChild(document.createTextNode("..."));
        const lastPageButton = document.createElement("button");
        lastPageButton.textContent = totalPages;
        lastPageButton.addEventListener("click", function() {
            currentPage = totalPages;
            fetchMovies(currentPage);
        });
        paginationContainer.appendChild(lastPageButton);
    }
}


    // Hàm xử lý khi click vào movie
    function handleMovieClick(slug) {
        // Chuyển đến trang chi tiết phim với slug trong URL
        window.location.href = `moviedetail.html?slug=${slug}`;
    }

    // Khởi chạy lần đầu
    fetchMovies(currentPage);
});
